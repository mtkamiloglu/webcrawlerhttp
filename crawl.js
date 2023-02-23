const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if(currentURLObj.hostname !== baseURLObj.hostname){
        return pages
    }

    const normalizedURL = normalizeURL(currentURL)
    if(pages[normalizedURL] > 0){
        pages[normalizedURL]++
        return pages
    }

    pages[normalizedURL] = 1

    console.log(`actively crawling: ${currentURL}`)
    let htmlBody = ``
    try{
        const resp = await fetch(currentURL)

        if(resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL }`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType}, on page: ${currentURL }`)
            return pages
        }

        htmlBody = await resp.text()
    } catch(err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }

    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for (const nextURL of nextURLs){
        pages = await crawlPage(baseURL, nextURL, pages)
    }

    return pages
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window._document.querySelectorAll('a')
    
    for(const linkElement of linkElements){
        if(linkElement.href.slice(0,1) === '/'){
            //relative URL
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with relative url: ${err.message}`)
            }
        }
        else{
            // absolute URL
            try{
                const urlObj = new URL(linkElement.href)
            urls.push(urlObj.href)    
            } catch (err) { 
                console.log(`error with absolute path: ${err.message}`)
            }
            
        }
    }
    return urls
}

function normalizeURL(urlString){
    const urlObject = new URL(urlString)
    let fullPath = `${urlObject.host}${urlObject.pathname}`
    if(fullPath.length > 0 && fullPath.slice(-1) === '/'){
        return fullPath.slice(0, -1)
    }
    return fullPath
}

//makes the function inside of it available to other js files
module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
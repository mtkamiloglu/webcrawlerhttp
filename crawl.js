const { JSDOM } = require('jsdom')

async function crawlPage(currentURL){
    console.log(`actively crawling: ${currentURL}`)

    try{
        const resp = await fetch(currentURL)

        if(resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL }`)
            return
        }

        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType}, on page: ${currentURL }`)
            return
        }

        console.log(await resp.text())
    } catch(err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    
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
                console.log(`error with relaitve url: ${err.message}`)
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
    const hostpath = `${urlObject.hostname}${urlObject.pathname}`
    if(hostpath.length > 0 && hostpath.slice(-1) === '/'){
        return hostpath.slice(0, -1)
    }
    return hostpath
}

//makes the function inside of it available to other js files
module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
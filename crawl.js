const { JSDOM } = require('jsdom')

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
    getURLsFromHTML
}
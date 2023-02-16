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
    normalizeURL
}
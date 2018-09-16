class API {
    constructor(loadArticles, saveArticles) {
        this.loadArticles = loadArticles
    }
}

const routers = [
    "https://cors-anywhere.herokuapp.com/",
    "http://alloworigin.com/get?url=",
    "http://www.whateverorigin.org/get?url=",
    "http://anyorigin.com/go?url="
];

/**
 * A wrapper function for fetch that works with CORS.
 */
const fetchCORS = (url, options = {}, routerI = 0) =>
    fetch(routers[routerI] + url, options)
    .catch(() =>
        ++routerI < routers.length ? fetchCORS(url, options, routerI) : null
    );
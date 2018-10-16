const API_ROOT = "https://api.myjson.com/bins";

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
    fetchTimeout(routers[routerI] + url, options)
    .catch(() =>
        ++routerI < routers.length ? fetchCORS(url, options, routerI) : null
    );

/**
 * Fetch with timeout functionality.
 */
const fetchTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), timeout)
        )
    ]);
}

/**
 * Loads a myjson document. Each line in the myjson document should be a
 * different link to an article.
 */
const loadArticles = (url) =>
    fetch(url).then(r => r.json()).then(r => r.articles)

/**
 * Creates a new myjson with the myjson api. Each line in the myjson is
 * an article URL.
 *
 * Returns a string pointing to the myjson.
 */
const saveArticles = (articles) =>
    fetch(API_ROOT, {
        method: "POST",
        body: JSON.stringify({
            articles
        }),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    }).then(r => r.json());

/**
 * Return a promise that returns a div element with the HTML of the webpage
 * at the url contained inside.
 *
 * Automatically filters out <img> tags because those would never load.
 */
const getDocument = (url, tagsToRemove = []) =>
    fetchCORS(url)
    .then(r => {
        let ret;
        try { // no idea why this error is here.
            ret = r.text()
            return ret;
        } catch(e) {}
    })
    .then(r => {
        //r = removeTags(r, tagsToRemove); // TODO is this much of a speed difference as opposed to removing the tags with html functions?

        const div = document.createElement("div");
        div.innerHTML = r;
        return div;
    });

/**
 * Open the document at url, return all elements with the selector.
 */
const crawl = (url, selector) =>
    getDocument(url).then(doc => {
        return {
            source: url,
            links: Array.from(doc.querySelectorAll(selector))
        }
    });

/**
 * Loads the search utility to be packaged into the zip file.
 */
const loadUtility = (os) =>
    fetch(`/utility/${
        {
            Mac: "utility-macos",
            Linux: "utility-linux",
            Win: "utility-win.exe",
            "X11": "utility-linux"
        }[os]
    }`)
    .then(r => r.blob());
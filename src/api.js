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
    fetch(routers[routerI] + url, options)
    .catch(() =>
        ++routerI < routers.length ? fetchCORS(url, options, routerI) : null
    );

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
    .then(r => r.text())
    .then(r => {
        r = removeTags(r, tagsToRemove);

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
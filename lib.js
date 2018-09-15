const API_ROOT = "https://api.myjson.com/bins";

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
 * Remove duplicated elements from an array.
 *
 * This is slow and inefficient. See if this causes problems as the number
 * of articles grows. If so, use a more efficient method.
 */
const removeDuplicates = (arr) =>
    arr.filter((el, i) => arr.indexOf(el) === i);

/**
 * Return a promise that returns a div element with the HTML of the webpage
 * at the url contained inside.
 */
const getDocument = (url) =>
    fetchCORS(url)
    .then(r => r.text())
    .then(r => {
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
 * Given a blob, starts a download for the user to download this file.
 */
const download = (blob) => {
    const url = URL.createObjectURL(blob);

    const a = Object.assign(
        document.createElement("a"), {href: url, download: "ottofiler.zip"}
    );
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
}

/**
 * Stuff articles into massive pdf. User downloads pdf.
 *
 * Size is the maximum number of megabytes to download.
 *
 * TODO: Also download summaries. Well, now it's not needed if you do PDF idea.
 * TODO: Maybe don't do chrome PDF download? I don't know how easy it is to
 * download to an external HDD from chrome. Also, is the PDF searching enough?
 */
const generateZIP = (articles, size = 1024) => {
    const zip = new JSZip();
    const fullArticles = zip.folder(".articles");
    const summaries = zip.folder(".summaries");

    const promises = [];
    let id = 0;

    for(article of articles) {
        console.log(article);
        promises.push(getDocument(article).then(html => {
            fullArticles.file(`article${id++}.html`, html.innerHTML);
        }));
    }

    Promise.all(promises)
    .then(() => zip.generateAsync({type: "blob"}))
    .then((blob) => download(blob))
}
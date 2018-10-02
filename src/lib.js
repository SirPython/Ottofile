const API_ROOT = "https://api.myjson.com/bins";

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
 * Returns an array of the words in a string.
 */
const words = (str) => str.split(/[^a-zA-Z-]+/).filter(Boolean);

/**
 * Returns an array of the sentences in a string.
 */
const sentences = (str) =>
    str.split(/[\.\?\!]/).filter(Boolean).map(sent => sent.trim());

/**
 * Sorts an object based on the values in the k:v pairs.
 */
const sortObj = (obj) => {
    const arr = [];
    const ret = {};

    for(const key in obj) {
        arr.push({key: key, val: obj[key]})
    }

    arr.sort((a,b) => b.val - a.val)

    for(const pair of arr) {
        ret[pair.key] = pair.val;
    }

    return ret;
}

/**
 * Generates a summary of a text. Uses the algorithm from smmry.com.
 *
 * 1. TODO Associate words with grammatical counterparts (city and cities)
 * 2. Count the occurance of each word in a text.
 * 3. Split up the text by sentences (wathcing out for e.g. 'Mr.')
 * 4. Rank sentences by most occuring words.
 * 5. Return X number of sentences based on rank.
 *
 * TODO should numSenteces be numerical max or a percent of the total sentecnes?
 */
const summarize = (text, numSentences = 10) => {
    const freqs = {};
    for(let word of words(text)) {
        freqs[word.toLowerCase()] = freqs[word.toLowerCase()]
            ? freqs[word.toLowerCase()] + 1
            : 1;
    }

    const ranks = {};
    for(let sentence of sentences(text)) {
        ranks[sentence] = 0;

        for(let word of words(sentence)) {
            ranks[sentence] += freqs[word];
        }
    }

    const sorted = sortObj(ranks);

    const ret = [];
    for(let i = 0; i < numSentences; i++) {
        ret.push(Object.keys(sorted)[i]);
    }
    return ret.filter(Boolean);
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
    const fullArticles = zip.folder(".articles"); // TODO MAKE HIDDEN and user searches with utility
    const summaries = zip.folder(".summaries");

    const promises = [];
    window.downloaded = 0;

    for(const article of articles) {
        promises.push(
            getDocument(article)
            .then(html => {
                fullArticles.file(`article${downloaded++}.html`, html.innerHTML);
                summaries.file(`article${downloaded}-summary.txt`, summarize(html.innerText))
            })
        );
    }

    Promise.all(promises)
    .then(() => zip.generateAsync({type: "blob"}))
    .then((blob) => download(blob))
}
const to = (type) => (r) => r[type]();

const createElement = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div;
}

const congregateArticles = ({source, links}) => {
    const articles = [];
    links.forEach(link =>
        articles.push(source + link.pathname)
    )
    return articles;
}

const removeEls = (q) => (doc) => {
    for(const el of Array.from(doc.querySelectorAll(q))) {
        el.remove();
    }
    return doc;
}

const every = (iter, fn, limit = null) => {
    // This way objects can be used as well
    iter = Array.isArray(iter) ? iter : Object.keys(iter);

    const promises = [];

    for(const el of iter) {
        if(limit !== null) {
            if(limit-- === 0) {
                break;
            }
        }
        promises.push(fn(el));
    }

    return Promise.all(promises);
}

const blobDownload = (blob, name) => {
    const url = URL.createObjectURL(blob);

    const a = Object.assign(
        document.createElement("a"), {href: url, download: name}
    );
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

const getArticleText = (html) =>
    Array.from(html.getElementsByTagName("p")).reduce(
        (a, b) => `${a}\n${b.textContent}`,
        ""
    );

/**
 * 1. Use NLP Compromise to find all the date-related strings in a document.
 * 2. Try to turn each date string into a Date object.
 * 3. If it works, then return the first one cause that's probably correct.
 */
const getArticleDate = (text) => {
    window.text = text;

    for(const date of nlp(text).dates().data()) {
        const obj = new Date(date.normal);
        if(!isNaN(obj.getDate())) {
            return obj;
        }
    }
}
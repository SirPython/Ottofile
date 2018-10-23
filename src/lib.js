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

const every = (iter, fn) => {
    const promises = [];

    for(const el of iter) {
        promises.push(
            getDocument(article).then(r => removeEls("link, script, img, meta"))
        );
    }

    return Promise.all(promises);
}
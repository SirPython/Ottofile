const to = (type) => (r) => r[type]();

const createElement = (html) => {
    const div = document.createElement("div");
    console.log("before", html.length)
    /*html = html.replace(
        /<(script|meta|style|).*>.*<\/(script|meta|style)>/gmi,
        ""
    );
    html = html.replace(
        /<(img|link).*(>|\/>)/gmi,
        ""
    );*/
    // TODO: is this faster with the "y" flag, or is it slower because we have
    // to make a new regexp each time? or can you use the constant (above)
    // notation, and it works properly?
    // this is incredibly slow and can take several minutes for large
    // documents. like if there are 1,000,000+ characters it takes about
    // 4 minutes. it may even be worth it to not bother with removing
    // the tags if there is too much text. do benchmarks. also texts
    // that have a lot of these tags taka about 20 seconds i'd say (if they're
    // at like 150k characters). I think that y flag is really necessary,
    // as long as it works because the first time it didn't work i don' think.
    const regex1 = new RegExp("(script|meta|style|).*>.*<\/(script|meta|style)>", "gmiy");
    const regex2 = new RegExp("<(img|link).*(>|\/>)", "gmiy");

    html = html.replace(
        regex1,
        ""
    );
    html = html.replace(
        regex2,
        ""
    );

    console.log('after', html.length);
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
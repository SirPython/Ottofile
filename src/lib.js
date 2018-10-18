const loadSavedArticles = () => {
    const api = localStorage.getItem("articles");

    return api
        ? fetch(api).then(r => r.json()).then(r => r.articles)
        : Promise.resolve(null);
}


const autofile = (sources) => {
    const promises = [];

    for(href in sources) {
        promises.push(
            crawl(href, sources[href])
                .then(({source, links}) => {
                    const articles = [];
                    links.forEach(link =>
                        articles.push(source + link.pathname)
                    )
                    return articles;
                })
        );
    }

    return Promise.all(promises);
}


const crawl = (url, selector) =>
    getDocument(url)
        .then(doc => {
            return {
                source: href,
                links: Array.from(doc.querySelectorAll(selector))
            }
        })


const getDocument = (url, tagsToRemove = []) =>
    GET(url)
        .then(r => r.text())
        .then(r => {
            const div = document.createElement("div");
            div.innerHTML = r;
            return div;
        });


const GET = (
    url,
    options = {},
    i = 0,
    routers = [
        "https://cors-anywhere.herokuapp.com/",
        "http://alloworigin.com/get?url=",
        "http://www.whateverorigin.org/get?url=",
        "http://anyorigin.com/go?url="
    ]
) =>
    fetch(routers[i] + url, options)
        .catch(_ =>
            (++i) < routers.length
                ? GET(url, options, i, routers)
                : null
        )


const removeDuplicates = (arr) =>
    arr.filter((el, i) => arr.indexOf(el) === i);


const saveArticles = (articles) =>
    fetch("https://api.myjson.com/bins", {
        method: "POST",
        body: JSON.stringify({
            articles
        }),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    }).then(r => r.json());


const removeEls = (doc, q) => {
    for(const el of Array.from(doc.querySelectorAll(q))) {
        el.remove();
    }
}

const loadArticles = (articles) => {
    const promises = [];

    for(article of articles) {
        promises.push(
            getDocument(article)
            .then(r => {
                removeEls(article, "link, script, img, meta")
                // TODO IF SCRIPTS AREN'T BEING REMOVED, MAYBE REMOVEELS IS ACTUALLY A PURE FUNCTION INSTEAD AND DOESN'T MODIFY article
                global.downloaded.update("downloaded", article);

                return r;
            })
        );
    }

    return Promise.all(promises);
}



const downloadPDF = (articles) => {
    const html = document.createElement("div");
    for(const article of articles) {
        html.appendChild(article);
    }

    const doc = new jsPDF();
    doc.text(docs.innerText);
    doc.save("ottofiles.pdf");
}
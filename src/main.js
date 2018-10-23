const loadSavedArticles = () => {
    const api = localStorage.getItem("articles");

    return api
        ? fetch(api).then(to("json")).then(r => r.articles)
        : Promise.resolve(null);
}

const autofile = (sources) => {
    const promises = [];

    for(href in sources) {
        promises.push(
            crawl(href, sources[href])
                .then(congregateArticles)
                .then(state.addArticles)
        );
    }

    return Promise.all(promises);
}

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
    }).then(to("json"));

const loadArticles = (articles) => {
    const promises = [];

    let TEMP = 0;

    for(const article of articles) {
        if(TEMP++ > 10) { break;}
        promises.push(
            getDocument(article)
            .then(r => pass(r,r))
            .then(removeEls("link, script, img, meta"))
            .then(state.addDownloaded)
        );
    }

    return Promise.all(promises);
}

const downloadPDF = (articles) => {
    console.log(articles);
    const html = document.createElement("div");
    for(const article of articles) {
        html.appendChild(article);
    }

    const doc = new jsPDF();
    doc.text(html.innerText);
    doc.save("ottofiles.pdf");
}
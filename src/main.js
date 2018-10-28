const loadSavedArticles = () => {
    const api = localStorage.getItem("articles");

    return api
        ? fetch(api).then(to("json")).then(r => r.articles)
        : Promise.resolve(null);
}

const autofile = (sources) =>
    every(
        sources,
        (href) => crawl(href, sources[href])
            .then(congregateArticles)
            .then(state.addArticles)
    );

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

const saveLink = ({uri}) => localStorage.setItem("articles", uri)

const downloadArticles = (articles) =>
    every(
        articles,
        (article) => getDocument(article).then(state.addDownloaded), // TODO Don't modify state in pure functions
        10 //debug only
    );

const packageArticles = (articles, zip) => {
    for(let i = 0; i < articles.length; i++) {
        zip.file(`${i+1}.txt`, articles[i].innerText);
    }
}

const packageUtility = (utility, zip) => zip.file("00utility", utility);
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

const downloadArticles = (folder, articles) =>
    every(
        articles,
        (article) => getDocument(article).then(addDownloaded)
    );

const packageArticles = (articles, zip) => {
    for(let i = 0; i < articles.length; i++) {
        zip.file(`${i}.txt`, articles[i].innerText);
    }
}

const packageUtility = (utility) => zip.file("00utility", utility)

const downloadZIP = (articles, size = 1024) => {
    window.zip = new JSZip();
    const fullArticles = zip.folder("articles");

    const promises = [];

    let devCount = 0; // so doesn't take long in development
    let downloaded = 0;

    for(const article of articles) {
        //if(DEVELOPMENT && devCount++ > 10) { continue; }

        promises.push(

        );
    }

    promises.push(loadUtility());



    Promise.all(promises)
    .then(r => {
        zip.file("utility", r.pop())
        return zip.generateAsync({type: "blob"})
    })
    .then(r => blobDownload(r, "ottofiles.zip"));
}
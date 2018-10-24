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
            //.then(removeEls("link, script, img, meta"))
            .then(state.addDownloaded)
        );
    }

    return Promise.all(promises);
}

const downloadZIP = (articles, size = 1024) => {
    window.zip = new JSZip();
    const fullArticles = zip.folder("articles");

    const promises = [];

    let devCount = 0; // so doesn't take long in development
    let downloaded = 0;

    for(const article of articles) {
        //if(DEVELOPMENT && devCount++ > 10) { continue; }

        promises.push(
            getDocument(article)
            .then(html => {
                //html = removeEls("link,script,img,meta,style")(html);

                fullArticles.file(
                    `article${downloaded++}.txt`,
                    html.innerText
                );
                console.log(downloaded);
            })
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
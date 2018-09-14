const SOURCES = "sources.json";

let articles = [];

fetch(SOURCES)
.then(r => r.json())
.then(sources => {
    const promises = [];

    const myjson = localStorage.getItem("articles");
    if(myjson) {
        promises.push(loadArticles(myjson).then(r => articles = articles.concat(r)));
    }

    for(source in sources) {
        promises.push(
            crawl(source, sources[source])
            .then(({links, source}) =>
                links.forEach(
                    link => articles.push(source + link.pathname.substring(1))
                )
            )
        );
    }
    return Promise.all(promises);
})
.then(() => {
    articles = removeDuplicates(articles);
    saveArticles(articles).then(link => {
        localStorage.setItem("articles", link.uri);
    });
});
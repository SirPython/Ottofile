const SOURCES = "src/sources.json";

UI.register("articles", ($) => $("num_filed").innerText = articles.length)
UI.register("sources", ($) => $("num_sources").innerText = Object.keys(sources).length);

window.articles = [];

fetch(SOURCES)
.then(r => r.json())
.then(sources => {
    window.sources = sources;
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
                    link => articles.push(source + link.pathname)
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
const CORS_BYPASS = `https://cors-anywhere.herokuapp.com/`;
const SOURCES = "sources.json";

/* The promise to load old articles and the promises to add news ones are
put here so that no removing of duplicates or saving is done before everything
is loaded. */
const promises = [];

const myjson = localStorage.getItem("articles");
articles = [];
if(myjson) {
    promises.push(loadArticles(myjson).then(r => articles = r));
}

fetch(SOURCES)
.then(r => r.json())
.then(sources => {
    for(source in sources) {
        promises.push(
            crawl(CORS_BYPASS + source, sources[source])
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
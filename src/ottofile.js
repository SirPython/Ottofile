let articles = []; // bad

const UI = {
    load:
        fetch("src/sources.json")
            .then(r => r.json())
            .then(r => Promise.all([loadSavedArticles(), autofile(r)]))
            .then(r => removeDuplicates(r[0].concat(r[1])))
            .then(r => {articles = r; saveArticles(r)}),
    download:
        loadArticles(articles)
            .then(r => download(r[0])),

    update: (() => {
        const els = {};

        return (id, value) => {
            if(id in els) {
                els[id].value = value;
            }
            els[id] = document.getElementById(id);
            els[id].value = value;
        }
    })()
}
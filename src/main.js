let articles = [];

global.win.onload =
    fetch("src/sources.json")
        .then(r => r.json())
        .then(r => Promise.all([loadSavedArticles(), autofile(r)]))
        .then(r => removeDuplicates(r[0].concat(r[1])))
        .then(r => {articles = r; saveArticles(r)});

global.download.onclick = () =>
    loadArticles(articles)
        .then(r => downloadPDF(r[0]))
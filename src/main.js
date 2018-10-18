const global = {
    win: window,
    download: document.getElementById("download"),
    downloaded: {
        el: document.getElementById("downloaded"),
        val: []
    },
    allArticles: {
        el: document.getElementById("num_filed"),
        val: []
    },

    update: (el, val) => {
        global[el].val.push(val)
        global[el].el.value = global[el].val.length
    },
    get: (el) => global[el].val
};

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
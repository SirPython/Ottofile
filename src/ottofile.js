let articles = []; // bad

const pass = (r, message) => {console.log(message); return r}

const UI = {
    load: () => {
        fetch("src/sources.json")
            .then(to("json"))
            .then(r => Promise.all([
                loadSavedArticles()
                    .then(state.addArticles),
                autofile(r)
            ]))
            //.then(r => pass(r, "** on to remove"))
            //.then(removeDuplicates(state.store.getState().articles))
            //    .then(r => pass(r, r))
            //    .then(state.setArticles)
            .then(saveArticles)
    },

    download: () => {
        //loadArticles(state.store.getState().articles)
            //.then(r => download(r))
        downloadZIP(state.store.getState().articles)
    },

    update: (() => {
        const els = {};

        return (id, value) => {
            if(id in els) {
                els[id].value = value;
            }
            els[id] = document.getElementById(id);
            els[id].value = value;
        }
    })(),

    els: {
        numFiled: document.getElementById("num_filed"),
        downloaded: document.getElementById("downloaded")
    }
}

UI.load();

state.store.subscribe(() => {
    const current = state.store.getState();
    console.log(current);

    UI.els.numFiled = current.articles.length;
    UI.els.downloaded = current.articles.downloaded
});
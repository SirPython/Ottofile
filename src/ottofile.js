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

    /* TODO memoize? */
    update: (() => {
        const els = {};

        return (id, value) => {
            if(id in els) {
                els[id].innerText = value;

            }

            els[id] = document.getElementById(id);
            els[id].innerText = value;
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
    console.log("*** state", current, UI.els);

    UI.update("num_filed", current.articles.length);

    if(current.articles.downloaded) {
        UI.update("downloaded", current.articles.downloaded);
    }
});
let articles = []; // bad

const pass = (r, message) => {console.log(message); return r}

const UI = {
    load: () =>
        loadSavedArticles()
            .then(state.addArticles),

    file: () =>
        fetch("src/sources.json")
            .then(state.toggleFiling)
            .then(to("json"))
            .then(autofile)
            .then(r => removeDuplicates(
                    [
                        ...r,
                        ...state.store.articles
                    ].flat()
                )
            )
            .then(state.setArticles)
            .then(saveArticles)
            .then(saveLink)
            .then(state.toggleFiling),

    download: () =>
        downloadArticles(state.store.articles)
            .then(r => packageArticles(r, state.store.zip))
            .then(loadUtility)
            .then(r => packageUtility(r, state.store.zip))
            .then(_ => state.store.zip.generateAsync({type: "blob"}))
            .then(r => blobDownload(r, "ottofiles.zip")),

    update: (() => {
        const els = {};

        return (id, value) => {
            if(id in els) {
                els[id].innerText = value;

            }

            els[id] = document.getElementById(id);
            els[id].innerText = value;
        }
    })()
};

state.register((store) => {
    UI.update("num_filed", store.articles.length);

    if(store.filing) {
        UI.update("still_filing", "Filing...")
    } else {
        UI.update("still_filing", "")
    }

    if(store.downloaded) {
        let percent = Math.round(
            store.downloaded / store.articles.length
        );

        UI.update(
            "downloaded",
            `Downloaded: ${store.downloaded} (${percent}%)`);
    }
});
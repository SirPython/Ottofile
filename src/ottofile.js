let articles = []; // bad

const pass = (r, message) => {console.log(message); return r}

const UI = {
    load: () =>
        loadSavedArticles()
            .then(state.addArticles),

    file: () =>
        fetch("src/sources.json")
            .then(to("json"))
            .then(autofile)
            /* TODO remove duplicates */
            .then(r => saveArticles([...state.store.articles, ...r])),
            //TODO: YOU'VE GOTTA SAVE THE NEW LINK TO THE LOCALSTORAGE

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

state.register((current) => {
    UI.update("num_filed", current.articles.length);

    if(current.articles.downloaded) {
        UI.update("downloaded", current.articles.downloaded);
    }
});
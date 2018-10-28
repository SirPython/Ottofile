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
            /* TODO remove duplicates */
            .then(saveArticles)
    },

    download: () =>
        downloadArticles(state.articles)
            .then(r => packageArticles(r, state.zip))
            .then(loadUtility)
            .then(packageUtility)
            .then(_ => zip.generateAsync({type: "blob:"}))
            .then(r => blobDownload(r, "ottofiles.zip"))

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
}

UI.load();

state.register((current) => {
    UI.update("num_filed", current.articles.length);

    if(current.articles.downloaded) {
        UI.update("downloaded", current.articles.downloaded);
    }
});
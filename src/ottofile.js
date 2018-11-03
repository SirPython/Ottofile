const UI = {
    load: () =>
        loadSavedArticles()
            .then(state.addArticles),

    /**
     * 1. Get query strings for finding the article links for each source
     * 2. Autofile each link
     * 3. Go through all the newly filed articles and all the saved ones
     * and remove all duplicates
     * 4. Save the articles to myJSON
     * 5. Save the myJSON link to localstorage.
     */
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

    /**
     * 1. Get the article text from each saved article
     * 2. Stick the text into a zip
     * 3. Download the search utility
     * 4. Stick the utility in that zip
     * 5. Convert the zip to a blob
     * 6. Give the user a blob download
     */
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
        let percent = (
            store.downloaded / store.articles.length
        ).toFixed(2);

        UI.update(
            "downloaded",
            `Downloaded: ${store.downloaded} (${percent}%)`);
    }
});
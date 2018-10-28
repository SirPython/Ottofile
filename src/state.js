const state = (() => {
    let listener = null;

    const store = {
        articles: [],
        downloaded: 0,
        total: null,
        zip: new JSZip()
    };

    const register = (fn) => listener = fn;

    const stateChange = () => {
        if(listener) {
            listener(store);
        }
    }

    /**
     * This returns the arg so that setters can be used in promise chains
     * and return values will be carried through, so state can be modified
     * on the go. See downloadArticles for an example.
     */
    const setterfn = (fn) => (arg) => {
        fn(arg);
        stateChange();
        return arg;
    }

    const setters = {
        addArticles:
            (articles) => store.articles = store.articles.concat(articles),

        addDownloaded:
            () => store.downloaded += 1,

        setTotal:
            (total) => store.total = total,

        setArticles:
            (articles) => store.articles = articles
    }

    for(const setter in setters) {
        setters[setter] = setterfn(setters[setter]);
    }

    return {
        ...setters,
        register,
        ...store
    }
})()
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

    const setterfn = (fn) => (arg) => {
        fn(arg);
        stateChange();
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
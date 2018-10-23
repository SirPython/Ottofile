const state = (() => {
    const store = Redux.createStore((state = {articles: [], downloaded: 0, total: null}, action) => {
        switch(action.type) {
            case "ADD_ARTICLES":
                return {
                    articles: state.articles.concat(action.articles),
                    downloaded: state.downloaded
                }
                break;

            case "ADD_DOWNLOADED":
                return {
                    articles: state.articles,
                    downloaded: state.downloaded + 1
                }

            case "SET_TOTAL":
                return {
                    articles: state.articles,
                    downloaded: state.downloaded,
                    total: action.total
                }

            case "SET_ARTICLES":
                return {
                    articles: action.articles,
                    downloaded: state.downloaded,
                    total: action.total
                }

            default:
                return state
        }
    });

    const addArticles = (articles) => {
        store.dispatch({
            type: "ADD_ARTICLES",
            articles
        });
        return articles;
    }

    const addDownloaded = (r) => {
        store.dispatch({
            type: "ADD_DOWNLOADED",
        });
        return r;
    }

    const setTotal = (total) => {
        store.dispatch({
            type: "SET_TOTAL",
            total
        });
        return total;
    }

    const setArticles = (articles) => {
        store.dispatch({
            type: "SET_ARTICLES",
            articles
        });
        return articles;
    }

    return {
        store,
        addArticles,
        addDownloaded,
        setTotal,
        setArticles
    };
})();
window.UI = (() => {
    const elems = {};
    const variables = {};

    /**
     * Wrapper for document.getElementById, but registers elements in a dict
     * so that function isn't called too many times.
     */
    const $ = (id) => {
        if(id in elems) {
            return elems[id];
        }
        elems[id] = document.getElementById(id);
        return elems[id];
    }

    /**
     * Hacky.
     */
    const isEqual = (a, b) => (a ? a.toString() : null) === (b ? b.toString() : null);

    /**
     * Registers a global variable to be watched for changes. If it changes,
     * fn is called.
     */
    const register = (variable, fn, delay = 100) => {
        variables[variable] = window[variable];

        setInterval(() => {
            try {
                if(!isEqual(window[variable], variables[variable])) {
                    fn($);
                    variables[variable] = window[variable];
                }
            } catch (e) {}
        }, delay);
    }

    return {
        register
    }
})();

const download = () => {
    window.downloaded = 0;

    switch(document.forms[0].format.value) {
        case "zip":
            downloadZip(articles);

            break;
        case "pdf":
            downloadPDF(articles);

            break;
    }
}
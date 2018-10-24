const crawl = (url, selector) =>
    getDocument(url)
        .then(doc => {
            return {
                source: href,
                links: Array.from(doc.querySelectorAll(selector))
            }
        })

const getDocument = (url, tagsToRemove = []) => {
    console.log(url.indexOf("http://localhost:8080"), url.indexOf("http://localhost:8080") !== -1)
    if(url.indexOf("http://localhost:8080") !== -1) {console.log("skip");return document.createElement("div");}

    return GET(url)
    .then((r) => {
        if(r === null) {return null;}
        return to("text")(r);
    }).then((r) => {
        if (r=== null){ return "";}
        return createElement(r);
    });
}

const GET = (
    url,
    options = {},
    i = 0,
    routers = [
        "https://cors-anywhere.herokuapp.com/",
        "http://alloworigin.com/get?url=",
        "http://www.whateverorigin.org/get?url=",
        "http://anyorigin.com/go?url="
    ]
) => {


    return fetch(routers[i] + url, options)
        .catch(_ =>
            (++i) < routers.length
                ? GET(url, options, i, routers)
                : null
        )
}

const loadUtility = (
    os = (() => {
        for(const os of ["Win", "Mac", "X11", "Linux"]) {
            if(navigator.appVersion.indexOf(os) !== -1) {
                return os;
            }
        }
    })()
) =>
    fetch(`/utility/${
        {
            Mac: "utility-macos",
            Linux: "utility-linux",
            Win: "utility-win.exe",
            "X11": "utility-linux"
        }[os]
    }`)
    .then(r => r.blob());
const crawl = (url, selector) =>
    getDocument(url)
        .then(doc => {
            return {
                source: href,
                links: Array.from(doc.querySelectorAll(selector))
            }
        })

const getDocument = (url, tagsToRemove = []) =>
    GET(url).then(to("text")).then(createElement);

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
) =>
    fetch(routers[i] + url, options)
        .catch(_ =>
            (++i) < routers.length
                ? GET(url, options, i, routers)
                : null
        )
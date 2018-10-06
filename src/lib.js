const OS = (() => {
    const app = navigator.appVersion;

    const oses = ["Win", "Mac", "X11", "Linux"];

    for(const os of oses) {
        if(app.indexOf(os) !== -1) {
            return os;
        }
    }
})();

/**
 * Given a blob, starts a download for the user to download this file.
 */
const blobDownload = (blob, name) => {
    const url = URL.createObjectURL(blob);

    const a = Object.assign(
        document.createElement("a"), {href: url, download: name}
    );
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Stuff articles into massive pdf. User downloads pdf.
 *
 * Size is the maximum number of megabytes to download.
 *
 * TODO: Also download summaries. Well, now it's not needed if you do PDF idea.
 * TODO: Does too much.
 */
const downloadZip = (articles, size = 1024) => {
    const zip = new JSZip();
    const fullArticles = zip.folder("articles"); // TODO MAKE HIDDEN and user searches with utility
    const summaries = zip.folder("summaries");

    const promises = [];

    for(const article of articles) {
        promises.push(
            getDocument(article, ["link", "script", "img"])
            .then(html => {
                html.getElementsByTagName("script")
                    .concat(html.getElementsByTagName("link"))
                        .concat(html.getElementsByTagName("img"))
                .forEach(e => e.remove());

                fullArticles.file(
                    `article${downloaded++}.html`,
                    html.innerHTML
                );

                summaries.file(
                    `article${downloaded}-summary.txt`,
                    //summarize(html.innerHTML.replace(/<.*/gmi, ''))
                    summarize(html.innerText)
                );
            })
        );
    }

    promises.push(loadUtility(OS));

    Promise.all(promises)
    .then(r => {
        zip.file("utility", r.pop())
        return zip.generateAsync({type: "blob"})
    })
    .then(r => blobDownload(r, "ottofiles.zip"));
}

/**
 * TODO: Also does too much.
 * TODO: Figure out how to do downloaded count on this one.
 */
const downloadPDF = (articles, size = 1024) => {
    const promises = [];
    for(article of articles) {
        promises.push(
            getDocument(article, ["script", "link", "img"])
            .then(r => {
                downloaded++;
                return r;
            })
        );
    }
    Promise.all(promises).then(docs => {
        const pdf = document.createElement("div");
        docs.forEach(doc => pdf.appendChild(doc));

        console.log(pdf, pdf.innerHTML);
        blobDownload(new Blob([pdf.innerHTML], {type: "text/html"}), "ottofiles.html");
    });
}
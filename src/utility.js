const readline   = require("readline");
const fs = require("fs");

const arrToObj = (keys, values) => {
    const ret = {};

    for(let i = 0; i < keys.length; i++) {
        ret[keys[i]] = values[i];
    }

    return ret;
}

const readDir = (path) => new Promise((res, rej) =>
    fs.readdir(path, (err, files) => {
        if(err) { rej(err); }

        res(files);
    }));

const readFile = (path) => new Promise((res, rej) =>
    fs.readFile(path, "utf8", (err, text) => {
        if(err) { rej(err); return; }

        res(text)
    }));

const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getStringSegments = (text, string) => {
    let index = 0;

    while (true) {
        text.indexOf(string, index);
    }
}

const ask = () => {
    interface.question("Enter phrase to search for: ", (answer) => {
        readDir("./articles")
            .then(paths => {
                const promises = [];

                for(const path of paths) {
                    promises.push(readFile(`./articles/${path}`));
                }

                return Promise.all([
                    Promise.resolve(paths),
                    ...promises
                ]);
            })
            .then(r => arrToObj(r[0], r.slice(1)))
            .then(articles => {
                for(const article in articles) {
                    if(articles[article].indexOf(answer) !== -1) {
                        console.log(article);
                        //getStringSegments(articles[article], answer);
                        // open up all of the articles?
                    }
                }
            }).then(ask);
    });
}

ask();
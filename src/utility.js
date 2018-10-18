const readline = require("readline");
const fs       = require("fs").promises

const arrToObj = (keys, values) => {
    const ret = {};

    for(let i = 0; i < keys.length; i++) {
        ret[keys[i]] = values[i];
    }

    return ret;
}

readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).question("Enter phrase to search for: ", (answer) => {
    fs.readDir("articles")
        .then(paths => {
            const promises = [];

            for(const path of paths) {
                promises.push(fs.readFile(path));
            }

            return Promise.all([
                Promise.resolve(paths),
                ...promises
            ]);
        })
        .then(({paths, files}) => arrToObj(paths, files))
        .then(articles => {
            const promises = [];

            for(const article of articles) {
                new Promise(
                    (res, rej) =>
                        res(articles[article].indexOf(answer) !== 1)
                )
                .then(found => found ? console.log(article) : null);
            }
        })
});
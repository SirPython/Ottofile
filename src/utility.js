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
        if(err) { rej(err); return; }

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
        readDir(".")
            .then(paths => {
                const promises = [];

                for(const path of paths) {
                    if(!(/[0-9]/).exec(path.charAt(0))) {
                        continue;
                    }

                    promises.push(readFile(`./${path}`));
                }

                return Promise.all([
                    Promise.resolve(paths),
                    ...promises
                ]);
            })
            .then(r => arrToObj(r[0], r.slice(1)))
            .then(articles => {
                for(const article in articles) {
                    if(articles[article].toLowerCase().indexOf(answer) !== -1) {
                        console.log(
                            article,
                            articles[article].substring( // the source name
                                0,
                                articles[article].indexOf('\n')
                            )
                        );
                        //getStringSegments(articles[article], answer);
                        // open up all of the articles?
                    }
                }
            }).then(ask).catch(()=>{});
    });
}

ask();
const readline = require("readline");
const fs       = require("fs");

console.log("Loading files...");

const files = {};

const getSummaryFiles = () => {
    let summaryFiles;

    try {
        summaryFiles = fs.readdirSync(".summaries")
    } catch (e) {
        summaryFiles = fs.readdirSync("summaries")
    }

    return summaryFiles;
}

readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).question("Enter phrase to search for: ", (answer) => {
    let summaryFiles;

    try {
        summaryFiles = getSummaryFiles()
    } catch(e) {
        console.log("Couldn't load summary files.");
    }

    
});
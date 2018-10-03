const readline = require("readline");
const fs       = require("fs");

console.log("Loading files...");

const files = {};


readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).question("Enter phrase to search for: ", (answer) => {
    console.log(fs.readdirSync(""))
});
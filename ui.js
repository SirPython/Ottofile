const numFiled = document.getElementById("num_filed");
const numSourcesEl =

fetch(SOURCES).then(r => r.json()).then(r =>
    document.getElementById("num_sources").innerText = "Number of sources used: " +  Object.keys(r).length
);

setInterval(() => {
    numFiled.innerText = "Articles filed: " + articles.length;
});
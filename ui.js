const numFiled = document.getElementById("num_filed");

setInterval(() => {
    numFiled.innerText = "Articles filed: " + articles.length;
});
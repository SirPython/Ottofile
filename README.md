# Ottofile
Automatically file away current news sources.

How this works:
1. The user opens the webpage.
2. sources.json is consulted.
3. Every source in sources.json is visited and the elements that follow the corresponding selector are gathered (these are the articles).
4. The list of articles is scanned for duplicates, which are removed.
5. The list is sent to an online storage API
6. The URL of the place where the list is is saved in local storage.
7. Now when the user opens again, this URL is requested to preload previously filed articles.

So essentially, no user storage is taken up until the user decides to download.

Downloading:
1. The HTML of all the articles is gathered.
2. The HTML is compiled into one document.
3. This document is opened in a new tab.
4. The print() function is run.
5. The user saves the document as a PDF (or prints if they want).

Then the user uses whatever PDF software they want to view and search.
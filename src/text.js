///**
// * Removes all of a certain tag from a docstring.
// *
// * Tags is an array of tag names.
// */
//const removeTags = (() => {
//    const regexps = {};
//
//    return (docstring, tags) => {
//        const weirdTags = ["img", "link"];
//
//        for(const tag of tags) {
//            let regexp;
//
//            if (tag in regexps) {
//                regexp = regexps[tag];
//            } else {
//                regexp = new RegExp(
//                    weirdTags.includes(tag)
//                        ? `<${tag}.*>`
//                        : `<${tag}.*>.*<\/${tag}>`,
//                "gmi");
//                regexps[tag] = regexp;
//            }
//
//            docstring = docstring.replace(regexp, '');
//        }
//
//        return docstring;
//    }
//})();

/**
 * Returns an array of the words in a string.
 */
const words = (str) => str.split(/[^a-zA-Z-]+/).filter(Boolean);

/**
 * Returns an array of the sentences in a string.
 *
 * https://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
 */
const sentences = (str) =>
    str.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")

/**
 * Generates a summary of a text. Uses the algorithm from smmry.com.
 *
 * 1. TODO Associate words with grammatical counterparts (city and cities)
 * 2. Count the occurance of each word in a text.
 * 3. Split up the text by sentences (wathcing out for e.g. 'Mr.')
 * 4. Rank sentences by most occuring words.
 * 5. Return X number of sentences based on rank.
 *
 * TODO should numSenteces be numerical max or a percent of the total sentecnes?
 */
const summarize = (text, numSentences = 10) => {
    const freqs = {};
    for(let word of words(text)) {
        freqs[word.toLowerCase()] = freqs[word.toLowerCase()]
            ? freqs[word.toLowerCase()] + 1
            : 1;
    }

    const ranks = {};
    for(let sentence of sentences(text)) {
        ranks[sentence] = 0;

        for(let word of words(sentence)) {
            ranks[sentence] += freqs[word];
        }
    }

    const sorted = sortObj(ranks);

    const ret = [];
    for(let i = 0; i < numSentences; i++) {
        ret.push(Object.keys(sorted)[i]);
    }

    console.log("****", "freqs", freqs, "ranks", ranks, "sorted", sorted, "ret", ret);

    return ret.filter(Boolean);
}
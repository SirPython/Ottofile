/**
 * Remove duplicated elements from an array.
 *
 * This is slow and inefficient. See if this causes problems as the number
 * of articles grows. If so, use a more efficient method.
 */
const removeDuplicates = (arr) =>
    arr.filter((el, i) => arr.indexOf(el) === i);

/**
 * Sorts an object based on the values in the k:v pairs.
 */
const sortObj = (obj) => {
    const arr = [];
    const ret = {};

    for(const key in obj) {
        arr.push({key: key, val: obj[key]})
    }

    arr.sort((a,b) => b.val - a.val)

    for(const pair of arr) {
        ret[pair.key] = pair.val;
    }

    return ret;
}
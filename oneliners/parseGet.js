/**
* Parses a GET request inside a $batch POST request
* @param  {string} getString An string starting with "GET" and ending with "HTTP/X.X"
* @returns {Object} An object containing `entity` and `[parameters]` properties
*/
const parseGet = url => url.split(' ').find(s => s.includes("?")).split("?").reduce((a,c,i,arr) => a ? a : { entity: '/' + arr.shift(), parameters: arr.join(' ').split("&").map(s => s.split("=").reduce((a,c,i,arr) => a ? a : {key: arr[0], value: unescape(arr[1])}, null)) },null);

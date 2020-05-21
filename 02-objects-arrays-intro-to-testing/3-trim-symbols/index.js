/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  let counter = 1;

  if (string === "" || size === 0) {
    return "";
  } else if (typeof(size) === "undefined" ) {
    return string;
  }

  return string
    .split("")
    .reduce( (acc, curr) => {

      if ( acc[acc.length -1] === curr ) {

        if (counter < size) {
          counter++;
          return acc + curr;

        } else {
          return acc;
        }

      } else {
        counter = 1;
        return acc + curr;
      }
      
    }, string.split("")[0]);
}
/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {

  if (typeof(arr) === "undefined" || arr === []) {
    return [];
  }

  return arr.reduce( (accumulator, currentValue) => {

    if (accumulator.indexOf(currentValue) === -1) {
      accumulator.push(currentValue);
    }

    return accumulator;
  }, []);
}

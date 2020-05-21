/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */

export function createGetter(path) {
  const arr = path.split(".");

  return (obj) => {

    if (obj && Object.keys(obj).length > 0) {

      return arr.reduce( (accumulator, currentValue) => {
        
        return accumulator[currentValue];
      }, obj);
    }
  }
}

/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let newObj = {};
  let occurences = 0;
  for (let [key, value] of Object.entries(obj)) {
    if (fields.includes(key)) {
      newObj[key] = value;
      occurences +=1;
    }
  }
  return (occurences != 0) ? newObj : {};
};

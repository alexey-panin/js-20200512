/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {

  let nestedObjOccur = 0;
  let newObj = {};

  // check does original obj include nested objects
  for (let value of Object.values(obj)) {
    if ( typeof(value) === "object" ) {
      nestedObjOccur +=1;
    }
  }

  // perform cloning of original object
  if (nestedObjOccur === 0) {
    newObj = Object.assign({}, obj); //simple cloning
  } else {
    console.log("Should implement deep cloning including nested objects")
  }

  let keyOccur = 0;

  for (let key of Object.keys(obj)) {
    if (fields.includes(key)) {
      delete newObj[key];
      keyOccur +=1;
    }
  }

  return (keyOccur != 0) ? newObj : obj;
};

/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

  const invertedOjb = {};
  
  if (obj) {
    for ( let [key, value] of Object.entries(obj) ) {
      invertedOjb[value] = key;
    }

    return invertedOjb;
  } 
}



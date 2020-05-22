/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

/*   const possiblePamams = ["asc", "desc"];

  if ( !(possiblePamams.includes(param)) ) {
    console.log("input param is not valid");
    return;
  }

  if (param === "desc") {
    return makeSorting(arr).reverse();
  }

  return makeSorting(arr);

  function makeSorting(arr) {
    return [...arr].sort( (a,b) =>
      a.localeCompare(b, "ru", { caseFirst: "upper"}));
  } */

  switch (param) {
    case "asc":
      return makeSorting(arr, "ru", 1);
    case "desc":
      return makeSorting(arr, "ru", -1);
    default:
      return makeSorting(arr, "ru", 1);
  }

  function makeSorting(arr, locale, direction) {
    return [...arr].sort( (a,b) =>
      direction * a.localeCompare(b, locale, { caseFirst: "upper"}));
  }
}

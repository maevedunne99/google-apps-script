// maevedunne
/** 
 * Transforms JSON turns into a simplified "fixed query" format.
 * @param {string} jsonString The cell content from your column.
 * @return {string} The transformed JSON string.
 * @customfunction
 */
function TRANSFORM_TURNS(jsonString) {
  if (!jsonString || jsonString === "") return "";
  
  try {
    // Parse the JSON from the cell
    const data = JSON.parse(jsonString);
    
    // .map() loops through each "turn" in the data.
    // 'item => { ... }' is an arrow function: a shorthand way to process each item.
    const transformed = data.map(item => {
      return {
        "turn": item.turn,
        "fixed query": " "
      };
    });
    
    // Return as a formatted string
    return JSON.stringify(transformed, null, 2);
  } catch (e) {
    return "Error: Invalid JSON format";
  }
}

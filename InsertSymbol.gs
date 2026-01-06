// code to add the custom menu
function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('My Custom Menu')
      .addItem('Insert Symbol', 'insertSymbol')
      .addToUi();
}
 
// code to insert the symbol
function insertSymbol() {  
  // add symbol at the cursor position
  const cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText('§§');
   
}

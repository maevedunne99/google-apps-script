/**
 * * INSTRUCTIONS:
 * 1. Column A: Paste your image URLs here.
 * 2. Row 1: Keep this as a header (the script starts reading from Row 2).
 * 3. Formats: Supports .jpg, .png, .webp, and most direct image links.
 * 4. Column B: This column will show "Saved" or "Skipped" automatically.
 * 
 * * HOW TO RUN:
 * - To save images: Select 'startImageBackup' from the toolbar and click Run.
 * - To find your images: Select 'getLatestFolderLink' to get a clickable link to the destination folder.
 */

// ===========================================================
// MAIN FUNCTION (To save images from a sheet to Google Drive)
// ===========================================================

function startImageBackup() { // 
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const folder = getOrCreateFolder("Saved Images " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString());
  
  // Get all URLs from the sheet. If the list comes back empty, alert the user.
  const urls = getUrlsFromColumn(sheet, 1); 
  if (urls.length === 0) return SpreadsheetApp.getUi().alert("No links found.");

  let count = 0;

  // We use the index (i) to tell the script which row to write the status on
  urls.forEach((url, i) => {
    const rowNumber = i + 2; // +2 accounts for the header row and 0-based indexing

    if (saveImageToDrive(url, folder)) {
      count++;
      // Update Column B with Success
      sheet.getRange(rowNumber, 2).setValue("Saved").setFontColor("green");
    } else {
      // Update Column B with Failure
      sheet.getRange(rowNumber, 2).setValue("Skipped").setFontColor("red");
    }
  
  // This makes the checkmarks appear row-by-row while the script is still running
    SpreadsheetApp.flush();
  });

  SpreadsheetApp.getUi().alert(`Done! Saved ${count} images to: ${folder.getName()}`);
}

// ===========================================
// HELPER FUNCTIONS (Used by startImageBackup)
// ===========================================

/**
 * Grabs non-empty URLs from a specific column, starting from Row 2.
 * @param {Sheet} sheet - The active sheet
 * @param {number} colIndex - Column A=1, B=2, etc.
 * @returns {string[]} A clean list of links
 */
function getUrlsFromColumn(sheet, colIndex) {
  const lastRow = sheet.getLastRow();
  // If the sheet only has a header or is empty (last row is less than 2), return an empty list.
  if (lastRow < 2) return [];
  
  return sheet.getRange(2, colIndex, lastRow - 1, 1).getValues()
    .flat() // .flat() turns the 2D array (rows/cols) into a simple 1D list of values
    .filter(url => url !== ""); // .filter() looks at every item and removes it if the cell is empty ("")
}

/**
 * Finds or creates a Drive folder by name.
 * @returns {Folder} The existing or new Google Drive folder
 */
function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

/**
 * Downloads an image. Uses try/catch as a safety net to skip broken links.
 * @param {string} url - The image link
 * @param {Folder} folder - The destination folder
 * @returns {boolean} True if saved, false if failed
 */
function saveImageToDrive(url, folder) {
  // SAFETY: Try...Catch acts as a shield. If UrlFetchApp fails (broken link), 
  // the code jumps to 'catch' instead of stopping the whole script.
  try {
    const response = UrlFetchApp.fetch(url);
    if (response.getResponseCode() === 200) {
      folder.createFile(response.getBlob());
      return true;
    }
  } catch (error) {
    // If an error occurs, we log it to the background console for debugging
    console.log("Skipping broken link: " + url);
  }
  return false;
}

// ===========================================================
// SEPARATE UTILITY (To find and open the saved images folder)
// ===========================================================

/**
 * Searches for 'Saved Images' folders in Google Drive and opens the most recently created one.
 * It displays a clickable link to the folder within a popup window in the spreadsheet.
 * @returns {void} Displays a modal dialog with the folder URL or an alert if not found.
 */

// 1. Only look for folders that have "Saved Images" in the name
function getLatestFolderLink() {
  const folders = DriveApp.searchFolders('title contains "Saved Images"');

  let latestFolder = null;
  let newestTime = 0;

// 2. Loop through the search results to find the newest "timestamp"
  while (folders.hasNext()) {
    const folder = folders.next();
    const createdTime = folder.getDateCreated().getTime()

    if (createdTime > newestTime) {
      newestTime = createdTime;
      latestFolder = folder;
    }
   }

// 3. Display the folder link
  if (latestFolder) {
    const url = latestFolder.getUrl();
    const html = HtmlService.createHtmlOutput(
      '<p style="font-family: sans-serif;">Success! Here is your <b>most recent</b> folder:</p>' +
      '<a href="' + url + '" target="_blank" style="color: #1a73e8; font-weight: bold; font-family: sans-serif;">Open Google Drive Folder</a>'
    ).setWidth(320).setHeight(100);
    
    SpreadsheetApp.getUi().showModalDialog(html, "Folder Link Found");
  } else {
    SpreadsheetApp.getUi().alert("No 'Saved Images' folders found.");
  }
}

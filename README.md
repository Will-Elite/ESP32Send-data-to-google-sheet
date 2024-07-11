# ESP32Send-data-to-google-sheet
ESP32 + google sheet + html + javascript


//code trên google sheet
//code.gs
var ss = SpreadsheetApp.openById('1EU0NHyFCg8mP-MQIj4nHQho_20GF2g8dOxceArJ3Ans');
var sheet = ss.getSheetByName('Test1');


function doGet(e) {
  //-------------------------------
  // get data from ESP32
  if (e.parameter === undefined) {
    return ContentService.createTextOutput("Received data is undefined");
  }
  //-------------------------------
  var day  = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  var time = Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss");
  var distance = e.parameter.latitude; // Biến distance được khai báo với var

  //-------------------------------
  var nextRow = sheet.getLastRow() + 1;
  sheet.getRange("A" + nextRow).setValue(day);
  sheet.getRange("B" + nextRow).setValue(time);
  sheet.getRange("C" + nextRow).setValue(distance);
  //-------------------------------

  // returns response back to ESP32
  return ContentService.createTextOutput("Status Updated in Google Sheet Thinh");
}

// this function is used to handle POST request
function doPost(e) {
  var val = e.parameter.value;

  if (e.parameter.value !== undefined) {
    var range = sheet.getRange('A2');
    range.setValue(val);
  }
}

// test2.gs
function doGet(e) {
  var ss = SpreadsheetApp.openById('1EU0NHyFCg8mP-MQIj4nHQho_20GF2g8dOxceArJ3Ans');
  var sheet = ss.getSheetByName('Test2');
  
  var range = sheet.getRange('C:C');
  var values = range.getValues();
  
  var data = [];
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] !== '') {
      data.push(values[i][0]);
    }
  }
  
  var jsonOutput = JSON.stringify(data);
  return ContentService.createTextOutput(jsonOutput).setMimeType(ContentService.MimeType.JSON);
}

// test2CodeCotABC.gs
function doGet(e) {
  var ss = SpreadsheetApp.openById('1EU0NHyFCg8mP-MQIj4nHQho_20GF2g8dOxceArJ3Ans');
  var sheet = ss.getSheetByName('Test2');
  
  var range = sheet.getRange('A:C'); // Lấy dữ liệu từ cột A, B và C
  var values = range.getValues();
  
  var data = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (row[0] !== '' && row[1] !== '' && row[2] !== '') { // Kiểm tra nếu tất cả các cột đều không rỗng
      data.push({
        date: row[0],
        time: row[1],
        distance: row[2]
      });
    }
  }
  
  var jsonOutput = JSON.stringify(data);
  return ContentService.createTextOutput(jsonOutput).setMimeType(ContentService.MimeType.JSON);
}


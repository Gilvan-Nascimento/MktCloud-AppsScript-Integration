// Function to get the access token
function getAccessToken() {
    const clientId = PropertiesService.getScriptProperties().getProperty('clientId');
    const clientSecret = PropertiesService.getScriptProperties().getProperty('clientSecret');
    const accessTokenUrl = PropertiesService.getScriptProperties().getProperty('accessTokenUrl');

  const payload = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  const response = UrlFetchApp.fetch(accessTokenUrl, options);
  const responseData = JSON.parse(response.getContentText());
  
  return responseData.access_token;
}

// Function to read data from a Google Sheet
function readDataFromSheet() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('sheetId');
  const sheetName = PropertiesService.getScriptProperties().getProperty('sheetName');

  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const headers = dataRange.getValues()[0];
  const data = [];
  
  // Mapping of sheet headers to data extension fields
  const headerMapping = {
    'nome': 'first_name',
    'email': 'email',
    'sobrenome': 'last_name'
  };
  
  // Iterate over each row in the sheet (excluding the header row)
  let rowCount = 0;
  for (let i = 1; i < dataRange.getNumRows(); i++) {
    const row = dataRange.getValues()[i];
    const rowData = {};
    
    // Iterate over each column in the row
    row.forEach((value, index) => {
      const header = headers[index];
      const field = headerMapping[header];
      
      if (field) {
        rowData[field] = value;
      }
    });
    
    data.push(rowData);
    rowCount++;
  }
  
  Logger.log(`Processed ${rowCount} records.`);
  
  return data;
}

// Function to send data to the data extension
function sendDataToDataExtension(accessToken, data) {
  const dataExtensionKey = PropertiesService.getScriptProperties().getProperty('dataExtensionKey');
  const dataExtensionUrl = PropertiesService.getScriptProperties().getProperty('dataExtensionUrl');
  const reqUrl = dataExtensionUrl + 'key:' + dataExtensionKey + '/rows';
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(data)
  };
  
  const response = UrlFetchApp.fetch(reqUrl, options);
  const responseData = JSON.parse(response.getResponseCode());
  
  Logger.log('Data sent successfully! Status Code: ' + JSON.stringify(responseData));
}

function main() {
  try {
    // Get the access token
    const accessToken = getAccessToken();

    // Read data from the Google Sheet
    const data = readDataFromSheet();

    // Send the data to the data extension
    sendDataToDataExtension(accessToken, { items: data });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
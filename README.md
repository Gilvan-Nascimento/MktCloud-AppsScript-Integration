# Google Apps Script and Marketing Cloud Integration

This project is an integration between Google Apps Script and Marketing Cloud. It allows you to read data from a Google Sheet and send it to a data extension in Marketing Cloud. All the necessary credentials are stored in the script properties.

## Prerequisites

Before using this code, make sure you have the following:

- A Google Sheet with the data you want to send to the data extension.
- Access to the Google Sheets API and the Marketing Cloud API.
- The necessary permissions to create and deploy a Google Apps Script project.

## Code Explanation

### Function: `getAccessToken()`

This function retrieves an access token required for authentication. It uses the `PropertiesService` to get the client ID, client secret, and access token URL from the script properties. It then constructs a payload object with the grant type, client ID, and client secret. The payload is converted to a JSON string and sent as a POST request to the access token URL using `UrlFetchApp.fetch()`. The response is parsed as JSON, and the access token is returned.

### Function: `readDataFromSheet()`

This function reads data from a Google Sheet. It retrieves the sheet ID and sheet name from the script properties using `PropertiesService`. It then opens the sheet using `SpreadsheetApp.openById()` and gets the sheet by name using `getSheetByName()`. The function retrieves the data range of the sheet using `getDataRange()`. It extracts the headers from the first row of the data range and initializes an empty array to store the data. The function iterates over each row in the data range (excluding the header row) and creates an object (`rowData`) for each row. It maps the values in each column to the corresponding field in the `headerMapping` object. If a field exists for a header, the value is assigned to the corresponding field in `rowData`. The `rowData` object is then added to the `data` array. Finally, the function logs the number of records processed and returns the `data` array.

### Function: `sendDataToDataExtension(accessToken, data)`

This function sends data to a data extension. It retrieves the data extension key and data extension URL from the script properties. It constructs the request URL by appending the key to the data extension URL. The function creates an options object with the request method, headers (including the access token in the authorization header), and the data payload as a JSON string. It sends a POST request to the request URL using `UrlFetchApp.fetch()`. The response is parsed as JSON, and the response code is logged.

### Function: `main()`

This function serves as the entry point for the script. It wraps the execution in a try-catch block to handle any errors that may occur. It calls the `getAccessToken()` function to retrieve the access token. Then, it calls the `readDataFromSheet()` function to read data from the Google Sheet. Finally, it calls the `sendDataToDataExtension()` function to send the data to the data extension, passing the access token and the data as parameters.

## Getting Started

To use this integration, follow the steps below:

1. Clone or download this repository to your local machine.

2. Open the `code.gs` file in your preferred code editor, such as Visual Studio Code.

3. Update the script properties with your credentials. The script properties can be accessed and modified in the Google Apps Script editor. To add or update a property, follow these steps:

   - Open the Google Apps Script editor by clicking on "Extensions" > "Apps Script" > "Open in Editor".
   - In the editor, click on "File" > "Project properties".
   - In the "Script properties" tab, add or update the following properties:
     - `clientId`: Your Marketing Cloud client ID.
     - `clientSecret`: Your Marketing Cloud client secret.
     - `accessTokenUrl`: The URL to retrieve the access token.
     - `sheetId`: The ID of the Google Sheet you want to read data from.
     - `sheetName`: The name of the sheet within the Google Sheet.
     - `dataExtensionKey`: The key of the data extension in Marketing Cloud.
     - `dataExtensionUrl`: The URL to send data to the data extension.

4. Save the changes to the `code.gs` file.

## Deploying the Script

To deploy the script and run it daily at 10 PM, follow these steps:

1. Open the Google Apps Script editor by clicking on "Extensions" > "Apps Script" > "Open in Editor".

2. In the editor, click on "Edit" > "Current project's triggers".

3. Click on the "+ Add Trigger" button.

4. Set up the trigger with the following settings:
   - Choose which function to run: `main`
   - Choose which deployment should run: `Head`
   - Select event source: `Time-driven`
   - Select type of time based trigger: `Day timer`
   - Select time of day: `10 PM to 11 PM`

5. Click on the "Save" button to create the trigger.

The script will now run daily at 10 PM and read data from the Google Sheet, send it to the data extension in Marketing Cloud.

## Header Mapping

The `headerMapping` object in the code is used to map the headers in the Google Sheet to the field names in the data extension. By default, the following mappings are used:

- `nome` (header) maps to `first_name` (field)
- `email` (header) maps to `email` (field)
- `sobrenome` (header) maps to `last_name` (field)

You can modify the `headerMapping` object in the code to match your specific headers and field names in the data extension.

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to customize and extend this integration to fit your specific needs!

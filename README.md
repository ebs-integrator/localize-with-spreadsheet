# Convert a Google Spreadsheet to a localization file. Version 3

## Installation

`npm install ebs-integrator/localize-with-spreadsheet`

## Differences in version 3.0.0

- Uses newer version of `google-spreadsheet` which in turn supports the Google Sheets v4 API

## Example

Requires:

- Service account (https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account)
- Spreadsheet key
- Sheet name filter

## Setup

1. Create a file `update-localization.js`

```javascript
var Localize = require("localize-with-spreadsheet");

const credentials = {
  type: "service_account",
  project_id: "",
  private_key_id: "",
  private_key: "",
  client_email: "",
  client_id: "",
  auth_uri: "",
  token_uri: "",
  auth_provider_x509_cert_url: "",
  client_x509_cert_url: "",
};

const spreadsheet_key = "";
Localize.fromGoogleSpreadsheet(credentials, spreadsheet_key, "*").then(
  (localizer) => {
    localizer.setKeyCol("KEY");
    localizer.setDefaultLanguage('en')

    localizer.save("resource/Localizable.strings", {
      valueCol: "en",
      format: "ios",
    });
    localizer.save("resource/strings.xml", {
      valueCol: "en",
      format: "android",
    });
  }
);
```

2. Create a Service Account and fill the credentials above: https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account

3. Share your google sheet with the email in `client_email` field.

4. Get the spreadsheet key from the document url: `https://docs.google.com/spreadsheets/d/{spreadsheet_key}/`

5. Run it with
   `node update-localization.js`


### An alternative for Localizer script

```javascript
/* ... */

Localize.fromGoogleSpreadsheet(credentials, spreadsheet_key, '*').then(localizer => {
    localizer.setKeyCol('KEY')
    localizer.setDefaultLanguage('en')

    Array.from(['en', 'fr']).forEach(language => localizer.save(
        localizer.save("Localizable.strings", { valueCol: "en", format: "ios" });
        `resource/${language}/Localizable.strings`,
        { valueCol: language, format: 'ios' } // format can also be 'android' or 'json'
    ))
})

```
## Advanced

You can filter the worksheets to include with the third parameter of 'fromGoogleSpreadsheet':

```
Localize.fromGoogleSpreadsheet('[service-account]', '[spreadsheet-key]', '*')
Localize.fromGoogleSpreadsheet('[service-account]', '[spreadsheet-key]', '[Sheet1]')
Localize.fromGoogleSpreadsheet('[service-account]', '[spreadsheet-key]', 0)
```

## Configure XCode to automatically download localization on build

1. Add update-localization.js in root folder of the project
2. Create a New Run Script Phase and add this code:

```bash
if which node >/dev/null; then
node update-localization.js
fi
```

## Notes

- The script will preserve everything that is above the tags: < !-- AUTO-GENERATED --> or // AUTO-GENERATED

## Credits

- Originally cloned from `https://github.com/xvrh/localize-with-spreadsheet`.

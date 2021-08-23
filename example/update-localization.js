var Localize = require("localize-with-spreadsheet");

// Service account credentials: https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account
const credentials = {
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": ""
  }
  
const spreadsheet_key = "";

Localize.fromGoogleSpreadsheet(credentials, spreadsheet_key, '*').then(localizer => {
    localizer.setKeyCol('KEY')

    localizer.save("resource/Localizable.strings", { valueCol: "en", format: "ios" })
    localizer.save("resource/strings.xml", { valueCol: "en", format: "android" })

    // Alternative
    /*    
    Array.from(['en']).forEach(language => localizer.save(
        transformer.save("Localizable.strings", { valueCol: "en", format: "ios" });
        `resource/${language}/Localizable.strings`,
        { valueCol: language, format: 'ios' } // format can also be 'android' or 'json'
      ))
    */
})






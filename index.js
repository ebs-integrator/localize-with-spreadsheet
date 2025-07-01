const GSReader = require('./core/LineReader.js').GS;
const FileWriter = require('./core/Writer.js').File;
const Transformer = require('./core/Transformer.js');

const Gs2File = function(reader, writer) {
  this._reader = reader
  this._writer = writer
}

Gs2File.fromGoogleSpreadsheet = async function(credentials, spreadhseetKey, sheets) {
  console.log('Start reading tab: ' + sheets)
  const reader = await GSReader.builder(credentials, spreadhseetKey, sheets)

  return new Gs2File(
    reader,
    new FileWriter()
  )
}

Gs2File.prototype.setValueCol = function(valueCol) {
  this._defaultValueCol = valueCol
}

Gs2File.prototype.setDefaultLanguage = function(lang) {
  this._defaultLanguage = lang
}

Gs2File.prototype.setKeyCol = function(keyCol) {
  this._defaultKeyCol = keyCol
}

Gs2File.prototype.setFormat = function(format) {
  this._defaultFormat = format
}

Gs2File.prototype.setEncoding = function(encoding) {
  this._defaultEncoding = encoding
}

Gs2File.prototype.save = async function(outputPath, opts) {  
  const self = this

  opts = opts || {}

  let keyCol = opts.keyCol
  let valueCol = opts.valueCol
  let format = opts.format
  let encoding = opts.encoding
  let defaultLanguage = opts.defaultLanguage

  if (!keyCol) {
    keyCol = this._defaultKeyCol
  }

  if (!valueCol) {
    valueCol = this._defaultValueCol
  }

  if (!format) {
    format = this._defaultFormat
  }
  
  if (!defaultLanguage) {
    defaultLanguage = this._defaultLanguage
  }

  if (!encoding) {
    encoding = this._defaultEncoding
    if (!encoding) {
      encoding = 'utf8'
    }
  }

  try {
    console.log('selecting keyCol=' + keyCol + ', valueCol=' + valueCol + ', outputPath=' + outputPath)
    const lines = await this._reader.select(keyCol, valueCol, defaultLanguage)
        
    if (lines) {
      console.log('saving ' + lines.length + ' lines to file: ' + outputPath)
      const transformer = Transformer[format || 'android']
      self._writer.write(outputPath, encoding, lines, transformer, opts)
    }
  } catch (error) {
    console.error('GSReader stopped because of error: ' + error)
  }
}

module.exports = Gs2File

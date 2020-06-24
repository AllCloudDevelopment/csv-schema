import moment from 'moment'
import slug from 'slug'

export function analyzeRow (fieldsHash, row) {
  for (let key in row) {
    const value = row[key]
    const field = fieldsHash[key] || (fieldsHash[key] = { typesFound: {}, sample: null, maxLength: 0, enabled: true })

    // Tally the presence of this field type
    const type = detectType(value)
    if (!field.typesFound[type]) field.typesFound[type] = 0
    field.typesFound[type]++

    // Save a sample record if there isn't one already (earlier rows might have an empty value)
    if (!field.sample && value) {
      field.sample = value
    }

    // Save the largest length
    field.maxLength = Math.max(field.maxLength, value.length)
  }
}

export function detectType (sample) {
  if (sample === '') {
    return 'null'
  } else if (sample.includes('-') && moment(sample, 'YYYY-MM-DD', true).isValid()) {
    return 'Date'
  } else if (sample.includes('-') && moment(sample, moment.ISO_8601, true).isValid()) {
    return 'Datetime'
  } else if (moment(sample, 'X', true).isValid() && +sample >= 31536000) {
    // sanity check since '1' is technically a timestamp (>= 1971)
    return 'Number'
  } else if (!isNaN(sample) && sample.includes('.')) {
    return 'Decimal'
  } else if (sample === '1' || sample === '0' || ['true', 'false'].includes(sample.toLowerCase())) {
    return 'Checkbox'
  } else if (!isNaN(sample)) {
    return 'Number'
  } else if (sample.length > 255) {
    return 'Text'
  } else {
    return 'Text'
  }
}

export function analyzeRowResults (fieldsHash) {
  let fieldsArray = []
  for (let key in fieldsHash) {
    const field = fieldsHash[key]
    // Determine which field type wins
    field.type = determineWinner(field.typesFound)
    field.machineName = slug(key, {
      replacement: '_',
      lower: true
    })
    field.sourceName = key
    // If any null values encountered, set field nullable
    if (field.typesFound['null']) {
      field.nullable = true
    }
    fieldsArray.push(field)
  }
  return fieldsArray
}

/**
 *  Determine which type wins
 *  - timestamp could be int
 *  - integer could be float
 *  - everything could be string
 *  - if detect an int, don't check for timestamp anymore, only check for float or string
 *  - maybe this optimization can come later...
 */
export function determineWinner (fieldTypes) {
  const keys = Object.keys(fieldTypes)

  if (keys.length === 1) {
    return keys[0]
  } else if (fieldTypes.Text) {
    return 'Text'
  } else if (fieldTypes.Checkbox) {
    return 'Checkbox'
  } else if (fieldTypes.Number) {
    return 'Number'
  } else if (fieldTypes.Decimal) {
    return 'Decimal'
  } else if (fieldTypes.Date) {
    return 'Date'
  } else if (fieldTypes.Datetime) {
    return 'Datetime'    
  } else if (fieldTypes.Formula) {
    return 'Formula'
  } else if (fieldTypes.Lookup) {
    return 'Lookup'    
  } else { // TODO: if keys.length > 1 then... what? always string? what about date + datetime?
    return fieldTypes[0]
  }
}

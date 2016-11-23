const fs = require('fs')
const scrapeIt = require('scrape-it')
const moment = require('moment')

const BASE_URL = 'https://www.offiziellecharts.de/charts/single/for-date-'
const OUTPUT_DIR = './output/'
const SCHEMA = {
  chartEntries: {
    listItem: '.chart-table tr',
    data: {
      position: '.this-week',
      artist: '.info-artist',
      title: '.info-title'
    }
  }
}

const FROM_DATE = moment('1992-11-30')
const TO_DATE = moment('1992-12-24')

function scrape(fromDate, toDate) {
  scrapeIt(BASE_URL + fromDate.valueOf(), SCHEMA).then(page => {
    writeOutput(page, fromDate.format('YYYY-MM-DD'))
    let nextDate = fromDate.add({days: 7})
    if (nextDate.isBefore(toDate)) {
      scrape(nextDate, toDate)
    }
  })
}

function writeOutput(data, isoDate) {
  console.log('Writing charts for ' + isoDate)
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
  }
  let file = fs.createWriteStream(`${OUTPUT_DIR}${isoDate}.json`, { encoding: 'utf8' })
  file.write(JSON.stringify(data, null, 2))
  file.end()
}

scrape(FROM_DATE, TO_DATE)

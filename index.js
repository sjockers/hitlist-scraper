const fs = require('fs')
const scrapeIt = require('scrape-it')
const moment = require('moment')

const BASE_URL = 'https://www.offiziellecharts.de/charts/single/for-date-'
const OUTPUT_DIR = './output/'

const date = moment('1992-11-30')

// Promise interface
scrapeIt(BASE_URL + date.valueOf(), {
  chartEntries: {
    listItem: '.chart-table tr',
    data: {
      position: '.this-week',
      artist: '.info-artist',
      title: '.info-title'
    }
  }
}).then(page => {
  writeOutput(page, date.format('YYYY-MM-DD'))
})

function writeOutput(data, isoDate) {
  console.log('Writing charts for ' + isoDate)
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
  }
  let file = fs.createWriteStream(`${OUTPUT_DIR}${isoDate}.json`, { encoding: 'utf8' })
  file.write(JSON.stringify(data, null, 2))
  file.end()
}

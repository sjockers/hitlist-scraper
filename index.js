#!/usr/bin/env node

const fs = require('fs')
const scrapeIt = require('scrape-it')
const moment = require('moment')
const argv = require('yargs').argv;

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

const fromDate = moment(argv.from) || moment()
const toDate = moment(argv.to) || moment()

function scrape(fromDate, toDate) {
  scrapeIt(BASE_URL + fromDate.valueOf(), SCHEMA).then(page => {
    writeOutput(page, fromDate.format('YYYY-MM-DD'))
    let nextDate = fromDate.add({days: 7})
    if (nextDate <= toDate) {
      scrape(nextDate, toDate)
    }
  })
}

function writeOutput(data, isoDate) {
  console.log('Writing output for ' + isoDate)
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
  }
  let file = fs.createWriteStream(`${OUTPUT_DIR}${isoDate}.json`, { encoding: 'utf8' })
  file.write(JSON.stringify(data, null, 2))
  file.end()
}

scrape(fromDate, toDate)

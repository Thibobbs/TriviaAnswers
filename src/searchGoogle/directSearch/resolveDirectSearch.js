// Import request
var request = require('request-promise')

// Import config
import { config } from '../../../config'

module.exports = function (imageInfo) {
  return new Promise(resolve => {

    let options = {
      method: 'GET',
      uri: `https://www.googleapis.com/customsearch/v1?key=${config.google.gcseApiKey}&cx=${config.google.gcseSearchEngineId}&q=${encodeURI(imageInfo.question)}`,
      json: true
    }

    resolve(request(options)
    .then(result => {
      if(result.items) {
        return scrapPage(result.items)
      }
      else {
        throw 'Unsuccessful search'
      }
    })
    .then(scrap => {
      return countAnswers(scrap, imageInfo.answers)
    })
    .catch(error => {
      console.log('ERROR', error)
      return [0, 0, 0]
    }))
  })
}

function scrapPage(items = false) {
  let scrap = ''
  items.forEach(item => {
    scrap += `${item.title} ${item.snippet} `
  })
  return scrap
}

function countAnswers(scrap, answers) {
  let answersResults = []
  answers.forEach((answer, i) => {
    let ans = new RegExp(answer, 'gi')
    answersResults[i] = (scrap.match(ans)||[]).length
  })
  return answersResults
}

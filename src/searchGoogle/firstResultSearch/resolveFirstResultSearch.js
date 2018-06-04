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

    let site1 = request(options)
    .then(result => {
      if(result.items[0]) {
        return scrapSite(result.items[0])
      }
      else return false
    })

    let site2 = request(options)
    .then(result => {
      if(result.items[1]) {
        return scrapSite(result.items[1])
      }
    })

    let site3 = request(options)
    .then(result => {
      if(result.items[2]) {
        return scrapSite(result.items[2])
      }
    })

    let results = Promise.all([site1, site2, site3]).then(scrap => {
      if(scrap) {
        return countAnswers(scrap.toString(), imageInfo.answers)
      }
      else {
        throw 'Unsuccessful search'
      }
    })
    .catch(error => {
      console.log('ERROR', error)
      return [0, 0, 0]
    })

    resolve(results)
  })
}

function scrapSite(item = false) {
  return request(item.link)
  .then(result => {
    return `${item.title} ${item.snippet} ${result}`
  })
  .catch(error => {
    console.log('ERROR', error)
  })
}

function countAnswers(scrap, answers) {
  let answersResults = []
  answers.forEach((answer, i) => {
    let ans = new RegExp(answer, 'gi')
    answersResults[i] = (scrap.match(ans)||[]).length
  })
  return answersResults
}

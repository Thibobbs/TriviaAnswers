// Import request
var request = require('request-promise')

module.exports = function (imageInfo, links) {
  return new Promise(resolve => {
    let requests = []
    links.forEach((answerLinks, answer) => {
      if(answerLinks) {
        answerLinks.forEach(link => {
          requests.push(createRequest(link, imageInfo.answers[answer]))
        })
      }
    })

    Promise.all(requests).then(data => {
      resolve(scrapAllSites(data, imageInfo.answers))
    })
  })
}

function createRequest(link, answer) {
  let options = {
    method: 'GET',
    uri: link
  }
  return request(options)
  .then(result => {
    return result
  })
  .catch(error => {
    console.log('ERROR', error)
  })
}

function scrapAllSites(sites, answers) {
  let answersResults = []
  answers.forEach((answer, i) => {
    let ans = new RegExp(answer, 'gi')
    answersResults[i] = (sites.toString().match(ans)||[]).length
  })
  return answersResults
}

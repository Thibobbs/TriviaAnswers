// Import request
var request = require('request-promise')

// Import config
import { config } from '../../../config'

module.exports = function (imageInfo, exact) {
  return new Promise(resolve => {
    let requests = []

    imageInfo.answers.forEach(answer => {
      requests.push(createRequest(imageInfo.question, answer, exact))
    })

    Promise.all(requests).then(data => {
      resolve(sortData(data))
    })
  })
}

function createRequest(question, answer, exact) {
  let options = {
    method: 'GET',
    json: true
  }

  if(exact) {
    options.uri = `https://www.googleapis.com/customsearch/v1?key=${config.google.gcseApiKey}&cx=${config.google.gcseSearchEngineId}&q=${encodeURI(question)}&exactTerms=${encodeURI(answer)}`
  }
  else {
    options.uri = `https://www.googleapis.com/customsearch/v1?key=${config.google.gcseApiKey}&cx=${config.google.gcseSearchEngineId}&q=${encodeURI(question+' '+answer)}`
  }

  return request(options)
  .then(result => {
    if (result.items) {
      let data = {}
      data.totalResults = parseInt(result.searchInformation.totalResults)
      data.links = getLinks(result.items, 3, exact)
      return data
    }
    else {
      throw 'Unsuccessful search'
    }
  })
  .catch(error => {
    console.log('ERROR', error, answer)
    let data = {}
    data.totalResults = 0
    data.links = false
    return data
  })
}

function getLinks(allLinks, number, wiki) {
  let links = []
  for (let i = 0; i < number && i < allLinks.length; i++) {
    if(!wiki) {
      if (allLinks[i].link.includes("en.wikipedia.org")) {
        number++
      }
      else {
        links.push(allLinks[i].link)
      }
    }
    else {
      links.push(allLinks[i].link)
    }
  }
  return links
}

function sortData(data) {
  let dataSorted = {}
  data.forEach( function( obj ){

    for( var key in obj ){
      if( dataSorted[ key ] === undefined )
        dataSorted[ key ] = []

      dataSorted[ key ].push( obj[ key ])
    }

  })
  return dataSorted
}

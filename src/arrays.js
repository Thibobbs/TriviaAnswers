// Import app socket
import { appSocket } from '../config'

let arrays = {}

let image = {}
image.defineImg = function(imgObj) {
  image.data = imgObj
}

export { arrays, image }

// Reset arrays
arrays.reset = function(array = arrays) {
  array.resultsArray = []
  array.purcentsArray = []
  array.allArray = []
}

arrays.findResults = function(result) {
  arrays.resultsArray.push(result)
  calculatePurcentages(result)
  console.log('Results array : ', arrays.resultsArray)
  console.log('Purcent array : ', arrays.purcentsArray)
  let finalResults = findOverallAnswer(arrays.purcentsArray)

  appSocket.emit('results', finalResults)
}

arrays.addResults = function(result) {
  arrays.allArray.push(result)
}

arrays.setNegative = function(negative) {
  arrays.negative = negative
}

function calculatePurcentages(results) {
  let sum = sumArray(results)
  let purcent = []
  if (!sum) {
    arrays.purcentsArray.push([0, 0, 0])
  }
  else {
    results.forEach(answer => {
      purcent.push((answer/sum)*100)
    })
    arrays.purcentsArray.push(purcent)
  }
}

function findOverallAnswer(allResults) {
  let results = sumArrayIndex(allResults)
  console.log('Overall array : ', arrays.purcentsArray.length, results)

  results = divideResults(results)
  results = negativeCalculation(results)
  console.log(results)

  let data = {}
  data.results = results
  data.request = arrays.purcentsArray.length

  return data
}

// Return total sum of array
function sumArray(array) {
  return array.reduce((pv, cv) => pv+cv, 0)
}

// Return sum of same index of different arrays
function sumArrayIndex(array) {
  return array.reduce(function (r, a) {
      a.forEach(function (b, i) {
          r[i] = (r[i] || 0) + b
      })
      return r
  }, [])
}

function divideResults(results) {
  results.forEach((result, i) => {
    results[i] = result / arrays.purcentsArray.length
  })
  return results
}

function negativeCalculation(results) {
  if(image.data.negative) {
    results.forEach((result, i) => {
      results[i] = 100 - result
    })
  }
  return results
}

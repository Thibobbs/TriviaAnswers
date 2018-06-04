// Import app socket
import { appSocket } from '../config';

// Import screenshot gestion
import saveBase64 from './image';

// Import arrays and image obj
import { arrays, image } from './arrays';

// Import async search functions
import asyncTextFromGoogle from './textGoogle/asyncTextFromGoogle';
import asyncFirstResultSearch from './searchGoogle/firstResultSearch/asyncFirstResultSearch';
import asyncDirectSearch from './searchGoogle/directSearch/asyncDirectSearch';
import asyncAnswersSearch from './searchGoogle/answersSearch/asyncAnswersSearch';
import asyncInSiteSearch from './searchGoogle/inSiteSearch/asyncInSiteSearch';

module.exports = function search(img) {
  console.log('Image received');

  // Save image in local
  let imageSearch = saveBase64(img.file)
  .then(() => {
    console.log('IMAGE SAVED ON DISK')
  })

  // REQUEST TEXT FROM GOOGLE VISION
  let textRecognition = imageSearch.then(() => {
    return asyncTextFromGoogle().then(imageInfo => {

      image.defineImg(imageInfo)

      // Send new image to users
      appSocket.emit('newImage',
        {
          file: img.file,
          fileName: img.fileName,
          infos: imageInfo
        }
      );
      return imageInfo
    })
  })

  //REQUEST RESULT FROM FIRST RESULTS W/ GOOGLE DIRECT SEARCH
  let result1 = textRecognition.then(imageInfo => {
    let results = asyncFirstResultSearch(imageInfo).then(searchResults => {
      console.log('First link search results : ', searchResults)
      arrays.findResults(searchResults)
      return searchResults
    })
    return results
  })

  //REQUEST RESULT FROM GOOGLE DIRECT SEARCH
  let results2 = textRecognition.then(imageInfo => {
    let results = asyncDirectSearch(imageInfo).then(searchResults => {
      console.log('Google search results : ', searchResults)
      arrays.findResults(searchResults)
      return searchResults
    })
    return results
  })

  let results34 = textRecognition.then(imageInfo => {

    let answersSearch = asyncAnswersSearch(imageInfo)

    //REQUEST RESULT FROM GOOGLE NULMBER OF RESULTS
    let results3 = answersSearch.then(data => {
      console.log('Number of results : ', data.totalResults)
      arrays.findResults(data.totalResults)
      return data.totalResults
    })

    //REQUEST RESULT FROM IN SITE GOOGLE SEARCH
    let results4 = answersSearch.then(data => {
      console.log('Links : ', data.links)
      let results = asyncInSiteSearch(imageInfo, data.links).then(inSiteResults => {
        console.log('InSite search results : ', inSiteResults)
        arrays.findResults(inSiteResults)
        return inSiteResults
      })
      return results
    })

    return Promise.all([results3, results4]).then(results => {
      return results
    })
  })
}

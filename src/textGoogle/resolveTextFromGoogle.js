// Import config
import { config } from '../../config'

// Import arrays
import { arrays } from '../arrays'

const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
  keyFilename: __dirname + '../../../keyfile.json'
});

const regexWhich = /(which of these|which)/i
const regexNegation = /(n't|not|never)/i


module.exports = function () {
  return new Promise(resolve => {
    client
      .textDetection(`${config.pathImage}image.png`)
      .then(results => {
        console.log('Analyse response')
        const detections = results[0].textAnnotations[0].description
        let descriptions = [];
        let negative = false

        /* question sort */
        let originalQuestion = detections.substr(0, (detections.indexOf('?')+1 || detections.indexOf(':')+1))
        //let originalQuestion = detections.substr(0, (detections.indexOf('?')+1 || detections.indexOf(detections.split(':', 2).join(':').length)+1))
        let question = originalQuestion.replace(regexWhich, 'what')

        if(regexNegation.test(question)){
          question = question.replace(regexNegation, '')
          negative = true
        }
        arrays.setNegative(+negative)

        /* Answers sort */
        let arrAnswers = detections.substr(detections.indexOf('?')+1 || detections.indexOf(':')+1).split('\n')
        //let arrAnswers = detections.substr(detections.indexOf('?')+1 || detections.indexOf(detections.split(':', 2).join(':').length)+1).split('\n')
        let answers = []
        let originalAnswers = []
        
        arrAnswers.forEach(answer => {
          if(answer !== ''){
            originalAnswers.push(answer)
            answers.push(answer.replace(/[^a-z0-9.':&-\s]/gi, ''))
          }
        });


        const infos = {
          originalQuestion,
          originalAnswers,
          question,
          answers,
          negative
        };
        
        resolve(infos);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  });
};

import resolveAnswersSearch from './resolveAnswersSearch';

module.exports = async function (imageInfo, exact = true) {
  console.log('3rd test : Count results for each answers ...');
  return await resolveAnswersSearch(imageInfo, exact);
};

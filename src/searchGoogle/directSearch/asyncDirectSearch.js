import resolveDirectSearch from './resolveDirectSearch';

module.exports = async function (imageInfo) {
  console.log('2nd test : Google the question ...');
  return await resolveDirectSearch(imageInfo);
};

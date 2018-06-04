import resolveFirstResultSearch from './resolveFirstResultSearch';

module.exports = async function (imageInfo) {
  console.log('1st test : Google the question and take 1st result ...');
  return await resolveFirstResultSearch(imageInfo);
};

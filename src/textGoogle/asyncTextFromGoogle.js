import resolveTextFromGoogle from './resolveTextFromGoogle';

module.exports = async function () {
  console.log('Requesting text from Google Vision...');
  return await resolveTextFromGoogle();
};
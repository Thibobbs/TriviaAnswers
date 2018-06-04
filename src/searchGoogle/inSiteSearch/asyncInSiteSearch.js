import resolveInSiteSearch from './resolveInSiteSearch';

module.exports = async function (imageInfo, links) {
  console.log('4th test : Search answers in sites list ...');
  return await resolveInSiteSearch(imageInfo, links);
};

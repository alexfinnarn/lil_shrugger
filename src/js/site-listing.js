/**
 * Imports Site Listing HTML into DOM of pages using it.
 *
 * @type {Element}
 */
var link = document.querySelector('link[href="src/partials/listing.html"]');
var content = link.import;
var el = content.querySelector('script');
document.querySelector('body').appendChild(el.cloneNode(true));

/**
 * Imports Button HTML into DOM of pages using it.
 *
 * @type {Element}
 */
link = document.querySelector('link[href="src/partials/confirm-button.html"]');
content = link.import;
el = content.querySelector('script');
document.querySelector('body').appendChild(el.cloneNode(true));

/**
 * Gets a list of site records based on environment and pass data to template.
 *
 * @param env
 */
function getSiteRecords(env) {
  // Get response of all site records.
  let response = atlasRequest(getAtlasURL(env), 'sites');

  // Response is a Promise object so we must resolve it to get the data out.
  response.then(function (data) {

    // Add links.
    data = formatSiteData(data._items);

    // Place site data in table via site-listing template located in site-listing.html.
    let siteListing = new Vue({
      el: '#site-listing',
      data: {
        searchQuery: '',
        gridColumns: ['id', 'path', 'status', 'updated'],
        gridData: data
      }
    });
  });
}

/**
 * Need to format data for table.
 *
 * @param data
 */
function formatSiteData(data) {
  let formattedData = [];

  data.forEach(function (element, index) {
    let item = [];
    item['id'] = element.sid;
    item['path'] = element.path;
    item['status'] = element.status;
    item['updated'] = element._updated;
    item['etag'] = element._etag;
    formattedData.push(item);
  });

  return formattedData;
}

/**
 * Creates the list of site records based on the environment. Every time the environment
 * changes via the environment selector, the search will update.
 */
$(document).ready(function () {
  getSiteRecords(document.querySelector('.env-list .selected').innerHTML);

  // Ad create a site button to page.
  let siteCreateButton = new Vue({
    el: '#create-site',
    data: {
      label: 'Create A Site',
      callback: 'createSite',
      params: ['goofy', 'doc']
    }
  });
});

/**
 *
 * @param paramas
 */
function createSite() {
  console.log('got here');
  let baseURL = getAtlasURL(document.querySelector('.env-list .selected').innerHTML);
  let endpoint = 'sites';

  let data = JSON.stringify({
    "status": "pending"
  });

  atlasRequest(baseURL, endpoint, query = '', method = 'POST', body = data)
  console.log('You clicked create site.');

  sleep(3000);

  getSiteRecords(document.querySelector('.env-list .selected').innerHTML);
}

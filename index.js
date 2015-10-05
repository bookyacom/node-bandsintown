'use strict';

var pkg          = require('./package.json');
var assert       = require('assert');
var moment       = require('moment');
var debug        = require('debug')(pkg.name);
var prequest     = require('prequest');
var objectAssign = require('object-assign');
var template     = require('lodash.template');

var DATE_FORMAT       = 'YYYY-MM-DD';
var BASE_URL          = 'http://api.bandsintown.com/artists/';

var artistEventAction = template('<%= name %>/events');
var url               = template(BASE_URL + '<%= action %>.json');

var defaultParams      = null;
var getArtist          = null;
var getArtistEventList = null;
var bandsInTownAPI     = null;

var request = function(action, params) {
   var api = url({
      action: action
    });

    debug(api);

    params = objectAssign(params || {}, {
      url: api,
      method: 'GET'
    });

    params.qs = objectAssign(params.qs || {}, defaultParams);

    return prequest(params);
};

/**
 * Get artist info
 * @param  {String} artistName    artist name (url escaped*), mbid_<id>(MusicBrainz ID),fbid_<id>(Facebook Page ID)
 * @return {Object}               Artist information
 */
getArtist = function(artistName) {
  return request(artistName)
    .catch(function(err) {
      debug(err);
      throw err;
    });
};

/**
  * Get all events by artist, by default get future events
  * @param  {String} name   artist name (url escaped*), mbid_<id>(MusicBrainz ID),fbid_<id>(Facebook Page ID)
  * @param  {String} date   yyyy-mm-dd, (yyyy-mm-dd,yyyy-mm-dd) (inclusive range), upcoming all
  * @return {Array}         Array of events
*/
getArtistEventList = function(name, date) {
  var action = artistEventAction({
    name: name
  });

  // get all events past and futures
  var params = {
    qs: {}
  };

  debug(params.qs.date);

  if (date) {
    var dates = date.split(',');
    if (dates.length === 2) {
      dates = dates.map(dates, function(date) {
        return moment(date).format(DATE_FORMAT);
      });

      debug(dates);

      date = dates.join(',');
    }

    params.qs = {
      date: date
    };
  }

  return request(action, params)
    .catch(function(err) {
      debug(err);
      throw err;
    });
};

bandsInTownAPI = function(options) {
  if (String(options) === options) {
    options = {
      appId: options
    };
  }

  options = objectAssign({
    apiVersion: '2.0'
  }, options);

  debug(options);

  assert(options.appId, 'app id should not be null');

  var appId = options.appId;
  var apiVersion = options.apiVersion;

  defaultParams = {
    app_id: appId,
    api_version: apiVersion
  };

  return {
    getArtist: getArtist,
    getArtistEventList: getArtistEventList
  };
};

module.exports = bandsInTownAPI;

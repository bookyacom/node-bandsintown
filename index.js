'use strict';

var pkg          = require('./package.json');
var assert       = require('assert');
var moment       = require('moment');
var debug        = require('debug')(pkg.name);
var prequest     = require('prequest');
var objectAssign = require('object-assign');
var template     = require('lodash.template');

var DATE_FORMAT  = 'YYYY-MM-DD';
var BASE_URL     = 'http://api.bandsintown.com/artists/';
var artistEventAction = template('<%= name %>/events');

var BandsInTownAPI = function(options) {
  options = objectAssign({
    apiVersion: '2.0'
  }, options);

  debug(options);

  assert(options.appId, 'app id should not be null');

  this.appId = options.appId;
  this.apiVersion = options.apiVersion;
  this.defaultParams = {
    app_id: this.appId,
    api_version: this.apiVersion
  };

  this.url = template(BASE_URL + '<%= action %>.json');

  this.request = function(action, params) {
    var api = this.url({
      action: action
    });

    debug(api);

    params = objectAssign(params || {}, {
      url: api,
      method: 'GET'
    });

    params.qs = objectAssign(params.qs || {}, this.defaultParams);

    return prequest(params);
  };

  this.getArtist = function(artistName) {
    return this.request(artistName)
      .catch(function(err) {
        debug(err);
        throw err;
      });
  };

  /**
   * Get all events by artist, by default get future events
   * @param  {String} name [artist name (url escaped*), mbid_<id>(MusicBrainz ID),fbid_<id>(Facebook Page ID)]
   * @param  {String} date [yyyy-mm-dd, (yyyy-mm-dd,yyyy-mm-dd) (inclusive range), upcoming all]
   * @return {Array}      [Array of events]
   */
  this.getArtistEvents = function(name, date) {
    var action = artistEventAction({
      name: name
    });

    // get all events past and futures
    var params = {
      qs: {
        date: moment().format(DATE_FORMAT)
      }
    };

    debug(params.qs.date);

    if (date) {
      var dates = date.split(',');
      dates = dates.map(dates, function(date) {
        return moment(date).format(DATE_FORMAT);
      });

      debug(dates);

      date = dates.join(',');

      params.qs = {
        date: date
      };
    }

    return this.request(action, params)
      .catch(function(err) {
        debug(err);
      });
  };
};

module.exports = BandsInTownAPI;
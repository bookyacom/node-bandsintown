'use strict';

var test = require('tap').test;
var API  = require('./');

test('#BandsInTownAPIs', function(t) {
  t.test('get artist', function(st) {
    var artistName = 'Skrillex';
    var api = API({
      appId: 'bookya'
    });


    st.test('get information', function(sbt) {
      api.getArtist(artistName)
        .then(function(artist) {
          sbt.ok(artist);
          sbt.end();
        });
    });

    st.test('get events', function(sbt) {
      api.getArtistEventList(artistName)
        .then(function(events) {
          sbt.equal(Array.isArray(events), true);
          sbt.end();
        });
    });

    st.test('get events with all', function(sbt) {
      api.getArtistEventList(artistName, 'all')
        .then(function(events) {
          sbt.equal(Array.isArray(events), true);
          sbt.end();
        });
    });
  });

  t.test('return error if app id is not available', function(st) {
    st.throws(function() {
      try {
        var api = API();
      } catch (e) {
        throw new Error(e.message);
      }
    }, new Error('app id should not be null'));
    st.end();
  });
});

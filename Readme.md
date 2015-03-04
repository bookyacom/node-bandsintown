# Bands In Town Nodejs API Library
> Bands In Town Artist API Wrapper, http://www.bandsintown.com/api/overview

## Installation
```
npm install --save bandsintown
```

## Example
```js

var bandsintown = require('bandsintown')(APP_ID);

bandsintown
  .getArtistEventList('Skrillex')
  .then(function(events) {
    // return array of events
  });
```

## Options
### APP_ID
Type: `String`  
BandsInTown App ID

## `getArtist(artistName)`
> query artist information from bandsintown API with artist name

### artistName
Type: `String`  
Artist's name

## `getArtistEventList(artistName, dates)`
> query list of events by artist name

### artistName
Type: `String`  
Artist's name

### dates
Type: `String`  
Documentation: `yyyy-mm-dd, (yyyy-mm-dd,yyyy-mm-dd) (inclusive range), upcoming all`  
A date, or date range to get all events. if you need all events from past and future, pass `all`
default to only getting future events

## License
MIT © [BookYa](https://github.com/bookya)

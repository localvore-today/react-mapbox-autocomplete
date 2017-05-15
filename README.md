# Independent geolocation autocomplete component based on Mapbox

[Mapbox](http://www.mapbox.com) Geo API

Maintained and Developed By: [Localvore Today](http://www.localvoretoday.com)

The component uses mapbox api to autocompelete cities and states without mapbox
maps. It's designed to be extremely light weight and simple to use.

## Change Log
```
version 0.2.3
Upgrade to React es6 class implmentation and updated babel presets

version 0.2.2
Bug fixes for search results when resetSearch is false

version 0.2.0
Add the ability to prepopulate the input field using the query param
Resetting the input after selection is now optional
Added lat, lng, and text to event.target.dataset
```
## Dependencies
Lodash

React 15+

Mapbox Account + API Key

react-mapbox-autocomplete is designed to be agnostic of environment. Works with
any data store(redux, flux, etc) and is compiled to vanilla javascript to work
with any version of ES.

## Installation

```npm install react-mapbox-autocomplete```


## Example(ES6)

### Available PropTypes

publicKey:**Required(String)**

inputClass:**Optional(String)**:Used for passing bootstrap or other classes for input styling

country:**Optional(String)**

onSuggestionSelect:**Required(Func)**:For handling suggestion selections

query:**Optional(String)**:Pre-populate search field

resetSearch:**Optional(Boolean)**: Default is false. Resets the input field
after suggestion select

### Retriving Suggestion Information
you can retrive the event data by targeting event.target.dataset.suggestion as
seen in the example below.

```css
.search {
  margin-bottom: 1.5rem;
}
```

```javascript
import MapboxAutocomplete from 'react-mapbox-autocomplete';

_suggestionSelect(result, lat, lng, text) {
  console.log(result, lat, lng, text)
}

<MapboxAutocomplete publicKey='Your Mapbox Public Key'
                    inputClass='form-control search'
                    onSuggestionSelect={this._suggestionSelect}
                    country='us'
                    resetSearch={false}/>
```

## Styling
You can style the following classes as you see fit.

```css
.react-mapbox-ac-menu {
  width: auto;
  position: absolute;
  z-index: 9999;
  background-color: #fff;
  border: 1px solid #ccc;
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin-top: -1.3rem;
}

.react-mapbox-ac-input {
  margin-bottom: 1.5rem;
}

.react-mapbox-ac-suggestion {
  font-size: 18px;
  margin-bottom: .5rem;
  cursor: pointer;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.react-mapbox-ac-suggestion:hover {
  background-color: #58a;
}
```

## ToDo
1. Tests 
 - Implement JEST
 - Test: each function and render
2. Add Examples
 - add examples to project in a folder called "Examples"
3. Add all query params as Props
 - implement the remainder of query params from https://www.mapbox.com/api-documentation/#request-format

## Contributing
If you would like to contribute to react-mapbox-autocomplete fork the project
and submit a pull request.

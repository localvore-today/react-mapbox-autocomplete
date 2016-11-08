# React Geo Location Component based on Mapbox

Maintained and Developed By: [Localvore Today](http://www.localvoretoday.com)

The component uses mapbox api to fetch geocoordinates and autocompelete
locations without mapbox maps. It's designed to be extremely light weight and
simple to use.

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

#### Available PropTypes

publicKey:*Required(String)*

inputClass:*Optional(String)*:Used for passing bootstrap or other classes for input styling

country:*Optional(String)*

onSuggestionSelect:*Required(Func)*:For handling suggestion selections

#### Retriving Suggestion Information
you can retrive the event data by targeting event.target.dataset.city as seen in
the example below.

```css
.search {
  margin-bottom: 1.5rem;
}
```

```javascript
import MapboxAutocomplete from 'react-mapbox-autocomplete'

_suggestionSelect(event) {
  this._submitSelection(event.target.dataset.city)
}

<MapboxAutocomplete publicKey={this.PK} 
                    inputClass='form-control search'
                    onSuggestionSelect={this._suggestionSelect}
                    country='US'/>
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

## Contributing 
If you would like to contribute to react-mapbox-autocomplete fork the project
and submit a pull request.



import React, { Component } from 'react';
import './index.css';
import { map, extend } from 'lodash';

export default class ReactMapboxAutocomplete extends Component {

  constructor(props) {
    super(props);
    // initial state
    this.state = {
      query: props.query || '',
      queryResults: [],
    };
    // bind this
    this._updateQuery = this._updateQuery.bind(this);
    this._onSuggestionSelect = this._onSuggestionSelect.bind(this);
  }

  _updateQuery(event) {

    this.setState(extend(this.state, {query: event.target.value}));

    // only continue for queries 3 chars or longer
    if (this.state.query.length <= 2) {
      return this.setState(_.extend(this.state, {
        error: false,
        queryResults: []
      }));
    }

    // helper
    const validateNumericArray = function(array, len) {
      return (array && array.length === len) && array.every(function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      });
    };

    // preparing API request
    const apiEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json';
    const qsParams = {
      access_token: this.props.publicKey,
      country: this.props.country,
      limit: this.props.limit,
      types: this.props.filterTypes,
      proximity: validateNumericArray(this.props.proximity, 2) ? this.props.proximity.join(',') : null,
      bbox: validateNumericArray(this.props.bbox, 4) ? this.props.proximity.join(',') : null
    };
    const path = apiEndpoint + '?' + (function objectToQuerystring(obj) {
      return Object.keys(obj).filter((key) => {
        return !!obj[key];
      }).map((key) => {
        return key + '=' + obj[key];
      }).join('&');
    })(qsParams);

    const headers = {
      'Content-Type': 'application/json'
    };

    // fetch mapbox API then update queryResults state
    return fetch(path, {
      headers: headers,
    }).then((res) => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    }).then((json) => {
      this.setState(_.extend(this.state, {
        error: false,
        queryResults: json.features
      }));
    }).catch(err => {
      this.setState(extend(this.state, {
        error: true,
        errorMsg: 'There was a problem retrieving data from mapbox',
        queryResults: []
      }))
    });

  }

  _resetSearch() {

    this.setState({
      query: (this.props.resetSearch) ? event.target.getAttribute('data-suggestion') : '',
      queryResults: []
    });

  }

  _onSuggestionSelect(event) {

    this.props.onSuggestionSelect(
      event.target.getAttribute('data-suggestion'),
      event.target.getAttribute('data-lat'),
      event.target.getAttribute('data-lng'),
      event.target.getAttribute('data-text')
    );

    this._resetSearch();

  }

  render() {
    return (
      <div>
        <input placeholder={ this.props.placeholder || 'Search' }
               className={this.props.inputClass ?
                          this.props.inputClass + ' react-mapbox-ac-input'
                          : 'react-mapbox-ac-input'}
               onChange={this._updateQuery}
               value={this.state.query}
               type='text'/>
        <span>
          <div className='react-mapbox-ac-menu'
               style={this.state.queryResults.length > 0 || this.state.error  ? { display: 'block' }
               : { display: 'none' }}>
            {
              map(this.state.queryResults, (place, i) => {
                return(
                  <div className='react-mapbox-ac-suggestion'
                       onClick={this._onSuggestionSelect}
                       key={i}
                       data-suggestion={place.place_name}
                       data-lng={place.center[0]}
                       data-lat={place.center[1]}
                       data-text={place.text}>

                    {place.place_name}

                  </div>
                )
              })
            }

            {this.state.error && <div className="react-mapbox-ac-suggestion">{this.state.errorMsg}</div>}
          </div>
        </span>
      </div>
    );
  }
}

ReactMapboxAutocomplete.propTypes = {
  inputClass: React.PropTypes.string,
  publicKey: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  onSuggestionSelect: React.PropTypes.func.isRequired,
  country: React.PropTypes.string,
  query: React.PropTypes.string,
  resetSearch: React.PropTypes.bool,
  limit: React.PropTypes.number,
  types: React.PropTypes.string,
  proximity: React.PropTypes.array,
  bbox: React.PropTypes.array
};

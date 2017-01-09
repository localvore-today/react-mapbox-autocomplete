import React from 'react';
import './index.css';
import { map, extend } from 'lodash';

const ReactMapboxAutocomplete = React.createClass ({
  propTypes: {
    inputClass: React.PropTypes.string,
    publicKey: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    onSuggestionSelect: React.PropTypes.func.isRequired,
    country: React.PropTypes.string,
    query: React.PropTypes.string,
    limit: React.PropTypes.number,
    proximity: React.PropTypes.string,
    types: React.PropTypes.string,
    bbox: React.PropTypes.string,
    autocomplete: React.PropTypes.bool,
    resetSearch: React.PropTypes.bool
  },

  getInitialState() {
    let state = {
      error: false,
      errorMsg: '',
      query: this.props.query ? this.props.query : '',
      queryResults: [],
      publicKey: this.props.publicKey,
      resetSearch: this.props.resetSearch ? this.props.resetSearch : false
    }

    return state;
  },

  _updateQuery(event) {
    this.setState(extend(this.state, {query: event.target.value}))

    let header = {
      'Content-Type': 'application/json'
    }

    let host = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    let query = `${this.state.query}.json?`;
    let token = `access_token=${this.state.publicKey}`;

    let countryOpt = this.props.country ? `&country=${this.props.country}` : '';
    let limitOpt = this.props.limit ? `&limit=${this.props.limit}` : '';
    let proximityOpt = this.props.proximity ? `&proximity=${this.props.proximity}` : '';
    let typesOpt = this.props.types ? `&types=${this.props.types}` : '';
    let bboxOpt = this.props.bbox ? `&bbox=${this.props.bbox}` : '';
    let autocompleteOpt = this.props.autocomplete == false ? `&autocomplete=${this.props.autocomplete}` : '';

    let path = 
    (host + query + token) + countryOpt + limitOpt + proximityOpt + typesOpt + bboxOpt + autocompleteOpt;

    if(this.state.query.length > 2) {
      return fetch(path, {
        headers: header,
      }).then(res => {
        if (!res.ok) throw Error(res.statusText)
        return res.json()
      }).then(json => {
        this.setState(extend(this.state, {
          error: false,
          queryResults: json.features
        }))
      }).catch(err => {
        this.setState(extend(this.state, {
          error: true,
          errorMsg: 'There was a problem retrieving data from mapbox',
          queryResults: []
        }))
      })
    } else {
      this.setState(extend(this.state, {
        error: false,
        queryResults: []
      }))
    }
  },

  _resetSearch() {
    if(this.state.resetSearch) {
      this.setState({
        query: '',
        queryResults: []
      })
    } else {
      this.setState(extend(this.state, {
        queryResults: []
      }))
    }
  },

  _onSuggestionSelect(event) {
    if(this.state.resetSearch === false) {
      this.setState(extend(this.state, {
        query: event.target.getAttribute('data-suggestion')
      }))
    }

    this.props.onSuggestionSelect(
      event.target.getAttribute('data-suggestion'),
      event.target.getAttribute('data-lat'),
      event.target.getAttribute('data-lng'),
      event.target.getAttribute('data-text')
    )
  },

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
               style={this.state.queryResults.length > 0 || this.state.error ? { display: 'block' }
               : { display: 'none' }}
               onClick={this._resetSearch}>

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
})

export default ReactMapboxAutocomplete;

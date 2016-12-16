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
    resetSearch: React.PropTypes.bool
  },

  getInitialState() {
    let state = {
      query: this.props.query ? this.props.query : '',
      queryResults: [],
      publicKey: this.props.publicKey,
      resetSearch: this.props.resetSearch ? this.props.resetSearch : false
    }

    return state;
  },

  _updateQuery(event) {
    this.setState(_.extend(this.state, {query: event.target.value}))

    let header = {
      'Content-Type': 'application/json'
    }

    if(this.props.country) {
      var path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
                  this.state.query +
                  '.json?access_token=' +
                  this.state.publicKey +
                  '&country=' +
                  this.props.country
    } else {
      path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
              this.state.query +
              '.json?access_token=' +
              this.state.publicKey
    }

    if(this.state.query.length > 2) {
      return fetch(path, {
        headers: header,
      }).then((res) => {
        return res.json()
      }).then((json) => {
        this.setState(_.extend(this.state, {
          queryResults: json.features
        }))
      })
    } else {
      this.setState(_.extend(this.state, {
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
      this.setState(_.extend(this.state, {
        queryResults: []
      }))
    }
  },

  _onSuggestionSelect(event) {
    this.props.onSuggestionSelect

    if(this.state.resetSearch === false) {
      this.setState(_.extend(this.state, {
        query: event.target.dataset.suggestion
      }))
    }
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
               style={this.state.queryResults.length > 0 ? { display: 'block' }
               : { display: 'none' }}
               onClick={this._resetSearch}>

            {
              _.map(this.state.queryResults, (place, i) => {
                return(
                  <div className='react-mapbox-ac-suggestion'
                       onClick={this.onSuggestionSelect}
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
          </div>
        </span>
      </div>
    );
  }
})

export default ReactMapboxAutocomplete;

import React from 'react';
import './index.css';
import _ from 'lodash';

const ReactMapboxAutocomplete = React.createClass ({
  propTypes: {
    inputClass: React.PropTypes.string,
    publicKey: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    onSuggestionSelect: React.PropTypes.func.isRequired,
    country: React.PropTypes.string
  },

  getInitialState() {
    let state =  {
      query: '',
      queryResults: [],
      publicKey: this.props.publicKey
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
    this.setState({
      query: '',
      queryResults: []
    })
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
                       onClick={this.props.onSuggestionSelect}
                       key={i}
                       data-city={place.place_name}>

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

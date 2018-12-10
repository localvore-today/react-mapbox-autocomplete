import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import './index.css';

class ReactMapboxAutocomplete extends React.Component {
    state = {
        error: false,
        errorMsg: '',
        query: this.props.query ? this.props.query : '',
        queryResults: [],
        publicKey: this.props.publicKey,
        resetSearch: this.props.resetSearch ? this.props.resetSearch : false
    }

    _updateQuery = event => {
        this.setState({query: event.target.value});
        const header = {'Content-Type': 'application/json'};
        let path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json?access_token=' + this.state.publicKey;

        if (this.props.country) {
            path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json?access_token=' + this.state.publicKey + '&country=' + this.props.country;
        }

        this.props.params.forEach(param => {
            path += `&${param.type}=${param.value}`;
        });

        if (this.state.query.length > 2) {
            return fetch(path, {
                headers: header,
            }).then(res => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            }).then(json => {
                this.setState({
                    error: false,
                    queryResults: json.features
                });
            }).catch(err => {
                this.setState({
                    error: true,
                    errorMsg: 'There was a problem retrieving data from mapbox',
                    queryResults: []
                });
            })
        } else {
            this.setState({
                error: false,
                queryResults: []
            });
        }
    }

    _resetSearch = () => {
        if (this.state.resetSearch) {
            this.setState({
                query: '',
                queryResults: []
            });
        } else {
            this.setState({queryResults: []});
        }
    }

    _onSuggestionSelect = event => {
        if (this.state.resetSearch === false) {
            this.setState({query: event.target.getAttribute('data-suggestion')});
        }

        this.props.onSuggestionSelect(
            event.target.getAttribute('data-suggestion'),
            event.target.getAttribute('data-lat'),
            event.target.getAttribute('data-lng'),
            event.target.getAttribute('data-text'),
            event.target.getAttribute('data-place')
        )
    }

    render() {
        return (
            <div>
                <input placeholder={this.props.placeholder || 'Search'}
                       id={this.props.inputId}
                       onClick={this.props.inputOnClick}
                       onBlur={this.props.inputOnBlur}
                       onFocus={this.props.inputOnFocus}
                       className={this.props.inputClass ?
                           this.props.inputClass + ' react-mapbox-ac-input'
                           : 'react-mapbox-ac-input'}
                       onChange={this._updateQuery}
                       value={this.state.query}
                       type='text'/>
                <span>
          <div className='react-mapbox-ac-menu'
               style={this.state.queryResults.length > 0 || this.state.error ? {display: 'block'}
                   : {display: 'none'}}
               onClick={this._resetSearch}>

            {
                map(this.state.queryResults, (place, i) => {
                    return (
                        <div className='react-mapbox-ac-suggestion'
                             onClick={this._onSuggestionSelect}
                             key={i}
                             data-place={JSON.stringify(place)}
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

ReactMapboxAutocomplete.defaultProps = {
    inputId: null,
    inputOnFocus: null,
    inputOnBlur: null,
    inputOnClick: null,
    params: []
};

ReactMapboxAutocomplete.propTypes = {
    inputId: PropTypes.string,
    inputOnFocus: PropTypes.func,
    inputOnBlur: PropTypes.func,
    inputOnClick: PropTypes.func,
    inputClass: PropTypes.string,
    publicKey: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onSuggestionSelect: PropTypes.func.isRequired,
    country: PropTypes.string,
    params: PropTypes.array, // add optional query params, options include:
    // [ country, language, limit, reverseMode, routing, types ]
    // More info: https://www.mapbox.com/api-documentation/#retrieve-places-near-a-location
    // prop type is array of { type, value } objects, where value is consistent with Mapbox API requirements
    query: PropTypes.string,
    resetSearch: PropTypes.bool
}

export default ReactMapboxAutocomplete;

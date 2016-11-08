'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./index.css');

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _extend = require('lodash/extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactMapboxAutocomplete = _react2.default.createClass({
  displayName: 'ReactMapboxAutocomplete',

  propTypes: {
    inputClass: _react2.default.PropTypes.string,
    publicKey: _react2.default.PropTypes.string.isRequired,
    placeholder: _react2.default.PropTypes.string,
    onSuggestionSelect: _react2.default.PropTypes.func.isRequired,
    country: _react2.default.PropTypes.string
  },

  getInitialState: function getInitialState() {
    var state = {
      query: '',
      queryResults: [],
      publicKey: this.props.publicKey
    };

    return state;
  },
  _updateQuery: function _updateQuery(event) {
    var _this = this;

    this.setState(_.extend(this.state, { query: event.target.value }));

    var header = {
      'Content-Type': 'application/json'
    };

    if (this.props.country) {
      var path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json?access_token=' + this.state.publicKey + '&country=' + this.props.country;
    } else {
      path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json?access_token=' + this.state.publicKey;
    }

    if (this.state.query.length > 2) {
      return fetch(path, {
        headers: header
      }).then(function (res) {
        return res.json();
      }).then(function (json) {
        _this.setState(_.extend(_this.state, {
          queryResults: json.features
        }));
      });
    } else {
      this.setState(_.extend(this.state, {
        queryResults: []
      }));
    }
  },
  _resetSearch: function _resetSearch() {
    this.setState({
      query: '',
      queryResults: []
    });
  },
  render: function render() {
    var _this2 = this;

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('input', { placeholder: this.props.placeholder || 'Search',
        className: this.props.inputClass ? this.props.inputClass + ' react-mapbox-ac-input' : 'react-mapbox-ac-input',
        onChange: this._updateQuery,
        value: this.state.query,
        type: 'text' }),
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          'div',
          { className: 'react-mapbox-ac-menu',
            style: this.state.queryResults.length > 0 ? { display: 'block' } : { display: 'none' },
            onClick: this._resetSearch },
          _.map(this.state.queryResults, function (place, i) {
            return _react2.default.createElement(
              'div',
              { className: 'react-mapbox-ac-suggestion',
                onClick: _this2.props.onSuggestionSelect,
                key: i,
                'data-suggestion': place.place_name },
              place.place_name
            );
          })
        )
      )
    );
  }
});

exports.default = ReactMapboxAutocomplete;

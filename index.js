'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./index.css');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactMapboxAutocomplete = _react2.default.createClass({
  displayName: 'ReactMapboxAutocomplete',
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

    this.setState(_lodash2.default.extend(this.state, { query: event.target.value }));

    var header = {
      'Content-Type': 'application/json'
    };

    var path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json?access_token=' + this.state.publicKey + '&country=us';

    if (this.state.query.length > 2) {
      return fetch(path, {
        headers: header
      }).then(function (res) {
        return res.json();
      }).then(function (json) {
        _this.setState(_lodash2.default.extend(_this.state, {
          queryResults: json.features
        }));
      });
    } else {
      this.setState(_lodash2.default.extend(this.state, {
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
        id: 'mapbox-auto-complete',
        type: 'text' }),
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          'div',
          { className: 'react-mapbox-ac-menu',
            style: this.state.queryResults.length > 0 ? { display: 'block' } : { display: 'none' },
            onClick: this._resetSearch },
          _lodash2.default.map(this.state.queryResults, function (place, i) {
            return _react2.default.createElement(
              'div',
              { className: 'react-mapbox-ac-suggestion',
                onClick: _this2.props.onSuggestionSelect,
                key: i,
                'data-city': place.place_name },
              place.place_name
            );
          })
        )
      )
    );
  }
});

exports.default = ReactMapboxAutocomplete;

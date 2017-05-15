'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactMapboxAutocomplete = function (_React$Component) {
  _inherits(ReactMapboxAutocomplete, _React$Component);

  function ReactMapboxAutocomplete() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactMapboxAutocomplete);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactMapboxAutocomplete.__proto__ || Object.getPrototypeOf(ReactMapboxAutocomplete)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      error: false,
      errorMsg: '',
      query: _this.props.query ? _this.props.query : '',
      queryResults: [],
      publicKey: _this.props.publicKey,
      resetSearch: _this.props.resetSearch ? _this.props.resetSearch : false
    }, _this._updateQuery = function (event) {
      _this.setState({ query: event.target.value });
      var header = { 'Content-Type': 'application/json' };
      var path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + _this.state.query + '.json?access_token=' + _this.state.publicKey;

      if (_this.props.country) {
        path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + _this.state.query + '.json?access_token=' + _this.state.publicKey + '&country=' + _this.props.country;
      }

      if (_this.state.query.length > 2) {
        return fetch(path, {
          headers: header
        }).then(function (res) {
          if (!res.ok) throw Error(res.statusText);
          return res.json();
        }).then(function (json) {
          _this.setState({
            error: false,
            queryResults: json.features
          });
        }).catch(function (err) {
          _this.setState({
            error: true,
            errorMsg: 'There was a problem retrieving data from mapbox',
            queryResults: []
          });
        });
      } else {
        _this.setState({
          error: false,
          queryResults: []
        });
      }
    }, _this._resetSearch = function () {
      if (_this.state.resetSearch) {
        _this.setState({
          query: '',
          queryResults: []
        });
      } else {
        _this.setState({ queryResults: [] });
      }
    }, _this._onSuggestionSelect = function (event) {
      if (_this.state.resetSearch === false) {
        _this.setState({ query: event.target.getAttribute('data-suggestion') });
      }

      _this.props.onSuggestionSelect(event.target.getAttribute('data-suggestion'), event.target.getAttribute('data-lat'), event.target.getAttribute('data-lng'), event.target.getAttribute('data-text'));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactMapboxAutocomplete, [{
    key: 'render',
    value: function render() {
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
              style: this.state.queryResults.length > 0 || this.state.error ? { display: 'block' } : { display: 'none' },
              onClick: this._resetSearch },
            (0, _lodash.map)(this.state.queryResults, function (place, i) {
              return _react2.default.createElement(
                'div',
                { className: 'react-mapbox-ac-suggestion',
                  onClick: _this2._onSuggestionSelect,
                  key: i,
                  'data-suggestion': place.place_name,
                  'data-lng': place.center[0],
                  'data-lat': place.center[1],
                  'data-text': place.text },
                place.place_name
              );
            }),
            this.state.error && _react2.default.createElement(
              'div',
              { className: 'react-mapbox-ac-suggestion' },
              this.state.errorMsg
            )
          )
        )
      );
    }
  }]);

  return ReactMapboxAutocomplete;
}(_react2.default.Component);

ReactMapboxAutocomplete.propTypes = {
  inputClass: _propTypes2.default.string,
  publicKey: _propTypes2.default.string.isRequired,
  placeholder: _propTypes2.default.string,
  onSuggestionSelect: _propTypes2.default.func.isRequired,
  country: _propTypes2.default.string,
  query: _propTypes2.default.string,
  resetSearch: _propTypes2.default.bool
};

exports.default = ReactMapboxAutocomplete;

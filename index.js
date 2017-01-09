'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./index.css');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactMapboxAutocomplete = function (_Component) {
  _inherits(ReactMapboxAutocomplete, _Component);

  function ReactMapboxAutocomplete(props) {
    _classCallCheck(this, ReactMapboxAutocomplete);

    // initial state
    var _this = _possibleConstructorReturn(this, (ReactMapboxAutocomplete.__proto__ || Object.getPrototypeOf(ReactMapboxAutocomplete)).call(this, props));

    _this.state = {
      query: props.query || '',
      queryResults: []
    };
    // bind this
    _this._updateQuery = _this._updateQuery.bind(_this);
    _this._onSuggestionSelect = _this._onSuggestionSelect.bind(_this);
    return _this;
  }

  _createClass(ReactMapboxAutocomplete, [{
    key: '_updateQuery',
    value: function _updateQuery(event) {
      var _this2 = this;

      this.setState((0, _lodash.extend)(this.state, { query: event.target.value }));

      // only continue for queries 3 chars or longer
      if (this.state.query.length <= 2) {
        return this.setState(_.extend(this.state, {
          error: false,
          queryResults: []
        }));
      }

      // helper
      var validateNumericArray = function validateNumericArray(array, len) {
        return array && array.length === len && array.every(function isNumber(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        });
      };

      // preparing API request
      var apiEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + this.state.query + '.json';
      var qsParams = {
        access_token: this.props.publicKey,
        country: this.props.country,
        limit: this.props.limit,
        types: this.props.filterTypes,
        proximity: validateNumericArray(this.props.proximity, 2) ? this.props.proximity.join(',') : null,
        bbox: validateNumericArray(this.props.bbox, 4) ? this.props.proximity.join(',') : null
      };
      var path = apiEndpoint + '?' + function objectToQuerystring(obj) {
        return Object.keys(obj).filter(function (key) {
          return !!obj[key];
        }).map(function (key) {
          return key + '=' + obj[key];
        }).join('&');
      }(qsParams);

      var headers = {
        'Content-Type': 'application/json'
      };

      // fetch mapbox API then update queryResults state
      return fetch(path, {
        headers: headers
      }).then(function (res) {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      }).then(function (json) {
        _this2.setState(_.extend(_this2.state, {
          error: false,
          queryResults: json.features
        }));
      }).catch(function (err) {
        _this2.setState((0, _lodash.extend)(_this2.state, {
          error: true,
          errorMsg: 'There was a problem retrieving data from mapbox',
          queryResults: []
        }));
      });
    }
  }, {
    key: '_resetSearch',
    value: function _resetSearch() {

      this.setState({
        query: this.props.resetSearch ? event.target.getAttribute('data-suggestion') : '',
        queryResults: []
      });
    }
  }, {
    key: '_onSuggestionSelect',
    value: function _onSuggestionSelect(event) {

      this.props.onSuggestionSelect(event.target.getAttribute('data-suggestion'), event.target.getAttribute('data-lat'), event.target.getAttribute('data-lng'), event.target.getAttribute('data-text'));

      this._resetSearch();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

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
              style: this.state.queryResults.length > 0 || this.state.error ? { display: 'block' } : { display: 'none' } },
            (0, _lodash.map)(this.state.queryResults, function (place, i) {
              return _react2.default.createElement(
                'div',
                { className: 'react-mapbox-ac-suggestion',
                  onClick: _this3._onSuggestionSelect,
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
}(_react.Component);

exports.default = ReactMapboxAutocomplete;


ReactMapboxAutocomplete.propTypes = {
  inputClass: _react2.default.PropTypes.string,
  publicKey: _react2.default.PropTypes.string.isRequired,
  placeholder: _react2.default.PropTypes.string,
  onSuggestionSelect: _react2.default.PropTypes.func.isRequired,
  country: _react2.default.PropTypes.string,
  query: _react2.default.PropTypes.string,
  resetSearch: _react2.default.PropTypes.bool,
  limit: _react2.default.PropTypes.number,
  types: _react2.default.PropTypes.string,
  proximity: _react2.default.PropTypes.array,
  bbox: _react2.default.PropTypes.array
};

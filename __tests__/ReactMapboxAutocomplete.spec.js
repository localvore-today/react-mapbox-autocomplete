'use strict';

import 'whatwg-fetch';
import React from 'react';
import { shallow, mount } from 'enzyme';
import mockResponse from '../mocks/mock-response';
import mapboxResponse from '../mocks/mapbox-response';
import ReactMapboxAutocomplete from '../ReactMapboxAutocomplete';

let state;
let event = { target: { value: 'Waitsfield' } };
window.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse(200, null, JSON.stringify(mapboxResponse))));

beforeEach(() => {
  state = {
    publicKey: '',
    onSuggestionSelect: jest.fn(),
    query: ''
  };
});

describe('_updateQuery', () => {
  it('should have no query results', () => {
    const wrapper = shallow(<ReactMapboxAutocomplete {...state} />);
    expect(wrapper.state('queryResults')).toEqual([]);
    expect(wrapper.find('.react-mapbox-ac-suggestion')).toHaveLength(0);
  });

  it('should save the query to state and have query results', () => {
    const wrapper = shallow(<ReactMapboxAutocomplete {...state} />);
    wrapper.instance()._updateQuery(event)
      .then(() => {
        expect(wrapper.state('query')).toEqual('Waitsfield');
        expect(wrapper.state('queryResults')).toEqual(mapboxResponse.features)
        expect(wrapper.find('.react-mapbox-ac-suggestion')).toHaveLength(1);
      });
  });
});

describe('_resetSearch', () => {
  it('should reset the queryResults', () => {
    const wrapper = shallow(<ReactMapboxAutocomplete {...state} />);
    wrapper.instance()._updateQuery(event)
      .then(() => {
        wrapper.find('.react-mapbox-ac-menu').simulate('click');
        expect(wrapper.state('query')).toEqual('Waitsfield');
        expect(wrapper.state('queryResults')).toEqual([]);
      });
  });

  it('should reset the query and queryResults', () => {
    state.resetSearch = true;
    const wrapper = shallow(<ReactMapboxAutocomplete {...state} />);
    wrapper.instance()._updateQuery(event)
      .then(() => {
        wrapper.find('.react-mapbox-ac-menu').simulate('click');
        expect(wrapper.state('query')).toEqual('');
        expect(wrapper.state('queryResults')).toEqual([]);
      });
  });
});

describe('_onSuggestionSelect', () => {
  it('should set query to dataset suggestion and invoke callback', () => {
    const wrapper = mount(<ReactMapboxAutocomplete {...state} />);
    wrapper.instance()._updateQuery(event)
      .then(() => {
        wrapper.find('.react-mapbox-ac-suggestion').first().simulate('click');
        expect(wrapper.state('query')).toEqual(mapboxResponse.features[0].place_name);
        expect(wrapper.prop('onSuggestionSelect')).toHaveBeenCalledWith(
          mapboxResponse.features[0].place_name, 
          mapboxResponse.features[0].center[1].toString(), 
          mapboxResponse.features[0].center[0].toString(), 
          mapboxResponse.features[0].text
        );
      });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import Test from '../src';


test('<Test />', () => {
  const wrapper = shallow(<Test />);

  expect(wrapper).toMatchSnapshot();
});

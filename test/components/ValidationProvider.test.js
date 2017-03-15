import React from 'react';
import { shallow } from 'enzyme';
import ValidationProvider from '../../src/components/ValidationProvider';

describe('<ValidationProvider />', () => {
  test("renders it child function's component directly", () => {
    const wrapper = shallow(
      <ValidationProvider>
        <div className="test-child" />
      </ValidationProvider>
    );

    expect(wrapper.is('.test-child'));
    expect(wrapper).toMatchSnapshot();
  });

  test('sets this.validator to coreValidator', () => {
    const wrapper = shallow(
      <ValidationProvider>
        <div className="test-child" />
      </ValidationProvider>
    );

    const { validator } = wrapper.instance();

    expect(validator).toMatchSnapshot();
  });
});

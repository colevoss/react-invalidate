import React from 'react';
import { shallow, mount } from 'enzyme';
import Validator from '../src/components/Validator';

const trueValidator = () => true;
const failedValidator = () => Promise.reject('message');

describe('<Validator />', () => {
  test("renders it child function's component directly", () => {
    const wrapper = shallow(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    expect(wrapper.is('.test-child'));
    expect(wrapper).toMatchSnapshot();
  });

  test('passes the correct params to child function', () => {
    shallow(
      <Validator>
        {params => {
          expect(params.isValid).toBeTruthy();
          expect(params.message).toBeNull();
          expect(params.validate).toBeInstanceOf(Function);
          expect(params.clearValidation).toBeInstanceOf(Function);
          expect(params).toMatchSnapshot();

          return <div className="test-child" />;
        }}
      </Validator>
    );
  });

  describe('Validator.validate', () => {
    test('returns Promise<true> if validation passes', () => {
      const wrapper = shallow(
        <Validator validators={trueValidator}>
          {({ validate }) => (
            <input
              type="text"
              onBlur={() => {
                validate().then(val => expect(val).toBeTruthy());
              }}
            />
          )}
        </Validator>
      );

      wrapper.find('input').simulate('blur');
    });

    test('cathes rejected promise with message when validation fails', () => {
      const wrapper = shallow(
        <Validator validators={failedValidator}>
          {({ validate }) => (
            <input
              type="text"
              onBlur={() => {
                validate().then(message => {
                  expect(message).toBe('message');
                });
              }}
            />
          )}
        </Validator>
      );

      wrapper.find('input').simulate('blur');
    });

    test('sets state.isValid to false and message to failure message if validations fail', () => {
      const wrapper = mount(
        <Validator validators={failedValidator}>
          {() => <div className="test-child" />}
        </Validator>
      );

      wrapper.instance().validate().then(() => {
        expect(wrapper.state().isValid).toBeFalsy();
        expect(wrapper.state().message).toBe('message');
      });
    });

    test('sets state.lastValidatedValue to the latest validated value', () => {
      const wrapper = mount(
        <Validator validators={trueValidator}>
          {() => <div className="test-child" />}
        </Validator>
      );

      wrapper.instance().validate('test').then(() => {
        expect(wrapper.state().lastValidatedValue).toBe('test');
      });
    });

    test('uses state.lastValidatedValue if no value is provided in validate', () => {
      const mockValidator = jest.fn();
      mockValidator.mockReturnValueOnce(true).mockReturnValueOnce(true);

      const wrapper = mount(
        <Validator validators={mockValidator}>
          {() => <div className="test-child" />}
        </Validator>
      );

      const testVal = 'test';

      wrapper.instance().validate(testVal).then(() => {
        wrapper.instance().validate().then(() => {
          expect(mockValidator).toBeCalledWith(testVal);
          expect(mockValidator).lastCalledWith(testVal);
        });
      });
    });
  });

  test('sets _mounted to true on mount', () => {
    const wrapper = mount(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    expect(wrapper.instance()._mounted).toBeTruthy();
  });

  test('sets _mounted to false on unmount', () => {
    const wrapper = mount(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    const inst = wrapper.instance();
    wrapper.unmount();
    expect(inst._mounted).toBeFalsy();
  });

  test('Validator.defaultState', () => {
    const wrapper = shallow(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    expect(wrapper.instance().defaultState()).toMatchSnapshot();
  });

  test('Validator.clearValidation', () => {
    const wrapper = shallow(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    wrapper.setState({ isValid: false, message: 'blah' });
    wrapper.instance().clearValidation();
    expect(wrapper.state()).toEqual(wrapper.instance().defaultState());
  });
});

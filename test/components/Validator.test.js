import React from 'react';
import { shallow, mount } from 'enzyme';
import Validator from '../../src/components/Validator';

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

  describe('#validate', () => {
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

    test('calls #onValidate when in ValidationProvider context', () => {
      const validator = { onValidate: jest.fn() };

      const wrapper = shallow(
        <Validator validators={trueValidator}>
          {({ validate }) => (
            <input
              type="text"
              onBlur={() => {
                validate().then(val => {
                  expect(val).toBeTruthy();
                  expect(validator.onValidate).toHaveBeenCalled();
                  expect(validator.onValidate.mock.calls[0][1]).toBeTruthy();
                });
              }}
            />
          )}
        </Validator>,
        { context: { validator } }
      );

      wrapper.find('input').simulate('blur');
    });

    test('sets state.isValid to false and message to failure message if validations fail', () => {
      const wrapper = shallow(
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
      const wrapper = shallow(
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

      const wrapper = shallow(
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
    const wrapper = shallow(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    const inst = wrapper.instance();
    wrapper.unmount();
    expect(inst._mounted).toBeFalsy();
  });

  test('#defaultState', () => {
    const wrapper = shallow(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    expect(wrapper.instance().defaultState()).toMatchSnapshot();
  });

  test('#clearValidation', () => {
    const wrapper = shallow(
      <Validator>
        {() => <div className="test-child" />}
      </Validator>
    );

    wrapper.setState({ isValid: false, message: 'blah' });
    wrapper.instance().clearValidation();
    expect(wrapper.state()).toEqual(wrapper.instance().defaultState());
  });

  test('#validateOnMount', () => {
    const mockValidatorOne = jest.fn();
    const mockValidatorTwo = jest.fn();

    mount(
      <Validator validators={mockValidatorOne} validateOnMount>
        {() => <div className="test-child" />}
      </Validator>
    );

    mount(
      <Validator validators={mockValidatorTwo}>
        {() => <div className="test-child" />}
      </Validator>
    );

    expect(mockValidatorOne.mock.calls.length).toBe(1);
    expect(mockValidatorTwo.mock.calls.length).toBe(0);
  });

  describe('In ValidationProvider context', () => {
    test('sets this.validator if validator is in context', () => {
      const validator = { registerValidator: () => {} };
      const wrapper = mount(
        <Validator>
          {() => <div className="test-child" />}
        </Validator>,
        { context: { validator } }
      );

      expect(wrapper.instance().validator).toEqual(validator);
    });

    test('calls registerValidator on mount and to set this.unsubscribe', () => {
      const validator = { registerValidator: jest.fn(), onValidate: () => {} };
      validator.registerValidator.mockReturnValueOnce('unsubscribe');

      const mockValidator = jest.fn();
      mockValidator.mockReturnValueOnce(true);

      const wrapper = mount(
        <Validator id="id" validators={mockValidator}>
          {() => <div className="test-child" />}
        </Validator>,
        { context: { validator } }
      );

      validator.registerValidator.mock.calls[0][1]();

      expect(validator.registerValidator).toHaveBeenCalled();
      expect(validator.registerValidator.mock.calls[0][0]).toBe('id');
      expect(mockValidator).toHaveBeenCalled();
      expect(wrapper.instance().unsubscribe).toBe('unsubscribe');
    });

    test('#onValide', () => {
      const validator = { onValidate: jest.fn() };

      const wrapper = shallow(
        <Validator id="id">
          {() => <div className="test-child" />}
        </Validator>,
        { context: { validator } }
      );

      wrapper.instance().onValidate();

      expect(validator.onValidate).toHaveBeenCalled();
      expect(validator.onValidate).toHaveBeenCalledWith('id', true);
    });
  });
});

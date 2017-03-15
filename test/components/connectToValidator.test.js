import React from 'react';
import { shallow, mount } from 'enzyme';
import connectToValidator from '../../src/components/connectToValidator';

const TestComp = props => <button {...props} />;

const mockCoreValidatorInitializer = (isValid = true) => {
  const mockUnsubscribe = jest.fn();
  const mockSubscribe = jest.fn(() => mockUnsubscribe);
  const mockValidate = jest.fn(() => Promise.resolve(isValid));

  return {
    subscribe: mockSubscribe,
    validate: mockValidate,
    areAllValid: () => isValid,
  };
};

describe('connectToValidator', () => {
  test('throws error if anything but a function is provided', () => {
    expect(() => connectToValidator()).toThrowErrorMatchingSnapshot();
  });

  test('throws error if mapValidatorToProps doesnt return object', () => {
    const WrappedTestComp = connectToValidator(() => {})(TestComp);

    const render = () => shallow(<WrappedTestComp className="test-comp" />, {
      context: {
        validator: mockCoreValidatorInitializer(),
      },
    });

    expect(render).toThrowErrorMatchingSnapshot();
  });

  test('returned function returns component as its given', () => {
    const WrappedTestComp = connectToValidator(() => ({}))(TestComp);
    const wrapper = shallow(<WrappedTestComp className="test-comp" />, {
      context: {
        validator: mockCoreValidatorInitializer(),
      },
    });

    expect(wrapper.is('.test-comp')).toBeTruthy;
  });

  test('subscribes to validator on mount with .handleChange', () => {
    const WrappedTestComp = connectToValidator(() => ({}))(TestComp);
    const mockCoreValidator = mockCoreValidatorInitializer();

    const wrapper = mount(<WrappedTestComp />, {
      context: {
        validator: mockCoreValidator,
      },
    });

    expect(mockCoreValidator.subscribe).toHaveBeenCalled();
    expect(mockCoreValidator.subscribe).toHaveBeenCalledWith(wrapper.instance().handleChange);
  });

  test('unsubscribes to validator on unmount', () => {
    const WrappedTestComp = connectToValidator(() => ({}))(TestComp);
    const mockCoreValidator = mockCoreValidatorInitializer();

    const wrapper = mount(<WrappedTestComp />, {
      context: {
        validator: mockCoreValidator,
      },
    });

    const spyOnUnsubscriber = jest.spyOn(wrapper.instance(), 'unsubscribe');

    wrapper.unmount();

    expect(spyOnUnsubscriber).toHaveBeenCalled();
  });

  test('sets state to the correct mappedState', () => {
    const mapValidatorToProps = ({ isValid }) => ({
      disabled: isValid,
    });

    const WrappedTestComp = connectToValidator(mapValidatorToProps)(TestComp);
    const mockCoreValidator = mockCoreValidatorInitializer();

    const wrapper = mount(<WrappedTestComp />, {
      context: {
        validator: mockCoreValidator,
      },
    });

    expect(wrapper.state().mappedValidator.disabled).toBeTruthy();
  });

  test('handleChange sets state to new mappedState', () => {
    const mapValidatorToProps = jest.fn();
    mapValidatorToProps.mockReturnValueOnce({
      disabled: true,
    });

    const WrappedTestComp = connectToValidator(mapValidatorToProps)(TestComp);
    const mockCoreValidator = mockCoreValidatorInitializer();

    const wrapper = mount(<WrappedTestComp />, {
      context: {
        validator: mockCoreValidator,
      },
    });

    expect(wrapper.state().mappedValidator.disabled).toBeTruthy();

    mapValidatorToProps.mockReturnValueOnce({
      disabled: false,
    });

    wrapper.instance().handleChange();

    expect(wrapper.state().mappedValidator.disabled).toBeFalsy();
  });
});

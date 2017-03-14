// @flow

import type { RegisteredValidators, CoreValidator } from '../shared/types';

export default function initializeCoreValidator(): CoreValidator {
  // Object of validators by name and validation status
  let registeredValidators: RegisteredValidators = {};

  // Whether or not the validator is running
  // Since its possible to run actual async code in validators,
  // validation could take some time.
  let _isValidating = false;

  // An array of functions to be ran when #validate is ran
  // Listeners can either be the validation function itself or anything
  // that wants to be updated when validation is ran
  const listeners = [];

  const isValidating = () => _isValidating;
  const getValidations = () => registeredValidators;

  // Removes the listener at index
  const unsubscribe = (index: number) => listeners.splice(index, 1);

  // Adds new listener fn and returns unsubscribe function for that listener
  const subscribe = (fn: Function) => {
    listeners.push(fn);
    const index = listeners.indexOf(fn);
    return () => unsubscribe(index);
  };

  // Remove validator from registeredValidators
  const derigisterValidator = (name: string): RegisteredValidators => Object.keys(registeredValidators).reduce(
    (validatorMap, key) => {
      if (key === name) return validatorMap;

      return {
        ...validatorMap,
        [key]: registeredValidators[key],
      };
    },
    {}
  );

  // Add new validator to registeredValidators and subscription to listeners
  const registerValidator = (name: string, fn: Function) => {
    let unsubscriber: Function;

    registeredValidators = {
      ...registeredValidators,
      [name]: true,
    };

    if (fn) unsubscriber = subscribe(fn);

    return () => {
      unsubscriber && unsubscriber();
      registeredValidators = derigisterValidator(name);
    };
  };

  // Update registeredValidators with the validation status of validator at key
  const onValidate = (key: string, isValid: boolean) => {
    registeredValidators = {
      ...registeredValidators,
      [key]: isValid,
    };
  };

  const areAllValid = (): boolean => {
    for (const validatorName in registeredValidators) {
      if (!registeredValidators[validatorName]) return false;
    }

    return true;
  };

  const validate = async (): Promise<boolean> => {
    _isValidating = true;

    for (let i = 0; i < listeners.length; i++) {
      await listeners[i]();
    }

    _isValidating = false;

    return areAllValid();
  };

  return {
    isValidating,
    getValidations,
    unsubscribe,
    subscribe,
    registerValidator,
    derigisterValidator,
    onValidate,
    areAllValid,
    validate,
  };
}

initializeCoreValidator();

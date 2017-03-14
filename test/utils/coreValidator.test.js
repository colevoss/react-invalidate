import initializeCoreValidator from '../../src/utils/coreValidator';

describe('initializeCoreValidator', () => {
  test('returns the correct shape', () => {
    expect(initializeCoreValidator()).toMatchSnapshot();
  });

  test('isValidating() returns false if not validating', () => {
    expect(initializeCoreValidator().isValidating()).toBeFalsy();
  });

  test('getValidations() returns registeredValidators', () => {
    const coreValidator = initializeCoreValidator();
    expect(coreValidator.getValidations()).toEqual({});
  });

  describe('registerValidator()/derigisterValidator()', () => {
    test('it adds a new validator to registeredValidators', () => {
      const coreValidator = initializeCoreValidator();
      coreValidator.registerValidator('test', () => {});
      expect(coreValidator.getValidations()).toMatchSnapshot();
    });

    test('it adds a new listener to listeners', () => {
      const coreValidator = initializeCoreValidator();
      const listener = jest.fn();
      coreValidator.registerValidator('test', listener);
      coreValidator.getSubscriptions()[0]();

      expect(coreValidator.getSubscriptions().length).toBe(1);
      expect(listener.mock.calls.length).toBe(1);
    });

    test('returns a function that unsubscribes the listener and derigisters the validator', () => {
      const coreValidator = initializeCoreValidator();
      const unsubscriber = coreValidator.registerValidator('test', () => {});

      expect(coreValidator.getValidations()).toEqual({ test: true });
      expect(coreValidator.getSubscriptions().length).toBe(1);

      unsubscriber();

      expect(coreValidator.getValidations()).toEqual({});
      expect(coreValidator.getSubscriptions().length).toBe(0);
    });

    test('dergister removes registeredValidator by name', () => {
      const coreValidator = initializeCoreValidator();
      coreValidator.registerValidator('test');
      coreValidator.registerValidator('test2');
      expect(coreValidator.deregisterValidator('test')).toEqual({ test2: true });
    });
  });

  test('onValidate() updates registeredValidators', () => {
    const coreValidator = initializeCoreValidator();
    coreValidator.registerValidator('test');

    coreValidator.onValidate('test', false);

    expect(coreValidator.getValidations()).toMatchSnapshot();
  });

  test('areAllValid() returns false if any validations are failed otherwise true', () => {
    const coreValidator = initializeCoreValidator();
    coreValidator.registerValidator('test');

    expect(coreValidator.areAllValid()).toBeTruthy();

    coreValidator.onValidate('test', false);
    expect(coreValidator.areAllValid()).toBeFalsy();
  });

  describe('validate', () => {
    test('calls each listener in listeners', async () => {
      const validators = {
        one: jest.fn(),
        two: jest.fn(),
      };

      const coreValidator = initializeCoreValidator();
      coreValidator.registerValidator('one', validators.one);
      coreValidator.registerValidator('two', validators.two);

      await coreValidator.validate();

      expect(validators.one.mock.calls.length).toBe(1);
      expect(validators.two.mock.calls.length).toBe(1);
    });

    test('returns areAllValid() when finished with validations', async () => {
      const coreValidator = initializeCoreValidator();

      const validator = () => coreValidator.onValidate('test', false);

      coreValidator.registerValidator('test', validator);

      const validationResult = await coreValidator.validate();

      expect(validationResult).toBeFalsy();
    });
  });
});

import runValidators from '../../src/utils/runValidators';

describe('#runValidators', () => {
  test('calls each validator', () => {
    const validators = [jest.fn().mockReturnValue(true), jest.fn().mockReturnValue(true)];

    const value = 'test';

    runValidators(validators, value);

    expect(validators).toMatchSnapshot();
  });

  test('returns true for each validator if all tests pass', async () => {
    const validators = [jest.fn().mockReturnValue(true), jest.fn().mockReturnValue(true)];

    const result = await runValidators(validators);

    expect(result).toEqual([true, true]);
  });

  test('returns failed message if one validator fails', async () => {
    const validators = [jest.fn().mockReturnValue(true), jest.fn().mockReturnValue(Promise.reject('fail'))];

    try {
      await runValidators(validators);
    } catch (message) {
      expect(message).toBe('fail');
    }
  });
});

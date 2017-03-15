// @flow

import { PropTypes } from 'react';

export const ValidatorFunctionPropTypes = PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]);

export const CoreValidatorPropTypes = PropTypes.shape({
  isValidating: PropTypes.func,
  getValidations: PropTypes.func,
  unsubscribe: PropTypes.func,
  subscribe: PropTypes.func,
  registerValidators: PropTypes.func,
  derigisterValidator: PropTypes.func,
  onValidate: PropTypes.func,
  areAllValid: PropTypes.func,
  validate: PropTypes.func,
});

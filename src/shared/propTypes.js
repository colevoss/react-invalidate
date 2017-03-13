// @flow

import { PropTypes } from 'react';

export const ValidatorFunctionPropTypes = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.arrayOf(PropTypes.func),
]);

// @flow

import type { AsyncValidator, FieldValue, ValidationResult } from '../shared/types';

const runValidators = async (validators: Array<AsyncValidator>, value: ?FieldValue): ValidationResult =>
  Promise.all(validators.map(validator => validator(value)));

export default runValidators;

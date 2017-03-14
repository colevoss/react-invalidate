// @flow

import type { FieldValidtor, FieldValue } from '../shared/types';

const runValidators = async (validators: Array<FieldValidtor>, value: FieldValue): Promise<string | boolean> =>
  Promise.all(validators.map(validator => validator(value)));

export default runValidators;

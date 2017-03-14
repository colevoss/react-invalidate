// @flow

export type FieldValue = string | number | Array<*> | Object;
export type VR = string | boolean;
export type ValidationResult = Promise<*>;
export type AsyncValidator = (value: ?FieldValue) => ValidationResult;

// <Validator />

export type ValidationClearer = () => void;

export type ChildParams = {
  validate: AsyncValidator,
  isValid: boolean,
  message: ?string,
  clearValidation: ValidationClearer,
};

export type ValidatorChildFunction = (params: ChildParams) => React$Element<*>;

// coreValidator

export type RegisteredValidators = { [key: string]: boolean };

export type CoreValidator = {
  isValidating: () => boolean,
  getValidations: () => RegisteredValidators,
  unsubscribe: (index: number) => Array<Function>,
  subscribe: (fn: Function) => Function,
  registerValidator: (name: string, fn: Function) => Function,
  derigisterValidator: (name: string) => RegisteredValidators,
  onValidate: (key: string, isValid: boolean) => void,
  areAllValid: () => boolean,
  validate: () => Promise<boolean>,
};

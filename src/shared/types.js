// @flow

// <Validator />
export type FailedValidation = Promise<string>;

export type ValidatorFunction = (val: any, message?: string) => FailedValidation | boolean;
export type FieldValidator = (value: ?any) => Promise<string | boolean>;

export type ValidationClearer = () => void;

export type ChildParams = {
  validate: FieldValidtor,
  isValid: boolean,
  message: ?string,
  clearValidation: ValidationClearer,
};

export type ValidatorChildFunction = (params: ChildParams) => React$Element<*>;

export type FieldValue = string | number | Array | Object;

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

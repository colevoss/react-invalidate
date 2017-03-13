// @flow


export type FailedValidation = Promise<string>

export type ValidatorFunction = (val: any, message?: string) => boolean | FailedValidation

export type FieldValidtor = (value: ?any) => Promise<string | boolean>

export type ValidationClearer = () => void

export type ChildParams = {
  validate: FieldValidtor,
  isValid: boolean,
  message: ?string,
  clearValidation: ValidationClearer,
}

export type ValidatorChildFunction = (params: ChildParams) => React$Element<*>

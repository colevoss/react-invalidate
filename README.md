# React Invalidate [![Build Status](https://travis-ci.org/colevoss/react-invalidate.svg?branch=master)](https://travis-ci.org/colevoss/react-invalidate) [![npm](https://img.shields.io/npm/v/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate) [![npm](https://img.shields.io/npm/dm/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate) [![codecov](https://codecov.io/gh/colevoss/react-invalidate/branch/master/graph/badge.svg)](https://codecov.io/gh/colevoss/react-invalidate)

React Invalidate is an easy, yet flexible way to add validation to any form in your React projects.


## Instalation
* npm: `npm install --save react-invalidate`
* yarn: `yarn add react-invalidate`


### Usage

#### Single Field Validation
If you want to validate one field, you can do so with the `Validator` component. You can supply the `Validator`
component with one or more validator functions as well as a functional child that renders the field to be validated.

The child function receives an object with a `validate` function, the validation status as `isValid`, and the failed
validation message provided by the validator(s). You can call the validate function on any of the input's events
and when the validation is complete it will update the `isValid` and `message` values.

```javascript
import { Validator } from 'react-invalidate';

const requiredValidator = (value: any, message: string = 'Required') => (
  !!value ? true : Promise.reject(message);
);

const SomeInput = ({ inputValue }) => (
  <Validator validators={requiredValidator}>
    {({ validate, isValid, message }) => (
      <div>
        <input
          type="text"
          value={inputValue}
          className={isValid ? 'normal-input' : 'invalid-input'}
          onBlur={e => validate(e.target.value)}
        />

        {message && <div>{message}</div>}
      </div>
    )}
  </Validator>
)
```

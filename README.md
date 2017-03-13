[![Build Status](https://travis-ci.org/colevoss/react-invalidate.svg?branch=master)](https://travis-ci.org/colevoss/react-invalidate)
[![npm](https://img.shields.io/npm/v/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate)
[![npm](https://img.shields.io/npm/dm/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate)
[![codecov](https://codecov.io/gh/colevoss/react-invalidate/branch/master/graph/badge.svg)](https://codecov.io/gh/colevoss/react-invalidate)

# React Invalidate
React Invalidate is an easy, yet flexible way to add validation to any form in your React projects.

## Validator
The `Validator` component can be used to wrap any inputs with custom validations. This happens by providing the
`Validator` component with one or more `validators` as well as a functional child. The child function will be passed
an object with data about the fields current validation state as well as functions to customize how and when
the field is validated.

#### Usage:
```javascript
import { Validator } from 'react-invalidate'

const requiredValidator = (val = '', message = 'Required') => (
  !!val.replace(/^\s+/, '') || Promise.reject(message)
)

const ValidatedInput = () => (
  <Validator validators={requiredValidator}>
    {({validate, isValid, message}) => {
      return (
        <div>
          <input type="text" onBlur={e => validate(e.target.value)} />

          {message &&
            <div>{message}</div>
          }
        </div>
      );
    }}
  </Validator>
)
```

In the example above, we are calling the `validate` function with the value of the input on the input's `onBlur`
handler. `isValid` is `true` by default, but once the field has been blurred with no value, the `requiredValidator` is
ran. Since it returns a rejected promise, it will fail validation and update the component with `isValid` as false.

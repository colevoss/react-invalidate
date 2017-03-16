# React Invalidate [![Build Status](https://travis-ci.org/colevoss/react-invalidate.svg?branch=master)](https://travis-ci.org/colevoss/react-invalidate) [![npm](https://img.shields.io/npm/v/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate) [![npm](https://img.shields.io/npm/dm/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate) [![codecov](https://codecov.io/gh/colevoss/react-invalidate/branch/master/graph/badge.svg)](https://codecov.io/gh/colevoss/react-invalidate)

React Invalidate is an easy, yet flexible way to add validation to any form in your React projects.


## Instalation
* npm: `npm install --save react-invalidate`
* yarn: `yarn add react-invalidate`


## Usage

### Single Field Validation
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

### Form Validation
If you want to have a form with multiple validated inputs, where a certain action would validate all the fields, you
can wrap the form in the `ValidationProvider` component. This uses a `react-redux` style subscription model to keep track
of each field wrapped in a `Validator` component that is a child of the `ValidationProvider`.

To gain access to the central validator, you can wrap any component in the `connectToValidator` higher order component
to call the global `validate` function and get data about the validation status of the form.

**Form.jsx**
```javascript
import { ValidationProvider, Validator } from 'react-invalidate';
import { requiredValidator } from '../path/to/validators';
import FormSubmitButton from '../path/to/FormSubmitButton';

const Form = ({ onSubmit }) => (
  <ValidationProvider>
    <div>
      <Validator validators={requiredValidator} id="first-name">
        {({ validate, isValid, message }) => (
          <div>
            <input
              type="text"
              name="first-name"
              value={inputValue}
              className={isValid ? 'normal-input' : 'invalid-input'}
              onBlur={e => validate(e.target.value)}
            />

            {message && <div>{message}</div>}
          </div>
        )}
      </Validator>

      <Validator validators={requiredValidator} id="last-name">
        {({ validate, isValid, message }) => (
          <div>
            <input
              type="text"
              name="last-name"
              value={inputValue}
              className={isValid ? 'normal-input' : 'invalid-input'}
              onBlur={e => validate(e.target.value)}
            />

            {message && <div>{message}</div>}
          </div>
        )}
      </Validator>

      <FormSubmitButton onClick={onSubmit} />
    </div>
  </ValidationProvider>
);

export default Form;
```

**FormSubmitButton.jsx**
```javascript
import { connectToValidator } from 'react-invalidate';

const FormSubmitButton = ({ onClick }) => (
  <button onClick={onClick}>Submit Form</button>
);


const mapValidatorToProps = (validator, ownProps) => ({
  onClick: async () => {
    const isValid = await validator.validate();

    if (!isValid) return false;

    ownProps.onClick();
  },
})

export default connectToValidator(mapValidatorToProps)(FormSubmitButton);
```

In the example above, the `FormSubmitButton` will run validations for all `Validator` wrapped inputs in the form. If
it returns `false`, it will not submit the form because it never gets to the `ownProps.onClick` function.

Inversely, if all fields are valid, it will call it's `onClick` function and everything will be grand.

Since the button runs all of the field validations, each field will be automatically updated with is new `isValid` status
and failed validation `message` and update showing accordingly.


### Asyc Validations
Since validations can return promises, you can write asynchronous validators with relative ease. Say we wanted to validate
that a user's email is unique at signup, we would need to write a validator that makes a call to some back end to check for
email uniqueness.

**uniqueEmailValidator.js**
```javascript
const uniqueEmailValidator = async (email: string, message: string = 'Email must be unique') => {
  const isEmailUnique = await checkEmailUniquenessWithServer(email);

  if (!isEmailUnique) throw 'Email is not unique'; // Same as returning a rejected promise

  return isEmailUnique;
};

export default uniqueEmailValidator;
```

**form.jsx**
```javascript
import uniqueEmailValidator from '../path/to/uniqueEmailValidator';
import requiredValidator from '../path/to/requiredValidator';

const SomeInput = ({ inputValue }) => (
  <Validator validators={[requiredValidator, uniqueEmailValidator]}>
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

Now, when this field is blurred, it will run the required validator and the uniqueEmailValidator. If the field is blank
the requiredValidator will throw first and show the required message. If the field is not blank, the uniqueEmailValidator
will be ran and fail if the email is not unique, updating the `isValid` and `message` args appropriately.


### Todo:
* Fully document each component
* Research integrations with [valerie](https://github.com/developerdizzle/valerie)

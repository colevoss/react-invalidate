[![Build Status](https://travis-ci.org/colevoss/react-invalidate.svg?branch=master)](https://travis-ci.org/colevoss/react-invalidate)
[![npm](https://img.shields.io/npm/v/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate)
[![npm](https://img.shields.io/npm/dm/react-invalidate.svg)](https://www.npmjs.com/package/react-invalidate)
[![codecov](https://codecov.io/gh/colevoss/react-invalidate/branch/master/graph/badge.svg)](https://codecov.io/gh/colevoss/react-invalidate)

# React Invalidate
React Invalidate is an easy, yet flexible way to add validation to any form in your React projects.


## How does it work?
React Invalidate can work a couple different ways. You can use just the `Validator` component to wrap individual fields
or you can wrap an entire form with the `ValidationProvider` component to sync up validation for the whole form,
including things like submit buttons.


### Single Field Validation:
If you wanted to validate just one component, all you need to do is wrap that component in the `Validator` component
and provide with some promise based validation like so:

```javascript
const required = (val, message = 'Required') => {
  return !!val.replace(/^\s+/, '') || Promise.reject('Required');
};


<Validator
  validators={required}
  valueGetter={() => someValue}
  validateOn={['onBlur']}
  id="firstName"
  >
  <input type="text" value={someValue} onChange={onChange} />
</Validator>
```

You can see that we gave the `Validator` component the `required` function as a validator. This function either returns
true, if valid, or a rejected Promise. The validator function is ran on `onBlur` of the wrapped input. Any normal
event that you can give to the wrapped input can be used in the `validateOn` function.

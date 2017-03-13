// @flow

type RegisteredValidators = {[key: string]: boolean}
type Listeners = Array<Function>

export default function initializeCoreValidator() {
  // Map of validators by key and whether they are valid or not
  let registeredValidators: RegisteredValidators = {}

  let _isValidating = false

  // Array of subscriptions that are fired when validation happens
  const listeners: Listeners = []

  const isValidating = () => _isValidating
  const getValidations = () => registeredValidators
  const unsubscribe = (index: number) => listeners.splice(index, 1)


  const subscribe = (fn: Function): Function => {
    listeners.push(fn)
    const index = listeners.indexOf(fn)
    return () => unsubscribe(index)
  }


  const deregisterValidator = (name: string): RegisteredValidators => (
    Object.keys(registeredValidators).reduce((vMap, key) => {
      if (key === name) return vMap

      return {
        ...vMap,
        [key]: registeredValidators[key],
      }
    }, {})
  )


  const registerValidator = (name: string, fn: Function): Function => {
    let unsubscriber

    registeredValidators = {
      ...registeredValidators,
      [name]: true,
    }

    if (fn) unsubscriber = subscribe(fn)

    return () => {
      if (unsubscriber) unsubscriber()
      registeredValidators = deregisterValidator(name)
    }
  };


  const onValidate = (key: string, isValid: boolean) => {
    registeredValidators = {
      ...registeredValidators,
      [key]: isValid,
    }
  }


  const areAllValid = (): boolean => {
    for (const validatorKey in registeredValidators) {
      const isValid = registeredValidators[validatorKey];

      if (!isValid) return isValid;
    }

    return true;
  }

  // const areAllValid = () => (
  //   Object.keys(registeredValidators).reduce((isValid, k) => {
  //     return !isValid ? isValid : registeredValidators[k]
  //   }, true)
  // )


  const validate = async () => {
    _isValidating = true
    for (let i = 0; i < listeners.length; i++) {
      await listeners[i]()
    }
    _isValidating = false

    return areAllValid()
  }

  return {
    subscribe,
    unsubscribe,
    registerValidator,
    deregisterValidator,
    validate,
    onValidate,
    areAllValid,
    isValidating,
    getValidations,
  }
}

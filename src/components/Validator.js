// @flow

import { PropTypes, Component } from 'react';

import type {
  ValidatorFunction,
  ValidatorChildFunction,
  ChildParams,
  FieldValidtor,
  ValidationClearer,
} from '../shared/types';

import { ValidatorFunctionPropTypes } from '../shared/propTypes';

type State = {
  isValid: boolean,
  message: ?string,
  lastValidatedValue: ?any,
};

type Props = {
  children: ValidatorChildFunction,
  validators: ValidatorFunction | Array<ValidatorFunction>,
  id: string,
  initialValue?: any,
  validateOnMount: boolean,
};

export default class Validator extends Component {
  constructor(props: Props) {
    super(props);

    this.id = props.id;

    this.state = {
      isValid: true,
      message: null,
      lastValidatedValue: this.props.initialValue,
    };
  }

  _mounted: boolean;
  id: string;
  state: State;
  props: Props;

  componentDidMount() {
    this._mounted = true;

    this.validateOnMount();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  validateOnMount(): void {
    this.props.validateOnMount && this.validate();
  }

  defaultState(): State {
    return {
      isValid: true,
      message: null,
      lastValidatedValue: this.state.lastValidatedValue,
    };
  }

  clearValidation: ValidationClearer = () => {
    this.setState(this.defaultState());
  };

  validate: FieldValidtor = value => {
    const validators = Array.isArray(this.props.validators)
      ? this.props.validators
      : [this.props.validators];

    const toValidate = value || this.state.lastValidatedValue;

    return Promise.all(validators.map(validator => validator(toValidate)))
      .then(
        // All validators passed
        () => {
          this._mounted &&
            this.setState({
              isValid: true,
              message: null,
              lastValidatedValue: value,
            });

          return true;
        }
      )
      .catch(
        // Message of the first validation to fail
        message => {
          this._mounted &&
            this.setState({
              isValid: false,
              message,
              lastValidatedValue: value,
            });

          return message;
        }
      );
  };

  childParams(): ChildParams {
    return {
      validate: this.validate,
      isValid: this.state.isValid,
      message: this.state.message,
      clearValidation: this.clearValidation,
    };
  }

  render() {
    return this.props.children(this.childParams());
  }
}

Validator.propTypes = {
  children: PropTypes.func,
  validators: ValidatorFunctionPropTypes,
  id: PropTypes.string,
  initialValue: PropTypes.any,
  validateOnMount: PropTypes.bool,
};

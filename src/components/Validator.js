// @flow

import { PropTypes, Component } from 'react';
import runValidators from '../utils/runValidators';

import type {
  AsyncValidator,
  ValidationResult,
  ValidatorChildFunction,
  ChildParams,
  ValidationClearer,
  CoreValidator,
  FieldValue,
} from '../shared/types';

import { ValidatorFunctionPropTypes, CoreValidatorPropTypes } from '../shared/propTypes';

type State = {
  isValid: boolean,
  message: ?string,
  lastValidatedValue: ?FieldValue,
};

type Props = {
  children: ValidatorChildFunction,
  validators: AsyncValidator | Array<AsyncValidator>,
  id: string,
  initialValue?: FieldValue,
  validateOnMount: boolean,
};

type Context = {
  validator: ?CoreValidator,
};

export default class Validator extends Component {
  static propTypes = {
    children: PropTypes.func,
    validators: ValidatorFunctionPropTypes,
    id: PropTypes.string,
    initialValue: PropTypes.any,
    validateOnMount: PropTypes.bool,
  };

  static contextTypes = {
    validator: CoreValidatorPropTypes,
  };

  constructor(props: Props, context: Context) {
    super(props, context);

    this.id = props.id;
    this.validator = context.validator;

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
  context: Context;
  validator: ?CoreValidator;
  unsubscribe: ?() => void;

  componentDidMount() {
    this._mounted = true;
    this.subscribeToValidator();
    this.validateOnMount();
  }

  componentWillUnmount() {
    this._mounted = false;
    this.unsubscribe && this.unsubscribe();
  }

  validateOnMount() {
    this.props.validateOnMount && this.validate();
  }

  subscribeToValidator() {
    if (!this.validator) return;

    this.unsubscribe = this.validator.registerValidator(this.id, async () => {
      await this.validate(this.state.lastValidatedValue);
    });
  }

  defaultState(): State {
    return {
      isValid: true,
      message: null,
      lastValidatedValue: this.state.lastValidatedValue,
    };
  }

  onValidate() {
    this.validator && this.validator.onValidate(this.id, this.state.isValid);
  }

  clearValidation: ValidationClearer = () => {
    this.setState(this.defaultState());
  };

  validate = async (value: ?FieldValue): ValidationResult => {
    const validators = Array.isArray(this.props.validators) ? this.props.validators : [this.props.validators];
    const toValidate = value || this.state.lastValidatedValue;

    try {
      await runValidators(validators, toValidate);

      this.setState(
        {
          isValid: true,
          message: null,
          lastValidatedValue: toValidate,
        },
        this.onValidate
      );

      return true;
    } catch (message) {
      this.setState(
        {
          isValid: false,
          message,
          lastValidatedValue: toValidate,
        },
        this.onValidate
      );

      return message;
    }
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

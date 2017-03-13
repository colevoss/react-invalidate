// @flow

import { PropTypes, Component, Children } from 'react'
import { ValidatorPropTypes } from '../shared/propTypes';
import type {
  ValidationProviderProps,
  ValidationProviderContext,
} from '../shared/types';

export default class ValidationProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  }


  static childContextTypes = {
    validator: ValidatorPropTypes
  }


  props: ValidationProviderProps
  context: ValidationProviderContext
  validator: Object


  constructor(props: ValidationProviderProps, context: ValidationProviderContext) {
    super(props, context);
    this.validator = {};
  }


  getChildContext() {
    return {
      validator: this.validator,
    }
  }


  render() {
    return Children.only(this.props.children)
  }
}

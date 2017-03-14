// @flow

import { PropTypes, Component, Children } from 'react';
import initializeCoreValidator from '../utils/coreValidator';
import type { CoreValidator } from '../shared/types';
import { CoreValidatorPropTypes } from '../shared/propTypes';

type Props = {
  children: React$Element<*>,
};

// type Context = {
//   validator: CoreValidator,
// };

export default class ValidationProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static childContextTypes = {
    validator: CoreValidatorPropTypes,
  };

  constructor(props: Props) {
    super(props);

    this.validator = initializeCoreValidator();
  }

  getChildContext() {
    return {
      validator: this.validator,
    };
  }

  props: Props;
  // context: Context;
  validator: CoreValidator;

  render() {
    return Children.only(this.props.children);
  }
}

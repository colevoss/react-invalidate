// @flow

import { Component, createElement } from 'react';
import invariant from 'invariant';
import type { CoreValidator } from '../shared/types';
import { CoreValidatorPropTypes } from '../shared/propTypes';

type ValidatorData = {
  isValid: boolean,
  validate: () => Promise<boolean>,
};

type State<T> = {
  mappedValidator: T,
};

type MapValidatorToProps<T> = (validatorData: ValidatorData, ownProps: Object) => T;

const connectToValidator = <ValidatorMap: Object>(mapValidatorToProps: MapValidatorToProps<ValidatorMap>) => {
  invariant(typeof mapValidatorToProps === 'function', 'mapValidatorToProps needs to be a function.');

  return (ConnectedComponent: ReactClass<ValidatorMap>): ReactClass<{}> => {
    class ConnectedToValidator extends Component {
      constructor(props, context) {
        super(props, context);

        invariant(
          context.validator,
          'connectToValidator needs to be used in the context of a <ValidationProvider> context.'
        );

        this.validator = context.validator;

        const mappedValidator = this.mapValidatorToProps();

        invariant(
          typeof mappedValidator === 'object',
          'provided mapValidatorToProps function needs to return an object.'
        );

        this.state = { mappedValidator };
      }

      componentDidMount() {
        this.unsubscribe = this.validator.subscribe(this.handleChange);
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      unsubscribe: Function;
      validator: CoreValidator;
      state: State<ValidatorMap>;

      handleChange = () => {
        this.setState({
          mappedValidator: this.mapValidatorToProps(),
        });
      };

      mapValidatorToProps(): ValidatorMap {
        return mapValidatorToProps(
          {
            isValid: this.validator.areAllValid(),
            validate: this.validator.validate,
          },
          this.props
        );
      }

      render() {
        return createElement(ConnectedComponent, this.state.mappedValidator);
      }
    }

    ConnectedToValidator.contextTypes = {
      validator: CoreValidatorPropTypes,
    };

    return ConnectedToValidator;
  };
};

export default connectToValidator;

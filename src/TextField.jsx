import PropTypes from 'prop-types';
import React from 'react';
import Input from 'react-toolbox/lib/input';
import InputMask from 'react-input-mask';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const TextField = (props) => {
  const { formField, value, ...others } = props;
  if (!formField.mask) {
    return (
      <Input
        {...others}
        value={value === null ? '' : value}
        type={formField.type}
        multiline={formField.type === 'textarea'}
        label={formField.description || formField.title}
        hint={formField.placeholder || formField.title}
        maxLength={formField.maxlength}
        {...formField.props}
      />
    );
  }

  return (
    <InputMask
      value={value === null ? '' : value}
      mask={formField.mask}
      {...formField.maskProps}
      {...others}
    >
      {(inputProps) => {
        return (
          <Input
            {...inputProps}
            disabled={props.disabled}
            readOnly={props.readOnly}
            type={formField.type}
            multiline={formField.type === 'textarea'}
            label={formField.description || formField.title}
            hint={formField.placeholder || formField.title}
            maxLength={formField.maxlength}
            {...formField.props}
          />
        );
      }}
    </InputMask>
  );
};

// This prevents InputMask from erroring due to mismatch with this defaultProp on the React-Toolbox Input component.
TextField.defaultProps = {
  disabled: false,
  readOnly: false,
};

TextField.propTypes = {
  formField: formShape,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default asSchemaField(TextField, 'input');

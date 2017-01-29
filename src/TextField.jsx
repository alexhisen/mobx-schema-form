import React from 'react';
import Input from 'react-toolbox/lib/input';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const TextField = (props) => {
  const { formField, value, ...others } = props;
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
};

TextField.propTypes = {
  formField: formShape,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};

export default asSchemaField(TextField, 'input');

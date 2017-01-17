import React from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const CheckboxField = (props) => {
  const { formField, value, error, ...others } = props; // eslint-disable-line no-unused-vars
  return (
    <Checkbox
      {...others}
      checked={!!value}
      label={formField.description || formField.title}
      {...formField.props}
    />
  );
};

CheckboxField.propTypes = {
  formField: formShape,
  value: React.PropTypes.bool,
  error: React.PropTypes.string,
};

export default asSchemaField(CheckboxField, 'checkbox');

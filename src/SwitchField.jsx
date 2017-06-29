import PropTypes from 'prop-types';
import React from 'react';
import Switch from 'react-toolbox/lib/switch';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const SwitchField = (props) => {
  const { formField, value, error, ...others } = props; // eslint-disable-line no-unused-vars
  let trueLabel;
  let falseLabel;
  if (formField.titleMap && formField.titleMap[0]) {
    trueLabel = formField.titleMap[0].name ? formField.titleMap[0].value : formField.titleMap[0];
    if (formField.titleMap[1]) {
      falseLabel = formField.titleMap[1].name ? formField.titleMap[1].value : formField.titleMap[1];
    }
  }

  return (
    <div>
      <Switch
        {...others}
        checked={!!value}
        label={value ? trueLabel : falseLabel}
        {...formField.props}
      />
      <abbr>{formField.description || ''}</abbr>
    </div>
  );
};

SwitchField.propTypes = {
  formField: formShape,
  value: PropTypes.bool,
  error: PropTypes.string,
};

export default asSchemaField(SwitchField);

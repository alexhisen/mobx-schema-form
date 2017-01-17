import React from 'react';
import Switch from 'react-toolbox/lib/switch';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const SwitchField = (props) => {
  const { formField, value, error, ...others } = props; // eslint-disable-line no-unused-vars
  return (
    <div>
      <Switch
        {...others}
        checked={!!value}
        label={value ? formField.titleMap[0] : formField.titleMap[1]}
        {...formField.props}
      />
      <abbr>{formField.description || ''}</abbr>
    </div>
  );
};

SwitchField.propTypes = {
  formField: formShape,
  value: React.PropTypes.bool,
  error: React.PropTypes.string,
};

export default asSchemaField(SwitchField, 'switch');

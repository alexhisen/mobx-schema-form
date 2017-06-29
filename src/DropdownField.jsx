import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

function asString(value) {
  return value === null ? '' : String(value);
}

const DropdownField = (props) => {
  const { formField, value, ...others } = props;
  const titleMap = formField.titleMap.map((item) => { return item.name ? { label: item.name, value: asString(item.value), group: item.group } : item; });
  return (
    <Dropdown
      {...others}
      value={asString(value)}
      label={formField.description}
      source={titleMap}
      {...formField.props}
    />
  );
};

DropdownField.propTypes = {
  formField: formShape,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool,
  ]),
};

export default asSchemaField(DropdownField, 'dropdown');

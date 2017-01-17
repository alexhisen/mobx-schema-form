import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const DropdownField = (props) => {
  const { formField, value, ...others } = props;
  const titleMap = formField.titleMap.map((item) => { return item.name ? { label: item.name, value: item.value } : item; });
  return (
    <Dropdown
      {...others}
      label={formField.description}
      source={titleMap}
      value={value}
      {...formField.props}
    />
  );
};

DropdownField.propTypes = {
  formField: formShape,
  value: React.PropTypes.number,
};

export default asSchemaField(DropdownField, 'dropdown');

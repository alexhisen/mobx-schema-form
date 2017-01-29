import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const DropdownField = (props) => {
  const { formField, ...others } = props;
  const titleMap = formField.titleMap.map((item) => { return item.name ? { label: item.name, value: item.value, group: item.group } : item; });
  return (
    <Dropdown
      {...others}
      label={formField.description}
      source={titleMap}
      {...formField.props}
    />
  );
};

DropdownField.propTypes = {
  formField: formShape,
};

export default asSchemaField(DropdownField, 'dropdown');

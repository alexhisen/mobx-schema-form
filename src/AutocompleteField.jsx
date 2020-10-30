import PropTypes from 'prop-types';
import React from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

function asString(value) {
  return value === null ? '' : String(value);
}

const AutocompleteField = (props) => {
  const { formField, value, ...others } = props;
  let source = {};
  if (Array.isArray(formField.titleMap)) {
    formField.titleMap.forEach((item) => {
      if (item.name) {
        source[item.value] = item.name;
      } else {
        source[item] = asString(item);
      }
    });
  } else if (value === null) {
    source = [];
  } else {
    source = Array.isArray(value) ? value.map(asString) : [value];
  }
  return (
    <Autocomplete
      {...others}
      value={value}
      label={formField.description}
      source={source}
      multiple={formField.type === 'multiselect' || formField.schema.type === 'array'}
      {...formField.props}
    />
  );
};

AutocompleteField.propTypes = {
  formField: formShape,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    ),
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default asSchemaField(AutocompleteField, 'autocomplete');

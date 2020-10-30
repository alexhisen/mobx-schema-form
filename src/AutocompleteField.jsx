import PropTypes from 'prop-types';
import React from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

function asString(value) {
  return value === null ? '' : String(value);
}

class AutocompleteField extends React.Component {
  onChange = (value) => {
    if (Array.isArray(value) && value.length === 0) {
      value = null;
    }
    this.props.onChange(value);
  };

  render() {
    const { formField, value, onChange, ...others } = this.props; // eslint-disable-line no-unused-vars
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
    // Autocomplete component incorrectly checks for typeof value which returns object for null, so give it [] instead
    return (
      <Autocomplete
        {...others}
        value={value || []}
        onChange={this.onChange}
        label={formField.description}
        source={source}
        multiple={formField.type === 'multiselect' || formField.schema.type === 'array'}
        {...formField.props}
      />
    );
  }
}


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
  onChange: PropTypes.func.isRequired,
};

export default asSchemaField(AutocompleteField, 'autocomplete');

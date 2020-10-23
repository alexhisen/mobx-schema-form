import PropTypes from 'prop-types';
import React from 'react';
import { formShape } from './schemaFormPropTypes';

const FieldWrapper = (props) => {
  return (
    <dl
      data-field-type={props.fieldType || props.formField.type}
      data-checked={props.checked}
      className={(props.className || '') + (props.hasError ? ' SchemaField--error' : '')}
    >
      <dd>{props.formField.title} {props.formField.required ? <span className="SchemaField__required" > *</span> : null}</dd>
      <dt>{props.children}</dt>
    </dl>
  );
};

FieldWrapper.propTypes = {
  children: PropTypes.element,
  fieldType: PropTypes.string,
  hasError: PropTypes.bool,
  checked: PropTypes.bool,
  className: PropTypes.string,
  formField: formShape,
};

export default FieldWrapper;

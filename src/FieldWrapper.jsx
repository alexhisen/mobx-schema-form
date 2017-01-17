import React from 'react';
import { formShape } from './schemaFormPropTypes';

const FieldWrapper = (props) => {
  return (
    <dl
      data-field-type={props.fieldType || props.formField.type}
      className={props.formField.className || '' + (props.hasError ? ' SchemaField--error' : '')}
    >
      <dd>{props.formField.title} {props.formField.required ? <span className="SchemaField__required" > *</span> : null}</dd>
      <dt>{props.children}</dt>
    </dl>
  );
};

FieldWrapper.propTypes = {
  children: React.PropTypes.element,
  fieldType: React.PropTypes.string,
  hasError: React.PropTypes.bool,
  formField: formShape,
};

export default FieldWrapper;

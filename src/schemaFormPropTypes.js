import React from 'react';

// Unfortunately eslint-plugin-react doesn't support validating against imported shapes:
// https://github.com/yannickcr/eslint-plugin-react/issues/817

export const formShape = React.PropTypes.shape({
  key: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
  type: React.PropTypes.string,
  title: React.PropTypes.string,
  /* either an array of values or array of objects with name and value and possibly group keys */
  titleMap: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
    React.PropTypes.any,
    React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      value: React.PropTypes.any.isRequired,
      group: React.PropTypes.string,
    }),
  ])),
  placeholder: React.PropTypes.string,
  default: React.PropTypes.any,
  description: React.PropTypes.string,
  required: React.PropTypes.bool,
  validationMessage: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
  condition: React.PropTypes.string,
  minlength: React.PropTypes.number, // Note that schema.minLength and maxLength are copied to
  maxlength: React.PropTypes.number, // formField.minlength and maxlength (lowercase!)
  minimum: React.PropTypes.number,
  maximum: React.PropTypes.number,
  items: React.PropTypes.array,
  schema: React.PropTypes.shape({
    type: React.PropTypes.string,
    default: React.PropTypes.any,
    enum: React.PropTypes.array,
    format: React.PropTypes.string,
    pattern: React.PropTypes.string,
    /* Non-standard - allows multiple form fields to map to same model key: */
    modelKey: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
  }),
  /* The rest are non-SchemaForm-standard props */
  mobxCondition: React.PropTypes.string, /* only used in FieldSet right now for a mobx-reactive condition */
  className: React.PropTypes.string,
  min: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  max: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  step: React.PropTypes.number,
  tickLabelsStep: React.PropTypes.number,
  tickLabelsFormat: React.PropTypes.func,
  props: React.PropTypes.object, /* props passed as-is to the React-Toolbox component */
  validations: React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string])),
}).isRequired;

export const modelShape = React.PropTypes.shape({
  data: React.PropTypes.object.isRequired,
  dataErrors: React.PropTypes.object.isRequired,
  saveNotification: React.PropTypes.shape({ active: React.PropTypes.bool.isRequired }),
  startEditing: React.PropTypes.func,
  stopEditing: React.PropTypes.func,
  getSavedData: React.PropTypes.func,
  status: React.PropTypes.shape({
    errors: React.PropTypes.array,
    isReady: React.PropTypes.bool,
    isReadOnly: React.PropTypes.bool,
    isInProgress: React.PropTypes.bool,
    canSave: React.PropTypes.bool,
    hasChanges: React.PropTypes.bool,
  }),
  fields: React.PropTypes.object, /* exists only while a SchemaForm is rendered */
  validators: React.PropTypes.objectOf(React.PropTypes.func), /* may not exist until a SchemaForm is rendered */
}).isRequired;

export const mapperShape = React.PropTypes.objectOf(
  React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.func,
  ]),
);


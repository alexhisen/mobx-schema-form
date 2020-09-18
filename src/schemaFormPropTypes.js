import PropTypes from 'prop-types';

// Unfortunately eslint-plugin-react doesn't support validating against imported shapes:
// https://github.com/yannickcr/eslint-plugin-react/issues/817

export const formShape = PropTypes.shape({
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  type: PropTypes.string,
  title: PropTypes.string,
  /* either an array of values or array of objects with name and value and possibly group keys */
  titleMap: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      group: PropTypes.string,
    }),
  ])),
  placeholder: PropTypes.string,
  default: PropTypes.any,
  description: PropTypes.string,
  required: PropTypes.bool,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  condition: PropTypes.string,
  minlength: PropTypes.number, // Note that schema.minLength and maxLength are copied to
  maxlength: PropTypes.number, // formField.minlength and maxlength (lowercase!)
  minimum: PropTypes.number,
  maximum: PropTypes.number,
  items: PropTypes.array,
  schema: PropTypes.shape({
    type: PropTypes.string,
    default: PropTypes.any,
    enum: PropTypes.array,
    format: PropTypes.string,
    pattern: PropTypes.string,
    /* Non-standard - allows multiple form fields to map to same model key: */
    modelKey: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  }),
  /* The rest are non-SchemaForm-standard props */
  falseConditionValue: PropTypes.any,
  mobxCondition: PropTypes.string,
  requiredCondition: PropTypes.string,
  className: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.number,
  tickLabelsStep: PropTypes.number,
  tickLabelsFormat: PropTypes.func,
  props: PropTypes.object, /* props passed as-is to the React-Toolbox component */
  validations: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.string])),
  mask: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.any)]), // array is for future versions of React-Input-Mask
  maskProps: PropTypes.object, /* props passed as-is to the React-Input-Mask component */
}).isRequired;

export const modelShape = PropTypes.shape({
  data: PropTypes.object.isRequired,
  dataErrors: PropTypes.object.isRequired,
  saveNotification: PropTypes.shape({ active: PropTypes.bool.isRequired }),
  startEditing: PropTypes.func,
  stopEditing: PropTypes.func,
  getSavedData: PropTypes.func,
  status: PropTypes.shape({
    errors: PropTypes.array,
    isReady: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isInProgress: PropTypes.bool,
    canSave: PropTypes.bool,
    hasChanges: PropTypes.bool,
  }),
  fields: PropTypes.object, /* exists only while a SchemaForm is rendered */
  validators: PropTypes.objectOf(PropTypes.func), /* may not exist until a SchemaForm is rendered */
}).isRequired;

export const mapperShape = PropTypes.objectOf(
  PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
);


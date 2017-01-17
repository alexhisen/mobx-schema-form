import { utils } from 'react-schema-form';
import { action } from 'mobx';
import _ from 'lodash';
import ObjectPath from 'objectpath';

/**
 * Returns the modelKey (or key) as an array produced by ObjectPath.parse
 * or if asString is true as an underscore-joined string.
 * @param {Object} formField - formShape object
 * @param {Boolean} [asString]
 * @returns {Array|String|undefined}
 */
function getFieldKey(formField, asString = false) {
  if (!formField || !formField.key) {
    return undefined;
  }
  let key = (formField.schema && formField.schema.modelKey) || formField.key;
  if (typeof key === 'string') {
    key = ObjectPath.parse(key);
  }
  return asString && Array.isArray(key) ? key.join('_') : key;
}

/**
 * Check if there is a value on the model and return it.
 * Otherwise, check if there is a default value
 * Finally fall back to null
 * @param {Object} formField - formShape object
 * @param {Object} model - modelShape object
 */
function getFieldValue(formField, model) {
  let value = utils.selectOrSet(getFieldKey(formField), model.data);

  // check if there is a default value
  if (value === null || value === undefined) {
    if (formField.default !== undefined) {
      value = formField.default;
    } else if (formField.schema && formField.schema.default !== undefined) {
      value = formField.schema.default;
    } else if (formField.titleMap && formField.titleMap[0].value !== undefined) {
      value = formField.titleMap[0].value;
    }
  }

  return value === undefined ? null : value;
}

/**
 * If value is provided, updates model.data with it and validates the value
 * and returns the errorMessage string if any plus places it into model.dataErrors.
 * Validation is done using react-schema-form validate mechanism
 * with added validationMessage codes/templates strings handling like in the angular version of schema-form.
 * If value is undefined, just sets the corresponding model.dataErrors key to null.
 * null-valued string-type fields are also handled correctly, whereas react-schema-form only handles number-type nulls
 * @param {Object} formField - formShape object
 * @param {Object} model - modelShape object
 * @param {*} [value]
 * @returns {String|null}
 */
function validateField(formField, model, value) {
  let errorMessage = null;

  if (value !== undefined) {
    let validationValue = value;
    if (value === null && formField.schema && formField.schema.type.match(/string/)) {
      validationValue = undefined;
    }
    const validationResult = utils.validate(formField, validationValue);

    if (validationResult.error) {
      const errorCode = validationResult.error.code || 'default';

      if (formField.validationMessage) {
        const str = formField.validationMessage[errorCode] ||
          formField.validationMessage.default || formField.validationMessage;
        const template = _.template(str);
        errorMessage = template(formField);
      } else {
        errorMessage = validationResult.error.message;
      }
    }
  }

  action(() => {
    // update value
    if (value !== undefined) {
      utils.selectOrSet(
        getFieldKey(formField),
        model.data,
        value
      );
    }

    // update error
    utils.selectOrSet(
      getFieldKey(formField),
      model.dataErrors,
      errorMessage,
    );
  })();
  
  return errorMessage;
}
/**
 * Validates all the formfields in the fields object (and updates the model value with possible defaults)
 * @param {Object} fields - object with each key pointing to a formShape object
 * @param {Object} model - modelShape object
 * @param {Boolean} onlyWithValues - if true, skips validation on fields that have no value (i.e. undefined or null)
 *                                 - this is useful to only re-populate the model with defaults that get lost on a store refresh
 * @returns {Boolean}
 */
function validateForm(fields, model, onlyWithValues = false) {
  let isValid = true;

  if (fields) {
    Object.keys(fields).forEach((key) => {
      const formField = fields[key];
      const value = getFieldValue(formField, model);
      if (!onlyWithValues || (value !== undefined && value !== null)) {
        if (validateField(formField, model, value)) {
          isValid = false;
        }
      }
    });
  }

  return isValid;
}

/**
 * Validates all the fields in props.model.fields and if no validation errors, calls model.save()
 * @param {Object} model - modelShape object with save() method
 * @param {Object} [options] - passed to model.save() method
 * @param {Event} [e] - event object (i.e. from click or submit event)
 * @returns {Promise.<boolean>} true if form is valid and save() was called, false otherwise
 */
async function validateAndSave(model, options, e) {
  const isValid = validateForm(model.fields, model);

  if (isValid) {
    const button = e && e.target;
    if (button) button.disabled = true;

    await model.save(options);

    if (button) button.disabled = false;
  }

  return isValid;
}

export { getFieldKey, getFieldValue, validateField, validateForm, validateAndSave };

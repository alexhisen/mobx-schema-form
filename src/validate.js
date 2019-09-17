import utils from 'react-schema-form/lib/utils';
import { action } from 'mobx';
import template from 'lodash.template';
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
  const value = utils.selectOrSet(getFieldKey(formField), model.data);

  // check if there is a default value
  if (value === null || value === undefined) {
    if (formField.default !== undefined) {
      return formField.default;
    }
    if (formField.schema && formField.schema.default !== undefined) {
      return formField.schema.default;
    }
    if (!formField.titleMap && formField.schema && formField.schema.enum) {
      // react-schema-form only does this for select and checkboxes form field types, not for radios, etc.
      formField.titleMap = utils.enumToTitleMap(formField.schema.enum);
    }
    if (formField.titleMap && formField.titleMap[0].value !== undefined) {
      return formField.titleMap[0].value;
    }
    if (formField.titleMap && formField.titleMap[0] !== undefined) {
      return formField.titleMap[0];
    }
  }

  return value === undefined ? null : value;
}

/**
 * Takes a tv4-format error object and returns the string message
 * applying the formField.validationMessage templates as appropriate
 * @param {Object} validationError
 * @param {Number|String} [validationError.code]
 * @param {String} [validationError.message]
 * @param {Object} formField formShape object
 * @param {Object} model modelShape object
 * @param {*} value
 * @returns {String|null}
 */
function getValidationMessage(validationError, formField, model, value) {
  if (!validationError) {
    return null;
  }

  const errorCode = validationError.code || 'default';

  if (formField.validationMessage) {
    const context = {
      ...formField,
      code: errorCode,
      error: validationError,
      value,
      model,
    };
    const str = formField.validationMessage[errorCode] ||
      formField.validationMessage.default || formField.validationMessage;
    if (typeof str === 'object') {
      // validationMessage object has no default and no match for this code
      return validationError.message;
    }
    let templateFunc;
    if (typeof str === 'function') {
      templateFunc = str;
    } else {
      templateFunc = template(str);
      // cache the compiled function
      if (typeof formField.validationMessage === 'object') {
        formField.validationMessage[errorCode] = templateFunc;
      } else {
        formField.validationMessage = templateFunc;
      }
    }
    return templateFunc(context);
  }

  return validationError.message;
}

function runCustomValidations(formField, model, value) {
  if (!formField.validations || formField.validations.length === 0) {
    return null;
  }
  let validator;
  let result;
  for (let i = 0; i < formField.validations.length; i++) {
    validator = formField.validations[i];
    if (typeof validator === 'string') {
      validator = model.validators[validator];
    }
    if (typeof validator !== 'function') {
      throw new Error(`Undefined validator in ${formField.key}: ${formField.validations[i]}`);
    }
    result = validator(formField, model, value);
    if (result) {
      if (typeof result === 'object' && !result.code) {
        continue;
      }
      return result;
    }
  }
  return null;
}


/**
 * If value is provided, updates model.data with it and validates the value
 * and returns the errorMessage string if any plus places it into model.dataErrors.
 * Validation is done using react-schema-form validate mechanism
 * with added validationMessage codes/templates strings handling like in the angular version of schema-form
 * (null-valued number, string and object (i.e. date)-type fields regardless of form-type are also handled correctly),
 * plus with custom validations defined in the formField - see runCustomValidations().
 * If value is undefined, just sets the corresponding model.dataErrors key to null.
 * @param {Object} formField - formShape object
 * @param {Object} model - modelShape object
 * @param {*} [value]
 * @returns {String|null}
 */
function validateField(formField, model, value) {
  let errorMessage = null;

  if (value !== undefined) {
    let validationValue = value;
    if (value === null && formField.schema && formField.schema.type.match(/string|number|integer|object/)) {
      validationValue = undefined;
    }
    const validationResult = utils.validate(formField, validationValue);

    if (validationResult.error) {
      errorMessage = getValidationMessage(validationResult.error, formField, model, value);
    } else {
      const validationError = runCustomValidations(formField, model, value);
      if (validationError) {
        if (validationError.code) {
          errorMessage = getValidationMessage(validationError, formField, model, value);
        } else {
          errorMessage = validationError;
        }
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
 * Will set disabled DOM attribute on the event.target while saving, then clear it if event object is passed.
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

export { getFieldKey, getFieldValue, getValidationMessage, validateField, validateForm, validateAndSave };

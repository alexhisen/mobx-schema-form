'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAndSave = exports.validateForm = exports.validateField = exports.getFieldValue = exports.getFieldKey = undefined;

var _reactSchemaForm = require('react-schema-form');

var _mobx = require('mobx');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectpath = require('objectpath');

var _objectpath2 = _interopRequireDefault(_objectpath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Function.prototype.$asyncbind = function anonymous(self, catcher) {
  var resolver = this;

  if (catcher === true) {
    if (!Function.prototype.$asyncbind.EagerThenable) Function.prototype.$asyncbind.EagerThenable = function factory(tick) {
      var _tasks = [];

      if (!tick) {
        try {
          tick = process.nextTick;
        } catch (ex) {
          tick = function tick(p) {
            setTimeout(p, 0);
          };
        }
      }

      function _untask() {
        for (var i = 0; i < _tasks.length; i += 2) {
          var t = _tasks[i + 1],
              r = _tasks[i];

          for (var j = 0; j < t.length; j++) {
            t[j].call(null, r);
          }
        }

        _tasks = [];
      }

      function isThenable(obj) {
        return obj && obj instanceof Object && typeof obj.then === 'function';
      }

      function EagerThenable(resolver) {
        function done(inline) {
          var w;
          if (_sync || phase < 0 || (w = _thens[phase]).length === 0) return;

          _tasks.push(result, w);

          _thens = [[], []];
          if (_tasks.length === 2) inline ? _untask() : tick(_untask);
        }

        function resolveThen(x) {
          if (phase >= 0) return;
          if (isThenable(x)) return x.then(resolveThen, rejectThen);
          phase = 0;
          result = x;
          done(true);
        }

        function rejectThen(x) {
          if (phase >= 0) return;
          if (isThenable(x)) return x.then(resolveThen, rejectThen);
          phase = 1;
          result = x;
          done(true);
        }

        function settler(resolver, rejecter) {
          _thens[0].push(resolver);

          _thens[1].push(rejecter);

          done();
        }

        function toString() {
          return 'EagerThenable{' + {
            '-1': 'pending',
            0: 'resolved',
            1: 'rejected'
          }[phase] + '}=' + result.toString();
        }

        function guard() {
          try {
            resolver.call(null, resolveThen, rejectThen);
          } catch (ex) {
            rejectThen(ex);
          }
        }

        this.then = settler;
        this.toString = toString;
        var _thens = [[], []],
            _sync = true,
            phase = -1,
            result;
        guard();
        _sync = false;
        done();
      }

      EagerThenable.resolve = function (v) {
        return isThenable(v) ? v : {
          then: function then(resolve, reject) {
            return resolve(v);
          }
        };
      };

      return EagerThenable;
    }();
    return new Function.prototype.$asyncbind.EagerThenable(boundThen);
  }

  if (catcher) {
    if (Function.prototype.$asyncbind.wrapAsyncStack) catcher = Function.prototype.$asyncbind.wrapAsyncStack(catcher);
    return then;
  }

  function then(result, error) {
    try {
      return result && result instanceof Object && typeof result.then === 'function' ? result.then(then, catcher) : resolver.call(self, result, error || catcher);
    } catch (ex) {
      return (error || catcher)(ex);
    }
  }

  function boundThen(result, error) {
    return resolver.call(self, result, error);
  }

  boundThen.then = boundThen;
  return boundThen;
};

/**
 * Returns the modelKey (or key) as an array produced by ObjectPath.parse
 * or if asString is true as an underscore-joined string.
 * @param {Object} formField - formShape object
 * @param {Boolean} [asString]
 * @returns {Array|String|undefined}
 */
function getFieldKey(formField) {
  var asString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!formField || !formField.key) {
    return undefined;
  }
  var key = formField.schema && formField.schema.modelKey || formField.key;
  if (typeof key === 'string') {
    key = _objectpath2.default.parse(key);
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
  var value = _reactSchemaForm.utils.selectOrSet(getFieldKey(formField), model.data);

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
  var errorMessage = null;

  if (value !== undefined) {
    var validationValue = value;
    if (value === null && formField.schema && formField.schema.type.match(/string/)) {
      validationValue = undefined;
    }
    var validationResult = _reactSchemaForm.utils.validate(formField, validationValue);

    if (validationResult.error) {
      var errorCode = validationResult.error.code || 'default';

      if (formField.validationMessage) {
        var str = formField.validationMessage[errorCode] || formField.validationMessage.default || formField.validationMessage;
        var template = _lodash2.default.template(str);
        errorMessage = template(formField);
      } else {
        errorMessage = validationResult.error.message;
      }
    }
  }

  (0, _mobx.action)(function () {
    // update value
    if (value !== undefined) {
      _reactSchemaForm.utils.selectOrSet(getFieldKey(formField), model.data, value);
    }

    // update error
    _reactSchemaForm.utils.selectOrSet(getFieldKey(formField), model.dataErrors, errorMessage);
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
function validateForm(fields, model) {
  var onlyWithValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isValid = true;

  if (fields) {
    Object.keys(fields).forEach(function (key) {
      var formField = fields[key];
      var value = getFieldValue(formField, model);
      if (!onlyWithValues || value !== undefined && value !== null) {
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
function validateAndSave(model, options, e) {
  return new Promise(function ($return, $error) {
    var isValid, button;
    isValid = validateForm(model.fields, model);

    function $IfStatement_1() {

      return $return(isValid);
    }

    if (isValid) {
      button = e && e.target;

      if (button) button.disabled = true;

      return model.save(options).then(function ($await_2) {

        if (button) button.disabled = false;
        return $IfStatement_1.call(this);
      }.$asyncbind(this, $error), $error);
    }return $IfStatement_1.call(this);
  }.$asyncbind(this));
}

exports.getFieldKey = getFieldKey;
exports.getFieldValue = getFieldValue;
exports.validateField = validateField;
exports.validateForm = validateForm;
exports.validateAndSave = validateAndSave;
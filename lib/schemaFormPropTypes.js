'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapperShape = exports.modelShape = exports.formShape = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

// Unfortunately eslint-plugin-react doesn't support validating against imported shapes:
// https://github.com/yannickcr/eslint-plugin-react/issues/817

var formShape = exports.formShape = _propTypes2.default.shape({
  key: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
  type: _propTypes2.default.string,
  title: _propTypes2.default.string,
  /* either an array of values or array of objects with name and value and possibly group keys */
  titleMap: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.any, _propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    value: _propTypes2.default.any.isRequired,
    group: _propTypes2.default.string
  })])),
  placeholder: _propTypes2.default.string,
  default: _propTypes2.default.any,
  description: _propTypes2.default.string,
  required: _propTypes2.default.bool,
  validationMessage: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  condition: _propTypes2.default.string,
  minlength: _propTypes2.default.number, // Note that schema.minLength and maxLength are copied to
  maxlength: _propTypes2.default.number, // formField.minlength and maxlength (lowercase!)
  minimum: _propTypes2.default.number,
  maximum: _propTypes2.default.number,
  items: _propTypes2.default.array,
  schema: _propTypes2.default.shape({
    type: _propTypes2.default.string,
    default: _propTypes2.default.any,
    enum: _propTypes2.default.array,
    format: _propTypes2.default.string,
    pattern: _propTypes2.default.string,
    /* Non-standard - allows multiple form fields to map to same model key: */
    modelKey: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.string])
  }),
  /* The rest are non-SchemaForm-standard props */
  falseConditionValue: _propTypes2.default.any,
  mobxCondition: _propTypes2.default.string, /* only used in FieldSet right now for a mobx-reactive condition */
  className: _propTypes2.default.string,
  min: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  max: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  step: _propTypes2.default.number,
  tickLabelsStep: _propTypes2.default.number,
  tickLabelsFormat: _propTypes2.default.func,
  props: _propTypes2.default.object, /* props passed as-is to the React-Toolbox component */
  validations: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]))
}).isRequired;

var modelShape = exports.modelShape = _propTypes2.default.shape({
  data: _propTypes2.default.object.isRequired,
  dataErrors: _propTypes2.default.object.isRequired,
  saveNotification: _propTypes2.default.shape({ active: _propTypes2.default.bool.isRequired }),
  startEditing: _propTypes2.default.func,
  stopEditing: _propTypes2.default.func,
  getSavedData: _propTypes2.default.func,
  status: _propTypes2.default.shape({
    errors: _propTypes2.default.array,
    isReady: _propTypes2.default.bool,
    isReadOnly: _propTypes2.default.bool,
    isInProgress: _propTypes2.default.bool,
    canSave: _propTypes2.default.bool,
    hasChanges: _propTypes2.default.bool
  }),
  fields: _propTypes2.default.object, /* exists only while a SchemaForm is rendered */
  validators: _propTypes2.default.objectOf(_propTypes2.default.func) /* may not exist until a SchemaForm is rendered */
}).isRequired;

var mapperShape = exports.mapperShape = _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]));
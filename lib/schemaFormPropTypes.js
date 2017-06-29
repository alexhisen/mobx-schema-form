'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapperShape = exports.modelShape = exports.formShape = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var formShape = exports.formShape = _react2.default.PropTypes.shape({
  key: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.array]),
  type: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  /* either an array of values or array of objects with name and value and possibly group keys */
  titleMap: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.any, _react2.default.PropTypes.shape({
    name: _react2.default.PropTypes.string.isRequired,
    value: _react2.default.PropTypes.any.isRequired,
    group: _react2.default.PropTypes.string
  })])),
  placeholder: _react2.default.PropTypes.string,
  default: _react2.default.PropTypes.any,
  description: _react2.default.PropTypes.string,
  required: _react2.default.PropTypes.bool,
  validationMessage: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.object]),
  condition: _react2.default.PropTypes.string,
  minlength: _react2.default.PropTypes.number, // Note that schema.minLength and maxLength are copied to
  maxlength: _react2.default.PropTypes.number, // formField.minlength and maxlength (lowercase!)
  minimum: _react2.default.PropTypes.number,
  maximum: _react2.default.PropTypes.number,
  items: _react2.default.PropTypes.array,
  schema: _react2.default.PropTypes.shape({
    type: _react2.default.PropTypes.string,
    default: _react2.default.PropTypes.any,
    enum: _react2.default.PropTypes.array,
    format: _react2.default.PropTypes.string,
    pattern: _react2.default.PropTypes.string,
    /* Non-standard - allows multiple form fields to map to same model key: */
    modelKey: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.string])
  }),
  /* The rest are non-SchemaForm-standard props */
  mobxCondition: _react2.default.PropTypes.string, /* only used in FieldSet right now for a mobx-reactive condition */
  className: _react2.default.PropTypes.string,
  min: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
  max: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
  step: _react2.default.PropTypes.number,
  tickLabelsStep: _react2.default.PropTypes.number,
  tickLabelsFormat: _react2.default.PropTypes.func,
  props: _react2.default.PropTypes.object, /* props passed as-is to the React-Toolbox component */
  validations: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string]))
}).isRequired;

var modelShape = exports.modelShape = _react2.default.PropTypes.shape({
  data: _react2.default.PropTypes.object.isRequired,
  dataErrors: _react2.default.PropTypes.object.isRequired,
  saveNotification: _react2.default.PropTypes.shape({ active: _react2.default.PropTypes.bool.isRequired }),
  startEditing: _react2.default.PropTypes.func,
  stopEditing: _react2.default.PropTypes.func,
  getSavedData: _react2.default.PropTypes.func,
  status: _react2.default.PropTypes.shape({
    errors: _react2.default.PropTypes.array,
    isReady: _react2.default.PropTypes.bool,
    isReadOnly: _react2.default.PropTypes.bool,
    isInProgress: _react2.default.PropTypes.bool,
    canSave: _react2.default.PropTypes.bool,
    hasChanges: _react2.default.PropTypes.bool
  }),
  fields: _react2.default.PropTypes.object, /* exists only while a SchemaForm is rendered */
  validators: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.func) /* may not exist until a SchemaForm is rendered */
}).isRequired;

var mapperShape = exports.mapperShape = _react2.default.PropTypes.objectOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.func]));
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldWrapper = exports.asSchemaField = exports.mapperShape = exports.formShape = exports.modelShape = exports.validateAndSave = exports.validateForm = exports.validateField = exports.getFieldValue = exports.getFieldKey = exports.MobxSchemaForm = undefined;

var _validate = require('./validate');

Object.defineProperty(exports, 'getFieldKey', {
  enumerable: true,
  get: function get() {
    return _validate.getFieldKey;
  }
});
Object.defineProperty(exports, 'getFieldValue', {
  enumerable: true,
  get: function get() {
    return _validate.getFieldValue;
  }
});
Object.defineProperty(exports, 'validateField', {
  enumerable: true,
  get: function get() {
    return _validate.validateField;
  }
});
Object.defineProperty(exports, 'validateForm', {
  enumerable: true,
  get: function get() {
    return _validate.validateForm;
  }
});
Object.defineProperty(exports, 'validateAndSave', {
  enumerable: true,
  get: function get() {
    return _validate.validateAndSave;
  }
});

var _schemaFormPropTypes = require('./schemaFormPropTypes');

Object.defineProperty(exports, 'modelShape', {
  enumerable: true,
  get: function get() {
    return _schemaFormPropTypes.modelShape;
  }
});
Object.defineProperty(exports, 'formShape', {
  enumerable: true,
  get: function get() {
    return _schemaFormPropTypes.formShape;
  }
});
Object.defineProperty(exports, 'mapperShape', {
  enumerable: true,
  get: function get() {
    return _schemaFormPropTypes.mapperShape;
  }
});

var _MobxSchemaForm2 = require('./MobxSchemaForm');

var _MobxSchemaForm3 = _interopRequireDefault(_MobxSchemaForm2);

var _asSchemaField2 = require('./asSchemaField');

var _asSchemaField3 = _interopRequireDefault(_asSchemaField2);

var _FieldWrapper2 = require('./FieldWrapper');

var _FieldWrapper3 = _interopRequireDefault(_FieldWrapper2);

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

exports.MobxSchemaForm = _MobxSchemaForm3.default;
// export * loses auto-completion after transpilation, so specify each export explicitly

exports.asSchemaField = _asSchemaField3.default;
exports.FieldWrapper = _FieldWrapper3.default;
// We do not export this to allow React-Toolbox to be optional: export SaveButton from './SaveButton';
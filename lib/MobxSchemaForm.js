'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _schemaFormPropTypes = require('./schemaFormPropTypes');

var _SchemaForm = require('./SchemaForm');

var _SchemaForm2 = _interopRequireDefault(_SchemaForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
}; /*
    * Syntax-compatible equivalent to react-schema-form SchemaForm (except onModelChange is not required)
    * that uses a Mobx FormStore model and React-Toolbox form widgets
    */


var MobxSchemaForm = function (_React$Component) {
  _inherits(MobxSchemaForm, _React$Component);

  function MobxSchemaForm() {
    _classCallCheck(this, MobxSchemaForm);

    return _possibleConstructorReturn(this, (MobxSchemaForm.__proto__ || Object.getPrototypeOf(MobxSchemaForm)).apply(this, arguments));
  }

  _createClass(MobxSchemaForm, [{
    key: 'render',
    value: function render() {
      var mapper = void 0;
      if (this.props.mergeMapper === false) {
        mapper = this.props.mapper;
      } else {
        /* eslint-disable global-require */
        var TextField = require('./TextField');
        var DateField = require('./DateField');
        var CheckboxField = require('./CheckboxField');
        var SwitchField = require('./SwitchField');
        var RadiosField = require('./RadiosField');
        var Fieldset = require('./Fieldset');
        var DropdownField = require('./DropdownField');
        var BoolLink = require('./BoolLink');
        var SliderField = require('./SliderField');
        var Help = require('./Help');
        /* eslint-enable */

        // mapper is used to map types in form object, not schema object
        mapper = _extends({
          date: DateField,
          text: TextField,
          email: TextField,
          password: TextField,
          number: TextField,
          tel: TextField,
          textarea: TextField,
          checkbox: CheckboxField,
          switch: SwitchField,
          radios: RadiosField,
          fieldset: Fieldset,
          select: DropdownField,
          link: BoolLink,
          range: SliderField,
          help: Help
        }, this.props.mapper);
      }

      return _react2.default.createElement(_SchemaForm2.default, _extends({}, this.props, { mapper: mapper }));
    }
  }]);

  return MobxSchemaForm;
}(_react2.default.Component);

MobxSchemaForm.propTypes = {
  className: _propTypes2.default.string,
  mapper: _schemaFormPropTypes.mapperShape,
  model: _schemaFormPropTypes.modelShape,
  schema: _propTypes2.default.shape({
    type: _propTypes2.default.string,
    title: _propTypes2.default.string,
    properties: _propTypes2.default.object.isRequired, /* each key has the schema portion of formShape */
    required: _propTypes2.default.array
  }),
  /* actually a subset of formShape, no schema and some properties in formShape are copied from schema */
  form: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _schemaFormPropTypes.formShape])),
  options: _propTypes2.default.shape({
    suppressPropertyTitles: _propTypes2.default.bool,
    /* actually a subset of formShape, no schema and some properties in formShape are copied from schema */
    formDefaults: _schemaFormPropTypes.formShape,
    validators: _propTypes2.default.objectOf(_propTypes2.default.func)
  }),
  /* @deprecated For compatibility with react-schema-form */
  option: _propTypes2.default.shape({
    supressPropertyTitles: _propTypes2.default.bool, /* yes, they have it misspelled like that - we convert to their spelling */
    formDefaults: _schemaFormPropTypes.formShape,
    validators: _propTypes2.default.objectOf(_propTypes2.default.func)
  }),
  ignore: _propTypes2.default.objectOf(_propTypes2.default.bool), // list of paths in schema to ignore (sans root level name)
  onModelChange: _propTypes2.default.func,
  mergeMapper: _propTypes2.default.bool,
  asArray: _propTypes2.default.bool
};

exports.default = MobxSchemaForm;
module.exports = exports['default'];
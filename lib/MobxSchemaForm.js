'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSchemaForm = require('react-schema-form');

var _mobxReact = require('mobx-react');

var _validate = require('./validate');

var _schemaFormPropTypes = require('./schemaFormPropTypes');

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
    * Syntax-compatible wrapper to react-schema-form SchemaForm (except onModelChange is not required)
    * that uses a Mobx FormStore model and React-Toolbox form widgets
    */


var MobxSchemaForm = (0, _mobxReact.observer)(_class = function (_React$Component) {
  _inherits(MobxSchemaForm, _React$Component);

  function MobxSchemaForm() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MobxSchemaForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MobxSchemaForm.__proto__ || Object.getPrototypeOf(MobxSchemaForm)).call.apply(_ref, [this].concat(args))), _this), _this.onModelChange = function (formField, value) {
      var asString = true;
      var key = (0, _validate.getFieldKey)(formField, asString);
      if (!key) {
        _this.props.onModelChange && _this.props.onModelChange(formField, value);
        return;
      }

      _this.props.onModelChange && _this.props.onModelChange(key, value);

      // since we unmount first before children unmount, must check if fields still exists
      if (!_this.props.model.fields) return;
      if (value === undefined) {
        // field has been removed from form
        delete _this.props.model.fields[key];
      } else {
        _this.props.model.fields[key] = formField;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MobxSchemaForm, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.model.fields = {};

      var options = this.props.options || this.props.option;
      if (options && options.validators) {
        // merge to allow different instances of MobxSchemaForm to maintain their own validators in the store
        this.props.model.validators = Object.assign(this.props.model.validators || {}, options.validators);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      delete this.props.model.fields;
    }
  }, {
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
          range: SliderField
        }, this.props.mapper);
      }

      return _react2.default.createElement(_reactSchemaForm.SchemaForm, {
        mapper: mapper,
        schema: this.props.schema,
        form: this.props.form,
        model: this.props.model,
        onModelChange: this.onModelChange,
        option: this.props.options || this.props.option
      });
    }
  }]);

  return MobxSchemaForm;
}(_react2.default.Component)) || _class;

MobxSchemaForm.propTypes = {
  mapper: _schemaFormPropTypes.mapperShape,
  model: _schemaFormPropTypes.modelShape,
  schema: _react2.default.PropTypes.shape({
    type: _react2.default.PropTypes.string,
    title: _react2.default.PropTypes.string,
    properties: _react2.default.PropTypes.object.isRequired, /* each key has the schema portion of formShape */
    required: _react2.default.PropTypes.array
  }),
  /* actually a subset of formShape, no schema and some properties in formShape are copied from schema */
  form: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _schemaFormPropTypes.formShape])),
  options: _react2.default.PropTypes.shape({
    suppressPropertyTitles: _react2.default.PropTypes.bool,
    /* actually a subset of formShape, no schema and some properties in formShape are copied from schema */
    formDefaults: _schemaFormPropTypes.formShape,
    validators: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.func)
  }),
  /* @deprecated For compatibility with react-schema-form */
  option: _react2.default.PropTypes.shape({
    suppressPropertyTitles: _react2.default.PropTypes.bool,
    formDefaults: _schemaFormPropTypes.formShape,
    validators: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.func)
  }),
  onModelChange: _react2.default.PropTypes.func,
  mergeMapper: _react2.default.PropTypes.bool
};

exports.default = MobxSchemaForm;
module.exports = exports['default'];
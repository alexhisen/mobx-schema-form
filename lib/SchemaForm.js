'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('react-schema-form/lib/utils');

var _utils2 = _interopRequireDefault(_utils);

var _mobx = require('mobx');

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
    * Syntax-compatible equivalent to react-schema-form SchemaForm (except onModelChange is not required)
    * that uses a Mobx FormStore model. IMPORTANT: mapper is required with mapping of widgets.
    * Typically the mapper with React-Toolbox-based widgets is provided by MobxSchemaForm,
    * but you can use this lower-level component directly with your own widgets to
    * bypass the importing of react-toolbox.
    */


var SchemaForm = (0, _mobxReact.observer)(_class = function (_React$Component) {
  _inherits(SchemaForm, _React$Component);

  function SchemaForm() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SchemaForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SchemaForm.__proto__ || Object.getPrototypeOf(SchemaForm)).call.apply(_ref, [this].concat(args))), _this), _this.onModelChange = function (formField, value) {
      var model = _this.props.model; // this variable name is required for evaling form.condition.
      var asString = true;
      var key = (0, _validate.getFieldKey)(formField, asString);
      if (!key) {
        _this.props.onModelChange && _this.props.onModelChange(formField, value);
        return;
      }

      _this.props.onModelChange && _this.props.onModelChange(key, value);

      // since we unmount first before children unmount, must check if fields still exists
      if (_this.unmounting) {
        delete model.fields[key];
        return;
      }

      if (value === undefined) {
        // field has been removed from form
        var form = formField; // this variable name is required for evaling form.condition.
        /* eslint-disable no-eval */
        if (form.falseConditionValue !== undefined && form.condition && eval(form.condition) === false) {
          (0, _mobx.action)(function () {
            var fieldKey = (0, _validate.getFieldKey)(form);
            _utils2.default.selectOrSet(fieldKey, model.data, form.falseConditionValue);
            _utils2.default.selectOrSet(fieldKey, model.dataErrors, null);
          })();
        }
        /* eslint-enable */
        delete model.fields[key];
      } else {
        model.fields[key] = formField;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SchemaForm, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.model.fields = this.props.model.fields || {};

      var options = this.props.options || this.props.option;
      if (options && options.validators) {
        // merge to allow different instances of MobxSchemaForm to maintain their own validators in the store
        this.props.model.validators = Object.assign(this.props.model.validators || {}, options.validators);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unmounting = true;
    }
  }, {
    key: 'builder',


    // IMPORTANT: form and model variable names must not be changed to not break form.condition evals
    value: function builder(form, model, index, onChange, mapper) {
      var asString = true;
      var key = (0, _validate.getFieldKey)(form, asString);
      var Field = mapper[form.type];
      if (!Field) {
        console.warn('Skipping field - unmapped type: \'' + form.type + '\' in ' + (key || 'field ' + index)); // eslint-disable-line no-console
        return null;
      }
      /* eslint-disable no-eval */
      if (form.condition && eval(form.condition) === false) {
        return null;
      }
      /* eslint-enable */
      return _react2.default.createElement(Field, { model: model, form: form, key: key || index, onChange: onChange, mapper: mapper, builder: this.builder });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var mapper = this.props.mapper;
      var options = this.props.options || this.props.option;
      if (options) {
        // change from correct spelling to theirs
        if (options.supressPropertyTitles === undefined) {
          options.supressPropertyTitles = options.suppressPropertyTitles;
        }
      }
      var merged = _utils2.default.merge(this.props.schema, this.props.form, this.props.ignore, options);
      // console.log('SchemaForm merged = ', JSON.stringify(merged, undefined, 2));

      var fields = merged.map(function (form, index) {
        return _this2.builder(form, _this2.props.model, index, _this2.onModelChange, mapper);
      }).filter(function (f) {
        return f;
      });

      var child = this.props.children && _react2.default.cloneElement(_react2.default.Children.only(this.props.children), { children: fields });

      if (this.props.asArray) {
        return child || fields;
      }

      return _react2.default.createElement(
        'div',
        { style: { width: '100%' }, className: this.props.className },
        child || fields
      );
    }
  }]);

  return SchemaForm;
}(_react2.default.Component)) || _class;

SchemaForm.defaultProps = {
  className: 'SchemaForm'
};

SchemaForm.propTypes = {
  className: _propTypes2.default.string,
  mapper: _schemaFormPropTypes.mapperShape.isRequired,
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
  asArray: _propTypes2.default.bool,
  children: _propTypes2.default.element
};

exports.default = SchemaForm;
module.exports = exports['default'];
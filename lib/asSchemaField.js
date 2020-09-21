'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('react-schema-form/lib/utils');

var _utils2 = _interopRequireDefault(_utils);

var _mobxReact = require('mobx-react');

var _mobx = require('mobx');

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
};

var asSchemaField = function asSchemaField(ComposedComponent, fieldType) {
  var _class, _temp;

  return (0, _mobxReact.observer)((_temp = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.onChangeValidate = function (val, e) {
        var event = e || val;
        var value = val && val.target ? val.target.value : val;

        if (event && event.type === 'focus') {
          // react-input-mask calls onChange before the focus event completes.
          // this will set beingEdited to true and avoid premature validation:
          _this.onFocus();
        }

        if (_this.props.form.schema && _this.props.form.schema.type.match(/integer|number/) && typeof value !== 'number') {
          var strict = event && event.type === 'blur';
          if (!value || strict) {
            if (_this.state.valueAsString) {
              // clear any temporary string representation
              _this.setState({ valueAsString: '' });
            }
          }
          if (value) {
            // TODO: Support commas as decimal separator based on locale?
            // strip all extraneous characters:
            var valueAsString = value.replace(/[^0-9.-]/g, '');
            if (!strict && valueAsString === '-') {
              // User just started typing a negative number
              _this.setState({ valueAsString: valueAsString });
              return;
            }
            var hasDecimal = valueAsString.indexOf('.') !== -1;
            if (hasDecimal && _this.props.form.schema.type.match(/integer/)) {
              // reject the decimal, don't update value
              return;
            }
            if (!hasDecimal) {
              value = parseInt(valueAsString, 10);
            } else {
              if (!strict && (valueAsString === '.' || valueAsString === '-.')) {
                // User just started typing without a leading 0
                _this.setState({ valueAsString: valueAsString });
                return;
              }
              value = parseFloat(valueAsString);
            }
            if (isNaN(value)) {
              // after stripping, there is nothing left, so reject invalid character, don't update value
              return;
            }
            if (!strict) {
              // Update the string representation so it can be rendered for user input like 1. and 1.0
              _this.setState({ valueAsString: valueAsString });
            }
          }
        } else if (event && event.target && _this.props.form.schema && _this.props.form.schema.type === 'boolean') {
          value = event.target.checked;
        }

        if (_this.props.form.schema && _this.props.form.schema.type === 'boolean' && value !== null && typeof value !== 'boolean') {
          value = value && value.toLowerCase && value.toLowerCase();
          if (value === 0 || value === -0 || value === '0' || value === 'f' || value === 'false' || value === 'off' || value === 'no' || value === 'n') {
            value = false;
            // value !== value is a NaN check that doesn't give true for a string
          } else if (value === null || value !== value || value === '' || value === undefined) {
            // eslint-disable-line no-self-compare
            value = null;
          } else {
            value = true;
          }
        }

        if (value === undefined) value = null;

        var hasError = !!_this.getError();

        if (_this.beingEdited && !hasError && !_this.valueEntered && _this.props.form.type.match(/text|textarea|email|tel|number|password/i)) {
          (0, _mobx.action)(function () {
            _utils2.default.selectOrSet(_this.getKey(), _this.props.model.data, value);
            _this.props.onChange(_this.props.form, value);
          })();
        } else {
          (0, _mobx.action)(function () {
            // update value and error if any
            (0, _validate.validateField)(_this.props.form, _this.props.model, value);

            _this.props.onChange(_this.props.form, value);
          })();
        }
      };

      _this.onFocus = function () {
        _this.props.model.startEditing && _this.props.model.startEditing(_this.getKey());
        _this.beingEdited = true;
        _this.initialValue = _this.getValue();
      };

      _this.onBlur = function (e) {
        if (_this.props.form.type.match(/text|textarea|email|tel|number|password/i)) {
          var value = e && e.target ? e.target.value : e;

          // if user deletes a previous value or there was a previous error, also run validation
          var hasError = !!_this.getError();
          if (value || _this.initialValue || hasError) {
            var trimmed = value.trim();

            if (value !== trimmed || !_this.valueEntered || _this.initialValue || hasError || _this.state.valueAsString) {
              _this.valueEntered = true; // this must be true for validateField() to actually be called
              _this.onChangeValidate(trimmed, e);
              _this.valueEntered = !!trimmed; // if value was cleared, resets behavior for next time
            }
          }
        }

        _this.props.model.stopEditing && _this.props.model.stopEditing();
        _this.beingEdited = false;
      };

      _this.getKey = function () {
        return (0, _validate.getFieldKey)(_this.props.form);
      };

      _this.getValue = function () {
        return _this.state.valueAsString || (0, _validate.getFieldValue)(_this.props.form, _this.props.model);
      };

      _this.getError = function () {
        return _utils2.default.selectOrSet(_this.getKey(), _this.props.model.dataErrors);
      };

      _this.beingEdited = false;
      _this.valueEntered = false;
      _this.initialValue = null;

      _this.state = {
        valueAsString: ''
      };
      return _this;
    }

    _createClass(_class, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        // update value in the model to a possible schema default
        // and validate it
        (0, _mobx.action)(function () {
          var value = _this2.getValue();
          if (value !== undefined && value !== null) {
            (0, _validate.validateField)(_this2.props.form, _this2.props.model, value);
          }
          _this2.props.onChange(_this2.props.form, value);
        })();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _this3 = this;

        var hasError = !!this.getError();
        if (hasError && this.props.model.getSavedData) {
          // reset the field to known good value and clear the validation error on the field
          (0, _mobx.action)(function () {
            var key = _this3.getKey();
            var value = _utils2.default.selectOrSet(key, _this3.props.model.getSavedData());
            _utils2.default.selectOrSet(key, _this3.props.model.data, value);
            _utils2.default.selectOrSet(key, _this3.props.model.dataErrors, null);
            _this3.props.onChange(_this3.props.form);
          })();
          return;
        }

        this.props.onChange(this.props.form);
      }

      /**
       * Called when <input> value changes.
       * Supports regular React events and React-Toolbox callbacks (value as first argument, event object as second)
       * @param {Event|String|Number|Date|Array} val - The new value of input.
       * @param {Event} [e] - Event object for React-Toolbox widgets and from onBlur event
       */


      /**
       * Called when component is in focus (being edited)
       */


      /**
       * Called when component goes out of focus (finished being edited)
       */

    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            form = _props.form,
            model = _props.model,
            mapper = _props.mapper;

        if (form.mobxCondition && eval(form.mobxCondition) === false) {
          // eslint-disable-line no-eval
          return null;
        }

        var value = this.getValue();

        var error = this.getError();
        if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object') {
          // Convert server-returned error object in tv4 format to proper validationMessage string:
          error = (0, _validate.getValidationMessage)(error, form, model, value);
        }

        var readOnly = !!(model.status && model.status.isReadOnly) || form.readOnly;

        var composedComponent = _react2.default.createElement(ComposedComponent, {
          name: form.key.join('.'),
          required: form.required,
          formField: form,
          value: value,
          error: error,
          disabled: readOnly,
          readOnly: readOnly,
          onChange: this.onChangeValidate,
          onFocus: this.onFocus,
          onBlur: this.onBlur
        });

        if (mapper.fieldWrapper) {
          var FieldWrapper = mapper.fieldWrapper;
          return _react2.default.createElement(
            FieldWrapper,
            { formField: form, fieldType: fieldType, hasError: !!error, className: form.className },
            composedComponent
          );
        }

        return composedComponent;
      }
    }]);

    return _class;
  }(_react2.default.Component), _class.propTypes = {
    form: _schemaFormPropTypes.formShape,
    model: _schemaFormPropTypes.modelShape,
    onChange: _propTypes2.default.func,
    mapper: _schemaFormPropTypes.mapperShape
    /* Not used:
    builder: PropTypes.func,
    */
  }, _class.displayName = 'SchemaField', _temp));
};

exports.default = asSchemaField;
module.exports = exports['default'];
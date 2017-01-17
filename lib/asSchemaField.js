'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSchemaForm = require('react-schema-form');

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

      _this.onChangeValidate = function (val) {
        var value = val && val.target ? val.target.value : val;

        if (value && _this.props.form.schema && _this.props.form.schema.type.match(/integer|number/) && typeof value !== 'number') {
          if (value.indexOf('.') === -1) {
            value = parseInt(value, 10);
          } else {
            value = parseFloat(value);
          }
        }

        if (value === undefined) value = null;

        var hasError = !!_reactSchemaForm.utils.selectOrSet(_this.getKey(), _this.props.model.dataErrors);

        if (_this.state.beingEdited && !hasError && !_this.state.valueEntered && _this.props.form.type.match(/text|email|tel|password/i)) {
          (0, _mobx.action)(function () {
            _reactSchemaForm.utils.selectOrSet(_this.getKey(), _this.props.model.data, value);
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
        _this.props.model.startEditing(_this.getKey());
        _this.state.beingEdited = true;
        _this.state.initialValue = _this.getValue();
      };

      _this.onBlur = function (e) {
        if (_this.props.form.type.match(/text|email|tel|password/i)) {
          var value = e && e.target ? e.target.value : e;

          // if user deletes a previous value, also run validation
          if (value || _this.state.initialValue) {
            var trimmed = value.trim();

            if (value !== trimmed || !_this.state.valueEntered || _this.state.initialValue) {
              _this.state.valueEntered = true;
              _this.onChangeValidate(trimmed);
            }
          }
        }

        _this.props.model.stopEditing();
        _this.state.beingEdited = false;
      };

      _this.getKey = function () {
        return (0, _validate.getFieldKey)(_this.props.form);
      };

      _this.getValue = function () {
        return (0, _validate.getFieldValue)(_this.props.form, _this.props.model);
      };

      _this.state = {
        beingEdited: false,
        valueEntered: false,
        initialValue: null
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

        // clear the validation error on the field if any
        (0, _mobx.action)(function () {
          (0, _validate.validateField)(_this3.props.form, _this3.props.model);
          _this3.props.onChange(_this3.props.form);
        })();
      }

      /**
       * Called when <input> value changes.
       * Supports regular React events and React-toolbox callbacks (value as first argument, event object as second)
       * @param {Event|String|Number|Date|Array} val - The new value of input.
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
        var error = _reactSchemaForm.utils.selectOrSet(this.getKey(), this.props.model.dataErrors);
        var composedComponent = _react2.default.createElement(ComposedComponent, {
          name: this.props.form.key.join('.'),
          required: this.props.form.required,
          formField: this.props.form,
          value: this.getValue(),
          error: error,
          disabled: this.props.model.status.isReadOnly,
          readOnly: this.props.model.status.isReadOnly,
          onChange: this.onChangeValidate,
          onFocus: this.onFocus,
          onBlur: this.onBlur
        });

        if (this.props.mapper.fieldWrapper) {
          var FieldWrapper = this.props.mapper.fieldWrapper;
          return _react2.default.createElement(
            FieldWrapper,
            { formField: this.props.form, fieldType: fieldType, hasError: !!error },
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
    onChange: _react2.default.PropTypes.func,
    mapper: _schemaFormPropTypes.mapperShape
  }, _class.displayName = 'SchemaField', _temp));
};

exports.default = asSchemaField;
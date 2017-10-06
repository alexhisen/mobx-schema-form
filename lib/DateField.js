'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2, _initialiseProps;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _date_picker = require('react-toolbox/lib/date_picker');

var _date_picker2 = _interopRequireDefault(_date_picker);

var _sugar = require('sugar');

var _hammerjs = require('hammerjs');

var _hammerjs2 = _interopRequireDefault(_hammerjs);

var _asSchemaField = require('./asSchemaField');

var _asSchemaField2 = _interopRequireDefault(_asSchemaField);

var _schemaFormPropTypes = require('./schemaFormPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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

// TODO: Once onActiveChange is implemented in DatePicker
// (https://github.com/react-toolbox/react-toolbox/pull/1382)
// all the onFocus, onClick, onDismiss and onChange handlers can be removed
var DateField = (_temp2 = _class = function (_React$Component) {
  _inherits(DateField, _React$Component);

  function DateField() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DateField);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DateField.__proto__ || Object.getPrototypeOf(DateField)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DateField, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.disableSwipe();
    }

    // TEMP Workaround for React-Toolbox DatePicker not actually exposing the onFocus event.


    // Note that in non-production React 15.x on a desktop browser, button will get clicked twice
    // (see https://github.com/facebook/react/issues/8559).

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          formField = _props.formField,
          readOnly = _props.readOnly,
          onChange = _props.onChange,
          onFocus = _props.onFocus,
          onBlur = _props.onBlur,
          others = _objectWithoutProperties(_props, ['formField', 'readOnly', 'onChange', 'onFocus', 'onBlur']); // eslint-disable-line no-unused-vars


      var minDate = formField.min ? _sugar.Date.create(formField.min) : null;
      var maxDate = formField.max ? _sugar.Date.create(formField.max) : null;

      return _react2.default.createElement(
        'div',
        { ref: this.onRender },
        _react2.default.createElement(_date_picker2.default, _extends({}, others, {
          onFocus: this.onFocus,
          onClick: this.onClick,
          onDismiss: this.onDismiss,
          onChange: this.onChange,
          readonly: readOnly,
          autoOk: true,
          label: formField.description,
          placeholder: formField.placeholder,
          inputFormat: function inputFormat(value) {
            return value.toLocaleDateString();
          },
          minDate: minDate,
          maxDate: maxDate
        }, formField.props))
      );
    }
  }]);

  return DateField;
}(_react2.default.Component), _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onRender = function (el) {
    if (el) {
      var input = el.getElementsByTagName('input')[0];
      if (input) {
        input.removeEventListener('focusin', _this2.onFocus);
        input.addEventListener('focusin', _this2.onFocus, false);
      }
    }
  };

  this.onFocus = function () {
    _this2.onActiveChange(true);
  };

  this.onClick = function () {
    _this2.onActiveChange(true);
  };

  this.onDismiss = function () {
    _this2.onActiveChange(false);
  };

  this.onChange = function () {
    var _props2;

    _this2.onActiveChange(false);
    (_props2 = _this2.props).onChange.apply(_props2, arguments);
  };

  this.enableSwipe = function () {
    _this2.disableSwipe();
    _this2.hammerManager = new _hammerjs2.default.Manager(document.body, {
      recognizers: [[_hammerjs2.default.Swipe, { direction: _hammerjs2.default.DIRECTION_HORIZONTAL }]]
    });
    _this2.hammerManager.on('swipe', _this2.onSwipe);
  };

  this.disableSwipe = function () {
    _this2.hammerManager && _this2.hammerManager.destroy();
  };

  this.onSwipe = function (e) {
    switch (e.direction) {
      case _hammerjs2.default.DIRECTION_LEFT:
        {
          var button = document.querySelector('[data-react-toolbox=calendar] button#right');
          if (button) {
            button.click();
          }
          break;
        }
      case _hammerjs2.default.DIRECTION_RIGHT:
        {
          var _button = document.querySelector('[data-react-toolbox=calendar] button#left');
          if (_button) {
            _button.click();
          }
          break;
        }
    }
  };

  this.onActiveChange = function (active) {
    if (active) {
      // work-around for iOS Safari bug where cursor would blink over the datepicker:
      document.activeElement && document.activeElement.blur();

      _this2.enableSwipe();
      _this2.props.onFocus();
    } else {
      _this2.disableSwipe();
      _this2.props.onBlur();
    }
  };
}, _temp2);


DateField.propTypes = {
  formField: _schemaFormPropTypes.formShape,
  readOnly: _propTypes2.default.bool,
  onChange: _react2.default.PropTypes.func,
  onFocus: _react2.default.PropTypes.func,
  onBlur: _react2.default.PropTypes.func
};

exports.default = (0, _asSchemaField2.default)(DateField, 'datepicker');
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _button = require('react-toolbox/lib/button');

var _button2 = _interopRequireDefault(_button);

var _validate = require('./validate');

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

var SaveButton = (0, _mobxReact.observer)(_class = function (_React$Component) {
  _inherits(SaveButton, _React$Component);

  function SaveButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SaveButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SaveButton.__proto__ || Object.getPrototypeOf(SaveButton)).call.apply(_ref, [this].concat(args))), _this), _this.onClick = function (e) {
      return new Promise(function ($return, $error) {
        var isValid;

        if (this.props.disabled) {
          return $return();
        }

        if (typeof this.props.onClick === 'function') {
          this.props.onClick(e);
          if (e.isDefaultPrevented()) return $return();
        }

        e.persist(); // so that it can be used by onSave / onInvalid callbacks after the async save

        return (0, _validate.validateAndSave)(this.props.model, this.props.options, this.props.disableWhileSaving && e).then(function ($await_1) {
          isValid = $await_1;


          if (isValid) {
            if (typeof this.props.onSave === 'function') {
              this.props.onSave(e);
            }
            return $return();
          }

          if (typeof this.props.onInvalid === 'function') {
            this.props.onInvalid(e);
          }
          return $return();
        }.$asyncbind(this, $error), $error);
      }.$asyncbind(_this));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SaveButton, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          model = _props.model,
          options = _props.options,
          onClick = _props.onClick,
          onSave = _props.onSave,
          onInvalid = _props.onInvalid,
          disableWhileSaving = _props.disableWhileSaving,
          others = _objectWithoutProperties(_props, ['model', 'options', 'onClick', 'onSave', 'onInvalid', 'disableWhileSaving']); // eslint-disable-line no-unused-vars


      return _react2.default.createElement(_button2.default, _extends({
        primary: true,
        raised: !this.props.disabled,
        flat: this.props.disabled,
        onClick: this.onClick
      }, others));
    }
  }]);

  return SaveButton;
}(_react2.default.Component)) || _class;

SaveButton.defaultProps = {
  disableWhileSaving: true
};

SaveButton.propTypes = {
  model: _schemaFormPropTypes.modelShape,
  options: _propTypes2.default.shape({
    allowCreate: _propTypes2.default.bool,
    saveAll: _propTypes2.default.bool,
    skipPropertyBeingEdited: _propTypes2.default.bool,
    keepServerError: _propTypes2.default.bool
  }),
  onClick: _propTypes2.default.func,
  onSave: _propTypes2.default.func,
  onInvalid: _propTypes2.default.func,
  disabled: _propTypes2.default.bool,
  disableWhileSaving: _propTypes2.default.bool
};

exports.default = SaveButton;
module.exports = exports['default'];
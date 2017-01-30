'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _slider = require('react-toolbox/lib/slider');

var _slider2 = _interopRequireDefault(_slider);

var _asSchemaField = require('./asSchemaField');

var _asSchemaField2 = _interopRequireDefault(_asSchemaField);

var _schemaFormPropTypes = require('./schemaFormPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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

var SliderField = function SliderField(props) {
  var formField = props.formField,
      value = props.value,
      others = _objectWithoutProperties(props, ['formField', 'value']);

  var min = formField.min !== 0 ? formField.min || formField.schema.minimum : 0;
  var max = formField.max || formField.schema.maximum;
  var defaultValue = max < min ? min : min + (max - min) / 2;

  // FUTURE TODO: Better support or warning if ticksLabelStep=2, step=1 but max-min is not even
  var tickLabels = null;
  if (formField.tickLabelsStep !== 0 && formField.step) {
    var steps = [];
    var label = min;
    while (label <= max) {
      steps.push(label);
      label += formField.tickLabelsStep || formField.step || 1;
    }
    var stepsStretch = 100.0 * (steps.length / (steps.length - 1));
    var halfStretch = (stepsStretch - 100.0) / 2;

    var sliderKnobSize = '3rem'; // $slider-knob-size React-Toolbox variable

    tickLabels = _react2.default.createElement(
      'div',
      { style: { overflow: 'hidden' } },
      _react2.default.createElement(
        'div',
        { style: { width: 'calc(100% - ' + sliderKnobSize + ')' } },
        _react2.default.createElement(
          'ol',
          { style: { width: stepsStretch + '%', marginLeft: 'calc(-' + halfStretch + '% + (' + sliderKnobSize + ' / 2))' } },
          steps.map(function (step) {
            return _react2.default.createElement(
              'li',
              { key: step },
              typeof formField.tickLabelsFormat === 'function' ? formField.tickLabelsFormat(step) : step
            );
          })
        )
      )
    );
  }

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'abbr',
      null,
      formField.description || ''
    ),
    _react2.default.createElement(_slider2.default, _extends({}, others, {
      pinned: true,
      snaps: true,
      min: min,
      max: max,
      step: formField.step,
      value: value || defaultValue
    }, formField.props)),
    tickLabels
  );
};

SliderField.propTypes = {
  formField: _schemaFormPropTypes.formShape,
  value: _react2.default.PropTypes.number
};

exports.default = (0, _asSchemaField2.default)(SliderField, 'slider');
module.exports = exports['default'];
import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'react-toolbox/lib/date_picker';
import { Date as SugarDate } from 'sugar';
import Hammer from 'hammerjs';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

// TODO: Once onActiveChange is implemented in DatePicker
// (https://github.com/react-toolbox/react-toolbox/pull/1382)
// all the onFocus, onClick, onDismiss and onChange handlers can be removed
class DateField extends React.Component {
  componentWillUnmount() {
    this.disableSwipe();
  }

  // TEMP Workaround for React-Toolbox DatePicker not actually exposing the onFocus event.
  onRender = (el) => {
    if (el) {
      const input = el.getElementsByTagName('input')[0];
      if (input) {
        input.removeEventListener('focusin', this.onFocus);
        input.addEventListener('focusin', this.onFocus, false);
      }
    }
  };

  onFocus = () => {
    this.onActiveChange(true);
  };

  onClick = () => {
    this.onActiveChange(true);
  };

  onDismiss = () => {
    this.onActiveChange(false);
  };

  onChange = (...args) => {
    this.onActiveChange(false);
    this.props.onChange(...args);
  };

  enableSwipe = () => {
    this.disableSwipe();
    this.hammerManager = new Hammer.Manager(document.body, {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }],
      ],
    });
    this.hammerManager.on('swipe', this.onSwipe);
  };

  disableSwipe = () => {
    this.hammerManager && this.hammerManager.destroy();
  };

  // Note that in non-production React 15.x on a desktop browser, button will get clicked twice
  // (see https://github.com/facebook/react/issues/8559).
  onSwipe = (e) => {
    switch (e.direction) {
      case Hammer.DIRECTION_LEFT: {
        const button = document.querySelector('[data-react-toolbox=calendar] button#right');
        if (button) {
          button.click();
        }
        break;
      }
      case Hammer.DIRECTION_RIGHT: {
        const button = document.querySelector('[data-react-toolbox=calendar] button#left');
        if (button) {
          button.click();
        }
        break;
      }
    }
  };

  onActiveChange = (active) => {
    if (active) {
      this.enableSwipe();
      this.props.onFocus();
    } else {
      this.disableSwipe();
      this.props.onBlur();
    }
  };

  render() {
    const { formField, readOnly, onChange, onFocus, onBlur, ...others } = this.props; // eslint-disable-line no-unused-vars
    const minDate = formField.min ? SugarDate.create(formField.min) : null;
    const maxDate = formField.max ? SugarDate.create(formField.max) : null;

    return (
      <div ref={this.onRender}>
        <DatePicker
          {...others}
          onFocus={this.onFocus}
          onClick={this.onClick}
          onDismiss={this.onDismiss}
          onChange={this.onChange}
          readonly={readOnly}
          autoOk
          label={formField.description}
          placeholder={formField.placeholder}
          inputFormat={(value) => value.toLocaleDateString()}
          minDate={minDate}
          maxDate={maxDate}
          {...formField.props}
        />
      </div>
    );
  }
}

DateField.propTypes = {
  formField: formShape,
  readOnly: PropTypes.bool,
  onChange: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
};

export default asSchemaField(DateField, 'datepicker');

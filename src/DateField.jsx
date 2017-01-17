import React from 'react';
import DatePicker from 'react-toolbox/lib/date_picker';
import { Date as SugarDate } from 'sugar';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

class DateField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      minDate: props.formField.min ? SugarDate.create(props.formField.min) : null,
      maxDate: props.formField.max ? SugarDate.create(props.formField.max) : null,
      active: false,
    };
  }

  /* All these handlers and state.active management are a workaround for this bug:
   https://github.com/react-toolbox/react-toolbox/issues/930 */

  onClick = () => {
    this.setState({ active: true });
  };

  onDismiss = () => {
    this.setState({ active: false });
  };

  onChange = (...args) => {
    this.setState({ active: false });
    this.props.onChange(...args);
  };

  render() {
    const { formField, disabled, onChange, ...others } = this.props; // eslint-disable-line no-unused-vars
    return (
      <DatePicker
        {...others}
        onClick={this.onClick}
        onDismiss={this.onDismiss}
        onChange={this.onChange}
        active={this.state.active}
        readonly={disabled}
        autoOk
        label={formField.description}
        placeholder={formField.placeholder}
        inputFormat={(value) => value.toLocaleDateString()}
        minDate={this.state.minDate}
        maxDate={this.state.maxDate}
        {...formField.props}
      />
    );
  }
}

DateField.propTypes = {
  formField: formShape,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
};

export default asSchemaField(DateField, 'datepicker');

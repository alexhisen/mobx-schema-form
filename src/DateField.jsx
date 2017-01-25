import React from 'react';
import DatePicker from 'react-toolbox/lib/date_picker';
import { Date as SugarDate } from 'sugar';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const DateField = (props) => {
  const { formField, readOnly, ...others } = props;
  const minDate = formField.min ? SugarDate.create(formField.min) : null;
  const maxDate = formField.max ? SugarDate.create(formField.max) : null;
  return (
    <DatePicker
      {...others}
      readonly={readOnly}
      autoOk
      label={formField.description}
      placeholder={formField.placeholder}
      inputFormat={(value) => value.toLocaleDateString()}
      minDate={minDate}
      maxDate={maxDate}
      {...formField.props}
    />
  );
};

DateField.propTypes = {
  formField: formShape,
  readOnly: React.PropTypes.bool,
};

export default asSchemaField(DateField, 'datepicker');

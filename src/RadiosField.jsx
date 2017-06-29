import React from 'react';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

function asString(value) {
  return value === null ? '' : String(value);
}

const RadiosField = (props) => {
  const { formField, name, value, ...others } = props;
  const items = (formField.titleMap || formField.schema.enum).map((item) => {
    return (
      <RadioButton
        name={name}
        label={item.name ? item.name : item}
        value={item.name ? asString(item.value) : asString(item)}
        key={item.name ? item.value : item}
      />
    );
  });

  return (
    <RadioGroup
      {...others}
      value={asString(value)}
      name={name}
      {...props.formField.props}
    >
      {items}
    </RadioGroup>
  );
};

RadiosField.propTypes = {
  formField: formShape,
  name: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool,
  ]),
};

export default asSchemaField(RadiosField);

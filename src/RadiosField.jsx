import React from 'react';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const RadiosField = (props) => {
  const { formField, value, name, ...others } = props;
  const items = formField.titleMap.map((item) => {
    return (
      <RadioButton
        name={name}
        label={item.name}
        value={item.value}
        key={item.value}
      />
    );
  });

  return (
    <RadioGroup
      {...others}
      name={name}
      value={value}
      {...props.formField.props}
    >
      {items}
    </RadioGroup>
  );
};

RadiosField.propTypes = {
  formField: formShape,
  value: React.PropTypes.number,
  name: React.PropTypes.string,
};

export default asSchemaField(RadiosField);

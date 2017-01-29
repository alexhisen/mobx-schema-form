import React from 'react';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

const RadiosField = (props) => {
  const { formField, name, ...others } = props;
  const items = (formField.titleMap || formField.schema.enum).map((item) => {
    return (
      <RadioButton
        name={name}
        label={item.name ? item.name : item}
        value={item.name ? item.value : item}
        key={item.name ? item.value : item}
      />
    );
  });

  return (
    <RadioGroup
      {...others}
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
};

export default asSchemaField(RadiosField);

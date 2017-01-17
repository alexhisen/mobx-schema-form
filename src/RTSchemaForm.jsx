/*
 * Syntax-compatible wrapper to react-schema-form SchemaForm (except onModelChange is not required)
 * that uses a Mobx FormStore model and React-Toolbox form widgets
 */
import React from 'react';
import { SchemaForm } from 'react-schema-form';
import { observer } from 'mobx-react';

import TextField from './TextField';
import DateField from './DateField';
import SwitchField from './SwitchField';
import RadiosField from './RadiosField';
import Fieldset from './Fieldset';
import DropdownField from './DropdownField';
import BoolLink from './BoolLink';
import SliderField from './SliderField';

import { getFieldKey } from './validate';
import { formShape, modelShape, mapperShape } from './schemaFormPropTypes';

@observer class RTSchemaForm extends React.Component {
  componentWillMount() {
    this.props.model.fields = {};
  }

  componentWillUnmount() {
    delete this.props.model.fields;
  }

  onModelChange = (formField, value) => {
    const asString = true;
    const key = getFieldKey(formField, asString);
    if (!key) {
      this.props.onModelChange && this.props.onModelChange(formField, value);
      return;
    }

    this.props.onModelChange && this.props.onModelChange(key, value);

    // since we unmount first before children unmount, must check if fields still exists
    if (!this.props.model.fields) return;
    if (value === undefined) {
      // field has been removed from form
      delete this.props.model.fields[key];
    } else {
      this.props.model.fields[key] = formField;
    }
  };

  render() {
    // mapper is used to map types in form object, not schema object
    const mapper = {
      date: DateField,
      text: TextField,
      email: TextField,
      password: TextField,
      number: TextField,
      tel: TextField,
      textarea: TextField,
      switch: SwitchField,
      radios: RadiosField,
      fieldset: Fieldset,
      select: DropdownField,
      link: BoolLink,
      range: SliderField,
      ...this.props.mapper,
    };

    return (
      <SchemaForm
        mapper={mapper}
        schema={this.props.schema}
        form={this.props.form}
        model={this.props.model}
        onModelChange={this.onModelChange}
      />
    );
  }
}

RTSchemaForm.propTypes = {
  mapper: mapperShape,
  model: modelShape,
  schema: React.PropTypes.shape({
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    properties: React.PropTypes.object.isRequired, /* each key has the schema portion of formShape */
    required: React.PropTypes.array,
  }),
  /* actually a subset of formShape, no schema and some properties in formShape are copied from schema actually */
  form: React.PropTypes.arrayOf(formShape).isRequired,
  onModelChange: React.PropTypes.func,
};

export default RTSchemaForm;

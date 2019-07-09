/*
 * Syntax-compatible equivalent to react-schema-form SchemaForm (except onModelChange is not required)
 * that uses a Mobx FormStore model and React-Toolbox form widgets
 */
import PropTypes from 'prop-types';
import React from 'react';
import { formShape, modelShape, mapperShape } from './schemaFormPropTypes';
import SchemaForm from './SchemaForm';

class MobxSchemaForm extends React.Component {
  render() {
    let mapper;
    if (this.props.mergeMapper === false) {
      mapper = this.props.mapper;
    } else {
      /* eslint-disable global-require */
      const TextField = require('./TextField');
      const DateField = require('./DateField');
      const CheckboxField = require('./CheckboxField');
      const SwitchField = require('./SwitchField');
      const RadiosField = require('./RadiosField');
      const Fieldset = require('./Fieldset');
      const DropdownField = require('./DropdownField');
      const BoolLink = require('./BoolLink');
      const SliderField = require('./SliderField');
      const Help = require('./Help');
      /* eslint-enable */

      // mapper is used to map types in form object, not schema object
      mapper = {
        date: DateField,
        text: TextField,
        email: TextField,
        password: TextField,
        number: TextField,
        tel: TextField,
        textarea: TextField,
        checkbox: CheckboxField,
        switch: SwitchField,
        radios: RadiosField,
        fieldset: Fieldset,
        select: DropdownField,
        link: BoolLink,
        range: SliderField,
        help: Help,
        ...this.props.mapper,
      };
    }

    return (<SchemaForm {...this.props} mapper={mapper} />);
  }
}

MobxSchemaForm.propTypes = {
  className: PropTypes.string,
  mapper: mapperShape,
  model: modelShape,
  schema: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    properties: PropTypes.object.isRequired, /* each key has the schema portion of formShape */
    required: PropTypes.array,
  }),
  /* actually a subset of formShape, no schema and some properties in formShape are copied from schema */
  form: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, formShape])),
  options: PropTypes.shape({
    suppressPropertyTitles: PropTypes.bool,
    /* actually a subset of formShape, no schema and some properties in formShape are copied from schema */
    formDefaults: formShape,
    validators: PropTypes.objectOf(PropTypes.func),
  }),
  /* @deprecated For compatibility with react-schema-form */
  option: PropTypes.shape({
    supressPropertyTitles: PropTypes.bool,  /* yes, they have it misspelled like that - we convert to their spelling */
    formDefaults: formShape,
    validators: PropTypes.objectOf(PropTypes.func),
  }),
  ignore: PropTypes.objectOf(PropTypes.bool), // list of paths in schema to ignore (sans root level name)
  onModelChange: PropTypes.func,
  mergeMapper: PropTypes.bool,
  asArray: PropTypes.bool,
};

export default MobxSchemaForm;

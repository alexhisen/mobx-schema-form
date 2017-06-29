/*
 * Syntax-compatible equivalent to react-schema-form SchemaForm (except onModelChange is not required)
 * that uses a Mobx FormStore model and React-Toolbox form widgets
 */
import PropTypes from 'prop-types';
import React from 'react';
import utils from 'react-schema-form/lib/utils';
import { observer } from 'mobx-react';

import { getFieldKey } from './validate';
import { formShape, modelShape, mapperShape } from './schemaFormPropTypes';

@observer class MobxSchemaForm extends React.Component {
  componentWillMount() {
    this.props.model.fields = {};

    const options = this.props.options || this.props.option;
    if (options && options.validators) {
      // merge to allow different instances of MobxSchemaForm to maintain their own validators in the store
      this.props.model.validators = Object.assign((this.props.model.validators || {}), options.validators);
    }
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

  builder(form, model, index, onChange, mapper) {
    const Field = mapper[form.type];
    if (!Field) {
      console.log('Invalid field: \"' + form.key[0] + '\"!'); // eslint-disable-line
      return null;
    }
    if (form.condition && eval(form.condition) === false) {
      return null;
    }
    return (<Field model={model} form={form} key={index} onChange={onChange} mapper={mapper} builder={this.builder} />);
  }

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
        ...this.props.mapper,
      };
    }

    const merged = utils.merge(this.props.schema, this.props.form, this.props.ignore, this.props.options || this.props.option);
    // console.log('SchemaForm merged = ', JSON.stringify(merged, undefined, 2));

    const forms = merged.map((form, index) => this.builder(form, this.props.model, index, this.onModelChange, mapper));

    return (<div style={{width: '100%'}} className='SchemaForm'>{forms}</div>);
  }
}

MobxSchemaForm.propTypes = {
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
    suppressPropertyTitles: PropTypes.bool,
    formDefaults: formShape,
    validators: PropTypes.objectOf(PropTypes.func),
  }),
  ignore: PropTypes.objectOf(PropTypes.bool), // list of paths in schema to ignore (sans root level name)
  onModelChange: PropTypes.func,
  mergeMapper: PropTypes.bool,
};

export default MobxSchemaForm;

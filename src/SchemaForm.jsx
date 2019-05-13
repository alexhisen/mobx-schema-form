/*
 * Syntax-compatible equivalent to react-schema-form SchemaForm (except onModelChange is not required)
 * that uses a Mobx FormStore model. IMPORTANT: mapper is required with mapping of widgets.
 * Typically the mapper with React-Toolbox-based widgets is provided by MobxSchemaForm,
 * but you can use this lower-level component directly with your own widgets to
 * bypass the importing of react-toolbox.
 */
import PropTypes from 'prop-types';
import React from 'react';
import utils from 'react-schema-form/lib/utils';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { getFieldKey } from './validate';
import { formShape, modelShape, mapperShape } from './schemaFormPropTypes';

@observer class SchemaForm extends React.Component {
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
      /* eslint-disable no-eval */
      if (formField.falseConditionValue !== undefined && formField.condition && eval(formField.condition) === false) {
        action(() => {
          const fieldKey = getFieldKey(formField);
          utils.selectOrSet(fieldKey, this.props.model.data, formField.falseConditionValue);
          utils.selectOrSet(fieldKey, this.props.model.dataErrors, null);
        })();
      }
      /* eslint-enable */
      delete this.props.model.fields[key];
    } else {
      this.props.model.fields[key] = formField;
    }
  };

  builder(form, model, index, onChange, mapper) {
    const Field = mapper[form.type];
    if (!Field) {
      console.warn(`Skipping field - unmapped type: '${form.type}' in ${getFieldKey(form) || `field ${index}`}`); // eslint-disable-line no-console
      return null;
    }
    /* eslint-disable no-eval */
    if (form.condition && eval(form.condition) === false) {
      return null;
    }
    /* eslint-enable */
    return (<Field model={model} form={form} key={index} onChange={onChange} mapper={mapper} builder={this.builder} />);
  }

  render() {
    const mapper = this.props.mapper;
    const merged = utils.merge(this.props.schema, this.props.form, this.props.ignore, this.props.options || this.props.option);
    // console.log('SchemaForm merged = ', JSON.stringify(merged, undefined, 2));

    const forms = merged.map((form, index) => this.builder(form, this.props.model, index, this.onModelChange, mapper));

    return (<div style={{ width: '100%' }} className="SchemaForm">{forms}</div>);
  }
}

SchemaForm.propTypes = {
  mapper: mapperShape.isRequired,
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
};

export default SchemaForm;

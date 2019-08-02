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
    this.props.model.fields = this.props.model.fields || {};

    const options = this.props.options || this.props.option;
    if (options && options.validators) {
      // merge to allow different instances of MobxSchemaForm to maintain their own validators in the store
      this.props.model.validators = Object.assign((this.props.model.validators || {}), options.validators);
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  onModelChange = (formField, value) => {
    const model = this.props.model; // this variable name is required for evaling form.condition.
    const asString = true;
    const key = getFieldKey(formField, asString);
    if (!key) {
      this.props.onModelChange && this.props.onModelChange(formField, value);
      return;
    }

    this.props.onModelChange && this.props.onModelChange(key, value);

    // since we unmount first before children unmount, must check if fields still exists
    if (this.unmounting) {
      delete model.fields[key];
      return;
    }

    if (value === undefined) {
      // field has been removed from form
      const form = formField; // this variable name is required for evaling form.condition.
      /* eslint-disable no-eval */
      if (form.falseConditionValue !== undefined && form.condition && eval(form.condition) === false) {
        action(() => {
          const fieldKey = getFieldKey(form);
          utils.selectOrSet(fieldKey, model.data, form.falseConditionValue);
          utils.selectOrSet(fieldKey, model.dataErrors, null);
        })();
      }
      /* eslint-enable */
      delete model.fields[key];
    } else {
      model.fields[key] = formField;
    }
  };

  // IMPORTANT: form and model variable names must not be changed to not break form.condition evals
  builder(form, model, index, onChange, mapper) {
    const asString = true;
    const key = getFieldKey(form, asString);
    const Field = mapper[form.type];
    if (!Field) {
      console.warn(`Skipping field - unmapped type: '${form.type}' in ${key || `field ${index}`}`); // eslint-disable-line no-console
      return null;
    }
    /* eslint-disable no-eval */
    if (form.condition && eval(form.condition) === false) {
      return null;
    }
    /* eslint-enable */
    return (<Field model={model} form={form} key={key || index} onChange={onChange} mapper={mapper} builder={this.builder} />);
  }

  render() {
    const mapper = this.props.mapper;
    const options = this.props.options || this.props.option;
    if (options) {
      // change from correct spelling to theirs
      if (options.supressPropertyTitles === undefined) {
        options.supressPropertyTitles = options.suppressPropertyTitles;
      }
    }
    const merged = utils.merge(this.props.schema, this.props.form, this.props.ignore, options);
    // console.log('SchemaForm merged = ', JSON.stringify(merged, undefined, 2));

    const fields = merged.map((form, index) => this.builder(form, this.props.model, index, this.onModelChange, mapper));

    const child = this.props.children && React.cloneElement(React.Children.only(this.props.children), { children: fields });

    if (this.props.asArray) {
      return child || fields;
    }

    return (
      <div style={{ width: '100%' }} className={this.props.className}>
        {child || fields}
      </div>
    );
  }
}

SchemaForm.defaultProps = {
  className: 'SchemaForm',
};

SchemaForm.propTypes = {
  className: PropTypes.string,
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
    supressPropertyTitles: PropTypes.bool, /* yes, they have it misspelled like that - we convert to their spelling */
    formDefaults: formShape,
    validators: PropTypes.objectOf(PropTypes.func),
  }),
  ignore: PropTypes.objectOf(PropTypes.bool), // list of paths in schema to ignore (sans root level name)
  onModelChange: PropTypes.func,
  asArray: PropTypes.bool,
  children: PropTypes.element,
};

export default SchemaForm;

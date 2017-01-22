import React from 'react';
import { observer } from 'mobx-react';
import { formShape, modelShape, mapperShape } from './schemaFormPropTypes';

@observer class Fieldset extends React.Component {
  render() {
    const { form, model, mapper } = this.props; // eslint-disable-line no-unused-vars
    if (form.mobxCondition && eval(form.mobxCondition) === false) { // eslint-disable-line no-eval
      return null;
    }

    let legend = null;

    if (form.title) {
      legend = (
        <legend>
          <h4>{form.title}</h4>
          <h5>{form.description}</h5>
        </legend>
      );
    }

    const fields = form.items.map((formField, index) => {
      return this.props.builder(formField, this.props.model, index, this.props.onChange, this.props.mapper, this.props.builder);
    });

    return (
      <fieldset className={form.className}>
        {legend}
        {fields}
      </fieldset>
    );
  }
}

Fieldset.propTypes = {
  form: formShape,
  builder: React.PropTypes.func,
  model: modelShape,
  mapper: mapperShape,
  onChange: React.PropTypes.func,
};

export default Fieldset;

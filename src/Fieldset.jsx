import React from 'react';
import { observer } from 'mobx-react';
import { formShape, modelShape, mapperShape } from './schemaFormPropTypes';

@observer class Fieldset extends React.Component {
  render() {
    if (this.props.form.mobxCondition && eval(this.props.form.mobxCondition) === false) { // eslint-disable-line no-eval
      return null;
    }

    let legend = null;

    if (this.props.form.title) {
      legend = (
        <legend>
          <h4>{this.props.form.title}</h4>
          <h5>{this.props.form.description}</h5>
        </legend>
      );
    }

    const fields = this.props.form.items.map((form, index) => {
      return this.props.builder(form, this.props.model, index, this.props.onChange, this.props.mapper, this.props.builder);
    });

    return (
      <fieldset className={this.props.form.className}>
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

import React from 'react';
import { utils } from 'react-schema-form';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { getFieldKey, getFieldValue, validateField } from './validate';
import { modelShape, formShape, mapperShape } from './schemaFormPropTypes';

const asSchemaField = (ComposedComponent, fieldType) => observer(class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      beingEdited: false,
      valueEntered: false,
      initialValue: null,
    };
  }

  componentDidMount() {
    // update value in the model to a possible schema default
    // and validate it
    action(() => {
      const value = this.getValue();
      if (value !== undefined && value !== null) {
        validateField(this.props.form, this.props.model, value);
      }
      this.props.onChange(this.props.form, value);
    })();
  }

  componentWillUnmount() {
    // clear the validation error on the field if any
    action(() => {
      validateField(this.props.form, this.props.model);
      this.props.onChange(this.props.form);
    })();
  }

  /**
   * Called when <input> value changes.
   * Supports regular React events and React-toolbox callbacks (value as first argument, event object as second)
   * @param {Event|String|Number|Date|Array} val - The new value of input.
   */
  onChangeValidate = (val) => {
    let value = (val && val.target) ? val.target.value : val;

    if (value && this.props.form.schema && this.props.form.schema.type.match(/integer|number/) && typeof value !== 'number') {
      if (value.indexOf('.') === -1) {
        value = parseInt(value, 10);
      } else {
        value = parseFloat(value);
      }
    }

    if (value === undefined) value = null;

    const hasError = !!utils.selectOrSet(this.getKey(), this.props.model.dataErrors);

    if (this.state.beingEdited && !hasError && !this.state.valueEntered && this.props.form.type.match(/text|email|tel|password/i)) {
      action(() => {
        utils.selectOrSet(
          this.getKey(),
          this.props.model.data,
          value
        );
        this.props.onChange(this.props.form, value);
      })();
    } else {
      action(() => {
        // update value and error if any
        validateField(this.props.form, this.props.model, value);

        this.props.onChange(this.props.form, value);
      })();
    }
  };

  /**
   * Called when component is in focus (being edited)
   */
  onFocus = () => {
    this.props.model.startEditing(this.getKey());
    this.state.beingEdited = true;
    this.state.initialValue = this.getValue();
  };

  /**
   * Called when component goes out of focus (finished being edited)
   */
  onBlur = (e) => {
    if (this.props.form.type.match(/text|email|tel|password/i)) {
      const value = (e && e.target) ? e.target.value : e;

      // if user deletes a previous value, also run validation
      if (value || this.state.initialValue) {
        const trimmed = value.trim();

        if (value !== trimmed || !this.state.valueEntered || this.state.initialValue) {
          this.state.valueEntered = true;
          this.onChangeValidate(trimmed);
        }
      }
    }

    this.props.model.stopEditing();
    this.state.beingEdited = false;
  };

  getKey = () => {
    return getFieldKey(this.props.form);
  };

  getValue = () => {
    return getFieldValue(this.props.form, this.props.model);
  };

  render() {
    const error = utils.selectOrSet(this.getKey(), this.props.model.dataErrors);
    const composedComponent = (
      <ComposedComponent
        name={this.props.form.key.join('.')}
        required={this.props.form.required}
        formField={this.props.form}
        value={this.getValue()}
        error={error}
        disabled={this.props.model.status.isReadOnly}
        readOnly={this.props.model.status.isReadOnly}
        onChange={this.onChangeValidate}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    );

    if (this.props.mapper.fieldWrapper) {
      const FieldWrapper = this.props.mapper.fieldWrapper;
      return (
        <FieldWrapper formField={this.props.form} fieldType={fieldType} hasError={!!error}>
          {composedComponent}
        </FieldWrapper>
      );
    }

    return composedComponent;
  }

  static propTypes = {
    form: formShape,
    model: modelShape,
    onChange: React.PropTypes.func,
    mapper: mapperShape,
    /* Not used:
    builder: React.PropTypes.func,
    */
  };

  static displayName = 'SchemaField';
});

export default asSchemaField;

import PropTypes from 'prop-types';
import React from 'react';
import utils from 'react-schema-form/lib/utils';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { getFieldKey, getFieldValue, validateField, getValidationMessage } from './validate';
import { modelShape, formShape, mapperShape } from './schemaFormPropTypes';

const asSchemaField = (ComposedComponent, fieldType) => observer(class extends React.Component {
  static propTypes = {
    form: formShape,
    model: modelShape,
    onChange: PropTypes.func,
    mapper: mapperShape,
    /* Not used:
    builder: PropTypes.func,
    */
  };

  static displayName = 'SchemaField';

  constructor(props) {
    super(props);

    this.beingEdited = false;
    this.valueEntered = false;
    this.initialValue = null;

    this.state = {
      valueAsString: '',
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
    const hasError = !!this.getError();
    if (hasError && this.props.model.getSavedData) {
      // reset the field to known good value and clear the validation error on the field
      action(() => {
        const key = this.getKey();
        const value = utils.selectOrSet(key, this.props.model.getSavedData());
        utils.selectOrSet(key, this.props.model.data, value);
        utils.selectOrSet(key, this.props.model.dataErrors, null);
        this.props.onChange(this.props.form);
      })();
      return;
    }

    this.props.onChange(this.props.form);
  }

  /**
   * Called when <input> value changes.
   * Supports regular React events and React-Toolbox callbacks (value as first argument, event object as second)
   * @param {Event|String|Number|Date|Array} val - The new value of input.
   * @param {Event} [e] - Event object for React-Toolbox widgets and from onBlur event
   */
  onChangeValidate = (val, e) => {
    const event = e || val;
    let value = (val && val.target) ? val.target.value : val;

    if (event && event.type === 'focus') {
      // react-input-mask calls onChange before the focus event completes.
      // this will set beingEdited to true and avoid premature validation:
      this.onFocus();
    }

    if (this.props.form.schema && this.props.form.schema.type.match(/integer|number/) && typeof value !== 'number') {
      const strict = (event && event.type === 'blur');
      if (!value || strict) {
        if (this.state.valueAsString) {
          // clear any temporary string representation
          this.setState({ valueAsString: '' });
        }
      }
      if (value) {
        // TODO: Support commas as decimal separator based on locale?
        // strip all extraneous characters:
        const valueAsString = value.replace(/[^0-9.-]/g, '');
        if (!strict && valueAsString === '-') {
          // User just started typing a negative number
          this.setState({ valueAsString });
          return;
        }
        const hasDecimal = (valueAsString.indexOf('.') !== -1);
        if (hasDecimal && this.props.form.schema.type.match(/integer/)) {
          // reject the decimal, don't update value
          return;
        }
        if (!hasDecimal) {
          value = parseInt(valueAsString, 10);
        } else {
          if (!strict && (valueAsString === '.' || valueAsString === '-.')) {
            // User just started typing without a leading 0
            this.setState({ valueAsString });
            return;
          }
          value = parseFloat(valueAsString);
        }
        if (isNaN(value)) {
          // after stripping, there is nothing left, so reject invalid character, don't update value
          return;
        }
        if (!strict) {
          // Update the string representation so it can be rendered for user input like 1. and 1.0
          this.setState({ valueAsString });
        }
      }
    } else if (event && event.target && this.props.form.schema && this.props.form.schema.type === 'boolean') {
      value = event.target.checked;
    }

    if (this.props.form.schema && this.props.form.schema.type === 'boolean' && value !== null && typeof value !== 'boolean') {
      value = value && value.toLowerCase && value.toLowerCase();
      if (value === 0 || value === -0 || value === '0' || value === 'f' || value === 'false' || value === 'off' || value === 'no' || value === 'n') {
        value = false;
                              // value !== value is a NaN check that doesn't give true for a string
      } else if (value === null || value !== value || value === '' || value === undefined) { // eslint-disable-line no-self-compare
        value = null;
      } else {
        value = true;
      }
    }

    if (value === undefined) value = null;

    const hasError = !!this.getError();

    if (this.beingEdited && !hasError && !this.valueEntered && this.props.form.type.match(/text|textarea|email|tel|number|password/i)) {
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
    this.props.model.startEditing && this.props.model.startEditing(this.getKey());
    this.beingEdited = true;
    this.initialValue = this.getValue();
  };

  /**
   * Called when component goes out of focus (finished being edited)
   */
  onBlur = (e) => {
    if (this.props.form.type.match(/text|textarea|email|tel|number|password/i)) {
      const value = (e && e.target) ? e.target.value : e;

      // if user deletes a previous value or there was a previous error, also run validation
      const hasError = !!this.getError();
      if (value || this.initialValue || hasError) {
        const trimmed = value.trim();

        if (value !== trimmed || !this.valueEntered || this.initialValue || hasError || this.state.valueAsString) {
          this.valueEntered = true; // this must be true for validateField() to actually be called
          this.onChangeValidate(trimmed, e);
          this.valueEntered = !!trimmed; // if value was cleared, resets behavior for next time
        }
      }
    }

    this.props.model.stopEditing && this.props.model.stopEditing();
    this.beingEdited = false;
  };

  getKey = () => {
    return getFieldKey(this.props.form);
  };

  getValue = () => {
    return this.state.valueAsString || getFieldValue(this.props.form, this.props.model);
  };

  getError = () => {
    return utils.selectOrSet(this.getKey(), this.props.model.dataErrors);
  };

  render() {
    const { form, model, mapper, builder } = this.props;
    if (form.mobxCondition && eval(form.mobxCondition) === false) { // eslint-disable-line no-eval
      return null;
    }

    const value = this.getValue();

    let error = this.getError();
    if (typeof error === 'object') {
      // Convert server-returned error object in tv4 format to proper validationMessage string:
      error = getValidationMessage(error, form, model, value);
    }

    const composedComponent = (
      <ComposedComponent
        name={form.key.join('.')}
        required={form.required}
        formField={form}
        value={value}
        error={error}
        disabled={!!(model.status && model.status.isReadOnly)}
        readOnly={!!(model.status && model.status.isReadOnly)}
        onChange={this.onChangeValidate}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        model={model}
        builder={builder}
        mapper={mapper}
      />
    );

    if (mapper.fieldWrapper) {
      const FieldWrapper = mapper.fieldWrapper;
      return (
        <FieldWrapper formField={form} fieldType={fieldType} hasError={!!error} className={form.className}>
          {composedComponent}
        </FieldWrapper>
      );
    }

    return composedComponent;
  }
});

export default asSchemaField;

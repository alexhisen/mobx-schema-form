import React from 'react';
import Slider from 'react-toolbox/lib/slider';
import asSchemaField from './asSchemaField';
import { formShape } from './schemaFormPropTypes';

// FUTURE TODO: Support no step specified and no snapping
const SliderField = (props) => {
  const { formField, value, ...others } = props;
  const min = formField.min !== 0 ? formField.min || formField.schema.minimum : 0;
  const max = formField.max || formField.schema.maximum;
  const defaultValue = max < min ? min : (min + (max - min)) / 2;

  // FUTURE TODO: Better support or warning if ticksLabelStep=2, step=1 but max-min is not even
  const steps = [];
  let label = min;
  while (label <= max) {
    steps.push(label);
    label += (formField.tickLabelsStep || formField.step || 1);
  }
  const stepsStretch = 100.0 * (steps.length / (steps.length - 1));
  const halfStretch = (stepsStretch - 100.0) / 2;

  const sliderKnobSize = '3rem'; // $slider-knob-size React-Toolbox variable

  return (
    <div>
      <abbr>
        {formField.description || ''}
      </abbr>
      <Slider
        {...others}
        pinned
        snaps
        min={min}
        max={max}
        step={formField.step}
        value={value || defaultValue}
        {...formField.props}
      />
      <div style={{ overflow: 'hidden' }}>
        <div style={{ width: `calc(100% - ${sliderKnobSize})` }}>
          <ol style={{ width: `${stepsStretch}%`, marginLeft: `calc(-${halfStretch}% + (${sliderKnobSize} / 2))` }}>
            {steps.map((step) => {
              return <li key={step}>{step}</li>;
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};

SliderField.propTypes = {
  formField: formShape,
  value: React.PropTypes.number,
};

export default asSchemaField(SliderField, 'slider');

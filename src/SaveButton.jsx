import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'react-toolbox/lib/button';

import { validateAndSave } from './validate';
import { modelShape } from './schemaFormPropTypes';

@observer class SaveButton extends React.Component {
  onClick = async (e) => {
    if (this.props.disabled) {
      return;
    }

    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e);
      if (e.isDefaultPrevented()) return;
    }

    const responseAfterValidation = await validateAndSave(this.props.model, this.props.options, e);

    if (!responseAfterValidation) {
      if (typeof this.props.onInvalid === 'function') {
        this.props.onInvalid(e);
      }

      return;
    }

    if (typeof this.props.onSave === 'function') {
      this.props.onSave(e, responseAfterValidation);
    }
  };

  render() {
    const { model, options, disabled, onClick, onSave, onInvalid, ...others } = this.props; // eslint-disable-line no-unused-vars
    return (
      <Button
        raised
        primary
        flat={this.props.disabled}
        onClick={this.onClick}
        {...others}
      />
    );
  }
}

SaveButton.propTypes = {
  model: modelShape,
  options: PropTypes.shape({
    allowCreate: PropTypes.bool,
    saveAll: PropTypes.bool,
    skipPropertyBeingEdited: PropTypes.bool,
    keepServerError: PropTypes.bool,
  }),
  onClick: PropTypes.func,
  onSave: PropTypes.func,
  onInvalid: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SaveButton;

import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Button from 'react-toolbox/lib/button';

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

    e.persist(); // so that it can be used by onSave / onInvalid callbacks after the async save

    const isValid = await validateAndSave(this.props.model, this.props.options, this.props.disableWhileSaving && e);

    if (isValid) {
      if (typeof this.props.onSave === 'function') {
        this.props.onSave(e);
      }
      return;
    }

    if (typeof this.props.onInvalid === 'function') {
      this.props.onInvalid(e);
    }
  };

  render() {
    const { model, options, onClick, onSave, onInvalid, ...others } = this.props; // eslint-disable-line no-unused-vars
    return (
      <Button
        primary
        raised={!this.props.disabled}
        flat={this.props.disabled}
        onClick={this.onClick}
        {...others}
      />
    );
  }
}

SaveButton.defaultProps = {
  disableWhileSaving: true,
};

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
  disableWhileSaving: PropTypes.bool,
};

export default SaveButton;

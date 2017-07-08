import React from 'react';
import classNames from 'classnames';
import { formShape } from './schemaFormPropTypes';

const Help = (props) => {
  const classes = classNames(props.form.htmlClass);
  return (<div className={classes} dangerouslySetInnerHTML={{ __html: props.form.description }} />);
};

Help.propTypes = {
  form: formShape,
};

export default Help;

# MobX Schema Form
MobX Schema Form is part of a collection of loosely-coupled components for managing, rendering and validating forms in MobX-based apps.

## Detailed Documentation:
https://alexhisen.gitbooks.io/mobx-forms/

## mobx-schema-form Overview

mobx-schema-form renders form widgets \(by default Material Design\) based on schema and form definition in [json-schema-form](https://github.com/json-schema-form/json-schema-form/wiki/Documentation) format. Includes intelligent real-time validation and display of validation error message in each widget.

mobx-schema-form is a wrapper around [react-schema-form](https://github.com/networknt/react-schema-form). By default, mobx-schema-form uses [React-Toolbox](http://react-toolbox.com/) widgets instead of material-ui and wires up the widgets to work with [MobX FormStore](https://alexhisen.gitbooks.io/mobx-forms/formstore-overview.html). It also adds some improvements primarily in the area of validation.

## Features

* React-Toolbox is faster and lighter than Material-UI and uses easily themable/customizable CSS Modules instead of inline styles.
* Declarative form rendering and validation with added support for conditionally-rendered [alternate widgets for the same model property](https://alexhisen.gitbooks.io/mobx-forms/data-property-schema.html#modelkey).
* Virtually zero code for a complete implementation
* Mobx-reactive conditional rendering of fields or groups of fields in fieldsets
* Easy styling/customization of each widget on a per-field basis
* Provides facilities for form-wide validation \(i.e. of required fields when you hit the Save button\) in addition to intelligent real-time field-level validation.
* Fields that are currently not rendered \(based on their conditions\) are omitted from form-wide validation.
* In addition to the built-in schema/[tv4](https://github.com/geraintluff/tv4)-based validation, supports custom validations and server-returned validation errors.
* Values from text, etc input fields have their white space trimmed on blur and non-numeric characters cannot be entered into form fields with schema type of numeric/integer \(but negative integers and decimals such as 1.01 can still be keyed-in correctly\).

## Requirements

mobx-schema-form requires React, [MobX](https://mobx.js.org/), mobx-react and expects models to be instances of [MobX FormStore](https://alexhisen.gitbooks.io/mobx-forms/formstore-overview.html) or objects in the [modelShape](https://github.com/alexhisen/mobx-schema-form/blob/master/src/schemaFormPropTypes.js#L37) \(with at minimum data and dataErrors object properties\). Unlike FormStore, which is published as a UMD module to NPM, mobx-schema-form is published in CommonJS ES5 format. In addition, default use of MobxSchemaForm requires React-Toolbox, which in turn requires your environment to be able to load SASS files via require/import - i.e. properly configured webpack.

## Installation

```
npm install --save mobx-schema-form
```

## Minimal Usage Example

```js
import React from 'react';
import { observer } from 'mobx-react';
import { MobxSchemaForm } from 'mobx-schema-form';
import SaveButton from 'mobx-schema-form/lib/SaveButton';
import model from './myStore.js'; // a singleton instance of MobX FormStore

/* eslint-disable quotes, quote-props, comma-dangle */
// typically this would be in an external static json file
const schemaJson = {
  "schema": {
    "type": "object",
    "title": "MySchema",
    "properties": {
      "email": {
        "title": "Email",
        "type": "string",
        "pattern": "^[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+(\\.[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+)*@[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+(\\.[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+)*$",
        "validationMessage": {
          "default":"Email must be of proper format: abc@xyz.com",
          "302": "Email is required"
        }
      }
    },
    "required": ["email"]
  },
  "form": [
    {
      "key": "email",
      "type": "email"
    }
  ]
};
/* eslint-enable */

@observer class MyForm extends React.Component {
  render() {
    return (
      <form>
        <MobxSchemaForm
          schema={schemaJson.schema}
          form={schemaJson.form}
          model={model}
        />
        <SaveButton
          model={model}
          options={{ allowCreate: true, saveAll: true }}
          label="Save"
          disabled={!model.status.canSave}
          type="submit"
        />
      </form>
    );
  }
}
```

> Note that MobxSchemaForm uses the same props as react-schema-form's SchemaForm, which it wraps, except what react-schema-form calls model is actually model.data in mobx-schema-form.



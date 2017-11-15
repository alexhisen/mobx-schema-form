import chai from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import FormStore from 'mobx-form-store';
import { validateField, asSchemaField } from '../lib';
import SchemaForm from '../lib/SchemaForm';

chai.expect();

const expect = chai.expect;

const store = new FormStore({ server: { get: function(){}, set: function(){} } }, { email: null });

/* eslint-disable quotes, quote-props, comma-dangle */
const schemaJson = {
  "schema": {
    "type": "object",
    "title": "Test",
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

const mapper = { email: asSchemaField(function(){ return (<span />); }) };

mount(<SchemaForm schema={schemaJson.schema} form={schemaJson.form} model={store} mapper={mapper} />);

describe('ValidateForm', function () {
  describe('when email is null', function () {
    it('should return the require (302) validationMessage', () => {
      expect(validateField(store.fields.email, store, store.data.email)).to.be.equal('Email is required');
    });
  });
});

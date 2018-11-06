import chai from 'chai';
import { mount } from 'enzyme';

import React from 'react';
import FormStore from 'mobx-form-store';
import { validateField, asSchemaField } from '../lib';
import SchemaForm from '../lib/SchemaForm';

chai.expect();

const expect = chai.expect;

const store = new FormStore({ server: { get: function(){}, set: function(){} } }, { email: null, required_date: null, optional_date: null });

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
      },
      "required_date": {
        "title": "Required Date",
        "type": "object",
        "validationMessage": {
          "302": "required_date must be specified"
        }
      },
      "optional_date": {
        "title": "Optional Date",
        "type": "object"
      }
    },
    "required": ["email", "required_date"]
  },
  "form": [
    {
      "key": "email",
      "type": "email"
    },
    {
      "key": "required_date",
      "type": "date"
    },
    {
      "key": "optional_date",
      "type": "date"
    }
  ]
};
/* eslint-enable */

const mapper = {
  email: asSchemaField(function(){ return (<span />); }),
  date: asSchemaField(function(){ return (<span />); }),
};

mount(<SchemaForm schema={schemaJson.schema} form={schemaJson.form} model={store} mapper={mapper} />);

describe('ValidateForm', function () {
  describe('when email is null', function () {
    it('should return the require (302) validationMessage', () => {
      expect(validateField(store.fields.email, store, store.data.email)).to.be.equal('Email is required');
    });
  });
  describe('when required date field is null', function () {
    it('should return the require (302) validationMessage', () => {
      expect(validateField(store.fields.required_date, store, store.data.required_date)).to.be.equal('required_date must be specified');
    });
  });
  describe('when optional date field is null', function () {
    it('should not cause it to fail validation', () => {
      expect(validateField(store.fields.optional_date, store, store.data.optional_date)).to.be.null;
    });
  });
});

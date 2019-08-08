import chai from 'chai';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import React from 'react';
import FormStore from 'mobx-form-store';
import { validateField, asSchemaField } from '../lib';
import SchemaForm from '../lib/SchemaForm';

configure({ adapter: new Adapter() });

chai.expect();

const expect = chai.expect;

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
      "password": {
        "title": "Password",
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
      "key": "password",
      "type": "password",
      "condition": "model.data.email !== null",
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
  password: asSchemaField(function(){ return (<span />); }),
};

let fieldCount = 0;

const Form = ({ name, children }) => {
  fieldCount = React.Children.count(children);
  return (<form name={name}>{children}</form>);
};

describe('Mounted Form', function () {
  const store = new FormStore({ server: { get: function(){}, set: function(){} } }, { email: null, required_date: null, optional_date: null });
  mount(<SchemaForm schema={schemaJson.schema} form={schemaJson.form} model={store} mapper={mapper}><Form name="test" /></SchemaForm>);

  // the password field is not rendered due to its condition depending on non-null email, hence 3 fields, not 4.
  describe('Mounted Child component', function () {
    it('should receive 3 fields as children', () => {
      expect(fieldCount).to.be.equal(3);
    });
  });

  describe('Model Fields when mounted', function () {
    it('should have 3 keys', () => {
      expect(Object.keys(store.fields).length).to.be.equal(3);
    });
  });

  describe('Validate Form', function () {
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
});

describe('Model Fields when unmounted', function () {
  const store = new FormStore({ server: { get: function(){}, set: function(){} } }, { email: null, required_date: null, optional_date: null });
  const mountedForm = mount(<SchemaForm schema={schemaJson.schema} form={schemaJson.form} model={store} mapper={mapper}/>);
  mountedForm.unmount();

  it('should have no keys', () => {
    expect(Object.keys(store.fields).length).to.be.equal(0);
  });
});

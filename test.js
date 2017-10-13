import SimpleSchema from 'simpl-schema';

import { getMockDoc } from './index.js';

const BasicSchema = new SimpleSchema({
  arrayField: {
    type: Array,
  },
  booleanField: {
    type: Boolean,
  },
  dateField: {
    type: Date,
  },
  numberField: {
    type: Number,
  },
  objectField: {
    type: Object,
  },
  stringField: {
    type: String,
  },
});

const BasicSchemaObject = {
  arrayField: [],
  booleanField: true,
  dateField: new Date(67032000),
  numberField: 41349,
  objectField: {},
  stringField: 'mockStringField',
};

const BasicSchemaObjectPrefix = {
  arrayField: [],
  booleanField: false,
  dateField: new Date(13994000),
  numberField: 65696,
  objectField: {},
  stringField: 'prefixStringField',
};

const BasicSchemaWithMock = new SimpleSchema({
  arrayField: {
    type: Array,
    mockValue: ['foo'],
  },
  booleanFieldTrue: {
    type: Boolean,
    defaultValue: true,
  },
  booleanFieldFalse: {
    type: Boolean,
    defaultValue: false,
  },
  dateField: {
    type: Date,
    mockValue: new Date(86400000),
  },
  numberField: {
    type: Number,
    mockValue: 42,
  },
  objectField: {
    type: Object,
    mockValue: { bar: 'baz' },
  },
  stringFieldDefault: {
    type: String,
    defaultValue: 'myValue',
  },
  stringFieldAllowed: {
    type: String,
    allowedValues: ['value1', 'value2;'],
  },
  stringFieldAuto: {
    type: String,
    autoValue() {
      return 'myAutoValue';
    },
  },
});

const BasicSchemaWithMockObject = {
  arrayField: ['foo'],
  booleanFieldTrue: true,
  booleanFieldFalse: false,
  dateField: new Date(86400000),
  numberField: 42,
  objectField: { bar: 'baz' },
  stringFieldDefault: 'myValue',
  stringFieldAllowed: 'value1',
  stringFieldAuto: 'myAutoValue',
};

const NestedSchema = new SimpleSchema({
  arrayField: {
    type: Array,
    mockValue: ['foo'],
  },
  'arrayField.$': {
    type: String,
  },
  arrayFieldSchema: {
    type: Array,
  },
  'arrayFieldSchema.$': {
    type: BasicSchemaWithMock,
  },
  objectField: {
    type: Object,
  },
  'objectField.bar': {
    type: BasicSchema,
  },
});

const NestedSchemaObject = {
  arrayField: ['foo'],
  arrayFieldSchema: [BasicSchemaWithMockObject],
  objectField: {
    bar: BasicSchemaObject,
  },
};

const ComplexSchema = new SimpleSchema({
  arrayField: Array,
  booleanField: Boolean,
  dateField: Date,
  numberField: Number,
  objectField: Object,
  stringField: String,
  schemaField: Object,
  'schemaField.bar': Array,
  'schemaField.bar.$': {
    type: NestedSchema,
  },
  numberFields: Object,
  'numberFields.min': {
    type: Number,
    min: 16,
  },
  'numberFields.max': {
    type: Number,
    max: 8,
  },
  stringFields: Object,
  stringFields: Object,
  'stringFields.Email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'stringFields.EmailWithTLD': {
    type: String,
    regEx: SimpleSchema.RegEx.EmailWithTLD,
  },
  'stringFields.Domain': {
    type: String,
    regEx: SimpleSchema.RegEx.Domain,
  },
  'stringFields.WeakDomain': {
    type: String,
    regEx: SimpleSchema.RegEx.WeakDomain,
  },
  'stringFields.IP': {
    type: String,
    regEx: SimpleSchema.RegEx.IP,
  },
  'stringFields.IPv4': {
    type: String,
    regEx: SimpleSchema.RegEx.IPv4,
  },
  'stringFields.IPv6': {
    type: String,
    regEx: SimpleSchema.RegEx.IPv6,
  },
  'stringFields.Url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  'stringFields.Id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'stringFields.ZipCode': {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode,
  },
  'stringFields.Phone': {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
  },
  'stringFields.mobilePhone': {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
  },
});

const ComplexSchemaObject = {
  arrayField: [],
  booleanField: true,
  dateField: new Date(67032000),
  numberField: 41349,
  objectField: {},
  stringField: 'mockStringField',
  schemaField: {
    bar: [NestedSchemaObject],
  },
  numberFields: {
    min: 16,
    max: 8,
  },
  stringFields: {
    Domain: 'elvis.bizjeremie',
    Email: 'Keaton.Towne@hotmail.com',
    EmailWithTLD: 'Vernice.Pollich@hotmail.com',
    IP: '52.237.195.110',
    IPv4: '151.130.186.60',
    IPv6: '15d2:233e:8ceb:14aa:f453:17f7:3ade:57d7',
    Id: 'ijxd8n0fz6g121gd5',
    Phone: '01239 770849',
    Url: 'https://alyson.com',
    WeakDomain: 'robert.bizcarlie',
    ZipCode: '97747-1949',
    mobilePhone: '07476 677907',
  },
};

describe('getMockDoc', () => {
  it('returns an empty object with no Schema', () => {
    const mockObject = getMockDoc();
    expect(mockObject).toEqual({});
  });

  it('returns an object for a basic Schema', () => {
    const mockObject = getMockDoc(BasicSchema);
    expect(mockObject).toEqual(BasicSchemaObject);
  });

  it('returns an object for a basic Schema with prefix', () => {
    const mockObject = getMockDoc(BasicSchema, 'prefix');
    expect(mockObject).toEqual(BasicSchemaObjectPrefix);
  });

  it('returns an object for a basic Schema with default/mock', () => {
    const mockObject = getMockDoc(BasicSchemaWithMock);
    expect(mockObject).toEqual(BasicSchemaWithMockObject);
  });

  it('returns an object for a nested Schema', () => {
    const mockObject = getMockDoc(NestedSchema);
    expect(mockObject).toEqual(NestedSchemaObject);
  });

  it('returns an object for a complex Schema', () => {
    const mockObject = getMockDoc(ComplexSchema);
    expect(mockObject).toEqual(ComplexSchemaObject);
  });
});

# simpl-schema-mockdoc
Easily create mock document for jest from simpl-schema

## Installation
```
npm install --save-dev simpl-schema-mockdoc
```
## API
#### `getMockDoc(schema, [[prefix], addId])`
- `schema`: an instance of SimpleSchema
- `prefix` (optional): a string to be used as prefix (default `'mock'`)
- `addId` (optional): if `true`, the object will be returned with a Mongo-like `_id` field

Given a schema, `getMockDoc` will generate an object that matches the schema structure, using randomly generated fake data. These values are generated using [faker.js](https://github.com/Marak/faker.js) and use a seed to ensure reproducibility.
The prefix is used to generate the seed and to get the mock value. For example, a `String` field named `foo` would generate the value `mockFoo` by default. Using `getMockDoc(schema, 'myPrefix')`, you would receive `myPrefixFoo`.

`getMockDoc` handles the following options in your field definition (in this order):
- `mockValue`: specify the value you want to avoid random generation
- `defaultValue`
- `autoValue`: will try to use the autoValue function, falling back to the random generation if autoValue fails
- `allowedValues`: will take a random argument in the array

For `Number` fields, the `min` and `max` values will also be looked up before generating a random number.

For `String` fields, the `regEx` value will be used if it matches one of the `SimpleSchema.RegEx.*`

Finally, if your schema contains a field defined by another schema, the function will crawl those as well to generate the document.

**NB**: The function will only run with `NODE_ENV === 'test'`

##### Example
```js
import SimpleSchema from 'simpl-schema';
import { getMockDoc } from 'simpl-schema-mockdoc';

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

const BasicSchemaObject = getMockDoc(BasicSchema);
/*
returns: {
  arrayField: [],
  booleanField: true,
  dateField: new Date(67032000),
  numberField: 41349,
  objectField: {},
  stringField: 'mockStringField',
};
*/

const BasicSchemaObjectPrefix = getMockDoc(BasicSchema, 'prefix');
/*
returns: {
  arrayField: [],
  booleanField: false,
  dateField: new Date(13994000),
  numberField: 65696,
  objectField: {},
  stringField: 'prefixStringField',
};
*/

const BasicSchemaObjectId = getMockDoc(BasicSchema, 'mock', true);
/*
returns: {
  _id: 'a1b2c3d4e5f6g7h8i',
  arrayField: [],
  booleanField: false,
  dateField: new Date(13994000),
  numberField: 65696,
  objectField: {},
  stringField: 'prefixStringField',
};
*/

const NestedSchema = new SimpleSchema({
  objectField: {
    type: Object,
  },
  'objectField.bar': {
    type: BasicSchema,
  },
});

const NestedSchemaObject = getMockDoc(NestedSchema);
/*
returns: {
  objectField: {
    bar: {
      arrayField: [],
      booleanField: true,
      dateField: new Date(67032000),
      numberField: 41349,
      objectField: {},
      stringField: 'mockStringField',
    },
  },
};
*/

```

#### `clearMockValues(schema)`
Used to remove any `mockValue` instance existing in your schema. Will only run with `NODE_ENV !== 'test'`

```js
import SimpleSchema from 'simpl-schema';
import { clearMockValues } from 'simpl-schema-mockdoc';

const BasicSchemaWithMock = new SimpleSchema({
  arrayField: {
    type: Array,
    mockValue: ['foo'],
  },
  booleanField: {
    type: Boolean,
    mockValue: true,
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
  stringField: {
    type: String,
    mockValye: 'myValue',
  },
});

const BasicSchema = clearMockValues(BasicSchemaWithMock);
// BasicSchema is now the one defined above
```

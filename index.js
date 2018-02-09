import _ from 'lodash';
import faker from 'faker';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['mockValue']);

const getMockDoc = (schema, prefix, addId) => {
  const docPrefix = prefix || 'mock';
  const mockDoc = {};
  const seed = _.chain(docPrefix)
    .split('')
    .map(char => char.charCodeAt())
    .sum()
    .value();
  faker.seed(seed);

  if (process.env.NODE_ENV !== 'test' || !schema) {
    return mockDoc;
  }

  _.each(schema._schema, (field, key) => {
    let fieldValue = null;

    // If field defined by parent
    const currentMockValue = _.get(mockDoc, `${key.replace('.$', '.0')}`);
    if (!_.isUndefined(currentMockValue, key)) {
      return;
    }

    const defField = _.get(field, 'type.definitions[0]') || field;

    try {
      if (!_.isUndefined(field.mockValue)) {
        fieldValue = field.mockValue;
      } else if (!_.isUndefined(field.defaultValue)) {
        fieldValue = field.defaultValue;
      } else if (!_.isUndefined(field.autoValue)) {
        fieldValue = field.autoValue.call({ operator: null });
      } else if (_.isArray(defField.allowedValues)) {
        fieldValue = defField.allowedValues[0];
      } else {
        throw new Error('Invalid');
      }
    } catch (err) {
      // Need 'defField' for field like: `key: Boolean`
      const fieldType = defField.type || defField;

      switch (fieldType) {
        case Date:
          fieldValue = new Date(faker.random.number() * 1000);
          break;

        case Number:
        case SimpleSchema.Integer:
          fieldValue = defField.min || defField.max || faker.random.number();
          break;

        case String:
          fieldValue = `${docPrefix}${_.upperFirst(_.camelCase(key))}`;
          if (defField.regEx) {
            switch (String(defField.regEx)) {
              case String(String(SimpleSchema.RegEx.Email)):
              case String(String(SimpleSchema.RegEx.EmailWithTLD)):
                fieldValue = faker.internet.email();
                break;

              case String(SimpleSchema.RegEx.Domain):
              case String(SimpleSchema.RegEx.WeakDomain):
                fieldValue = `${faker.internet.domainName()}${faker.internet.domainWord()}`;
                break;

              case String(SimpleSchema.RegEx.IP):
              case String(SimpleSchema.RegEx.IPv4):
                fieldValue = faker.internet.ip();
                break;

              case String(SimpleSchema.RegEx.IPv6):
                fieldValue = faker.internet.ipv6();
                break;

              case String(SimpleSchema.RegEx.Url):
                fieldValue = faker.internet.url();
                break;

              case String(SimpleSchema.RegEx.Id):
                fieldValue = faker.random.alphaNumeric(17);
                break;

              case String(SimpleSchema.RegEx.ZipCode):
                fieldValue = faker.address.zipCode();
                break;

              case String(SimpleSchema.RegEx.Phone):
                fieldValue = key.match(/mobile/i)
                  ? faker.phone.phoneNumber('074## ######')
                  : faker.phone.phoneNumber('012## ######');
                break;

              default:
                break;
            }
          }
          break;

        case Boolean:
          fieldValue = !_.isUndefined(defField.defaultValue) ? defField.defaultValue : faker.random.boolean();
          break;

        case Object: {
          fieldValue = {};
          break;
        }

        case Array:
          fieldValue = [];
          break;

        default:
          if (fieldType instanceof SimpleSchema || _.get(fieldType, '_schema')) {
            fieldValue = getMockDoc(fieldType, prefix);
          }
          break;
      }
    }

    _.set(mockDoc, key.replace('.$', '.0'), fieldValue);
  });

  if (addId) {
    mockDoc._id = faker.random.alphaNumeric(17);
  }

  return mockDoc;
}

const clearMockValues = schema => {
  if (process.env.NODE_ENV === 'test') {
    return schema;
  }

  _.each(schema._schema, (field, key) => {
    schema._schema[key] = _.omit(field, 'mockValue');
  });
  return schema;
}

export { clearMockValues, getMockDoc }

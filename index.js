import _ from 'lodash';
import SimpleSchema from 'simpl-schema';

exports.getMockDoc = function getMockDoc(schema, prefix) {
  const docPrefix = prefix || 'mock';
  const mockDoc = {};
  if (process.env.NODE_ENV !== 'test') {
    return mockDoc;
  }

  _.each(schema._schema, (field, key) => {
    let fieldValue = null;

    // If field defined by parent
    const currentMockValue = _.get(mockDoc, `${key.replace('.$', '.0')}`);
    if (!_.isUndefined(currentMockValue, key)) {
      return;
    }

    try {
      if (!_.isUndefined(field.mockValue)) {
        fieldValue = field.mockValue;
      } else if (!_.isUndefined(field.defaultValue)) {
        fieldValue = field.defaultValue;
      } else if (_.isArray(field.allowedValues)) {
        fieldValue = field.allowedValues[0];
      } else {
        throw new Error('Invalid');
      }
    } catch (err) {
      // Need 'field' for field like: `key: Boolean`
      const fieldType = field.type || field;

      switch (fieldType) {
        case Date:
          fieldValue = new Date(86400000);
          break;

        case Number:
          fieldValue = field.min || field.max || 42;
          break;

        case String:
          fieldValue = `${docPrefix}${_.upperFirst(_.camelCase(key))}`;
          if (field.regEx) {
            switch (field.regEx) {
              case SimpleSchema.RegEx.Email:
              case SimpleSchema.RegEx.EmailWithTLD:
                fieldValue = 'john.doe@domain.com';
                break;

              case SimpleSchema.RegEx.Domain:
              case SimpleSchema.RegEx.WeakDomain:
                fieldValue = 'domain.com';
                break;

              case SimpleSchema.RegEx.IP:
              case SimpleSchema.RegEx.IPv4:
                fieldValue = '127.0.0.1';
                break;

              case SimpleSchema.RegEx.IPv6:
                fieldValue = '0000:aaaa:1111:bbbb:2222:cccc:3333:dddd';
                break;

              case SimpleSchema.RegEx.Url:
                fieldValue = 'http://www.domain.com';
                break;

              case SimpleSchema.RegEx.Id:
                fieldValue = 'A1b2C3d4E5f6G7h8I';
                break;

              case SimpleSchema.RegEx.ZipCode:
                fieldValue = '12345';
                break;

              case SimpleSchema.RegEx.Phone:
                fieldValue = key.match(/mobile/i) ? '07789 789 123' : '01223 789 123';
                break;

              default:
                break;
            }
          }
          break;

        case Boolean:
          fieldValue = !_.isUndefined(field.defaultValue) ? field.defaultValue : true;
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
            fieldValue = getMockDoc(fieldType);
          }
          break;
      }
    }

    _.set(mockDoc, key.replace('.$', '.0'), fieldValue);
  });

  return mockDoc;
}

exports.getMockDoc = function clearMockValues(schema) {
  if (process.env.NODE_ENV === 'test') {
    return schema;
  }

  _.each(schema._schema, (field, key) => {
    schema._schema[key] = _.omit(field, 'mockValue');
  });
  return schema;
};

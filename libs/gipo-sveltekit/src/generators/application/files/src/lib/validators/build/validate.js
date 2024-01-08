'use strict';
export const todoSchema = validate10;
const schema11 = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    completed: { type: 'boolean' },
  },
  required: ['id', 'title', 'completed'],
};
function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {}
) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      let missing0;
      if (
        (data.id === undefined && (missing0 = 'id')) ||
        (data.title === undefined && (missing0 = 'title')) ||
        (data.completed === undefined && (missing0 = 'completed'))
      ) {
        validate10.errors = [
          {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        if (data.id !== undefined) {
          const _errs1 = errors;
          if (typeof data.id !== 'string') {
            validate10.errors = [
              {
                instancePath: instancePath + '/id',
                schemaPath: '#/properties/id/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              },
            ];
            return false;
          }
          var valid0 = _errs1 === errors;
        } else {
          var valid0 = true;
        }
        if (valid0) {
          if (data.title !== undefined) {
            const _errs3 = errors;
            if (typeof data.title !== 'string') {
              validate10.errors = [
                {
                  instancePath: instancePath + '/title',
                  schemaPath: '#/properties/title/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                },
              ];
              return false;
            }
            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.completed !== undefined) {
              const _errs5 = errors;
              if (typeof data.completed !== 'boolean') {
                validate10.errors = [
                  {
                    instancePath: instancePath + '/completed',
                    schemaPath: '#/properties/completed/type',
                    keyword: 'type',
                    params: { type: 'boolean' },
                    message: 'must be boolean',
                  },
                ];
                return false;
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate10.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        },
      ];
      return false;
    }
  }
  validate10.errors = vErrors;
  return errors === 0;
}
export const todosSchema = validate11;
const schema12 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      completed: { type: 'boolean' },
    },
    required: ['id', 'title', 'completed'],
  },
};
function validate11(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {}
) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (Array.isArray(data)) {
      var valid0 = true;
      const len0 = data.length;
      for (let i0 = 0; i0 < len0; i0++) {
        let data0 = data[i0];
        const _errs1 = errors;
        if (errors === _errs1) {
          if (data0 && typeof data0 == 'object' && !Array.isArray(data0)) {
            let missing0;
            if (
              (data0.id === undefined && (missing0 = 'id')) ||
              (data0.title === undefined && (missing0 = 'title')) ||
              (data0.completed === undefined && (missing0 = 'completed'))
            ) {
              validate11.errors = [
                {
                  instancePath: instancePath + '/' + i0,
                  schemaPath: '#/items/required',
                  keyword: 'required',
                  params: { missingProperty: missing0 },
                  message: "must have required property '" + missing0 + "'",
                },
              ];
              return false;
            } else {
              if (data0.id !== undefined) {
                const _errs3 = errors;
                if (typeof data0.id !== 'string') {
                  validate11.errors = [
                    {
                      instancePath: instancePath + '/' + i0 + '/id',
                      schemaPath: '#/items/properties/id/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    },
                  ];
                  return false;
                }
                var valid1 = _errs3 === errors;
              } else {
                var valid1 = true;
              }
              if (valid1) {
                if (data0.title !== undefined) {
                  const _errs5 = errors;
                  if (typeof data0.title !== 'string') {
                    validate11.errors = [
                      {
                        instancePath: instancePath + '/' + i0 + '/title',
                        schemaPath: '#/items/properties/title/type',
                        keyword: 'type',
                        params: { type: 'string' },
                        message: 'must be string',
                      },
                    ];
                    return false;
                  }
                  var valid1 = _errs5 === errors;
                } else {
                  var valid1 = true;
                }
                if (valid1) {
                  if (data0.completed !== undefined) {
                    const _errs7 = errors;
                    if (typeof data0.completed !== 'boolean') {
                      validate11.errors = [
                        {
                          instancePath: instancePath + '/' + i0 + '/completed',
                          schemaPath: '#/items/properties/completed/type',
                          keyword: 'type',
                          params: { type: 'boolean' },
                          message: 'must be boolean',
                        },
                      ];
                      return false;
                    }
                    var valid1 = _errs7 === errors;
                  } else {
                    var valid1 = true;
                  }
                }
              }
            }
          } else {
            validate11.errors = [
              {
                instancePath: instancePath + '/' + i0,
                schemaPath: '#/items/type',
                keyword: 'type',
                params: { type: 'object' },
                message: 'must be object',
              },
            ];
            return false;
          }
        }
        var valid0 = _errs1 === errors;
        if (!valid0) {
          break;
        }
      }
    } else {
      validate11.errors = [
        {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'array' },
          message: 'must be array',
        },
      ];
      return false;
    }
  }
  validate11.errors = vErrors;
  return errors === 0;
}

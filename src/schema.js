const buildSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    context: { type: 'string' },
    dockerfile: { type: 'string' },
    platforms: { type: 'string' },
    image: { type: 'string' },
    push: { oneOf: [{ type: 'boolean' }, { type: 'string' }] },
    registry: { type: 'string' },
    tags: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            type: { 
              type: 'string',
              enum: ['ref', 'schedule', 'semver', 'match', 'edge', 'raw']
            }
          },
          additionalProperties: true
        },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { 
                type: 'string',
                enum: ['ref', 'schedule', 'semver', 'match', 'edge', 'raw']
              }
            },
            additionalProperties: true
          }
        }
      ]
    },
    flavor: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          additionalProperties: true
        }
      ]
    },
    labels: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  required: ['image'],
  additionalProperties: false
};

const listFormatSchema = {
  type: 'object',
  properties: {
    builds: {
      type: 'array',
      items: buildSchema
    }
  },
  required: ['builds'],
  additionalProperties: false
};

const legacyFormatSchema = {
  type: 'object',
  properties: {
    context: { type: 'string' },
    dockerfile: { type: 'string' },
    platforms: { type: 'string' },
    image: { type: 'string' },
    push: { oneOf: [{ type: 'boolean' }, { type: 'string' }] },
    registry: { type: 'string' },
    tags: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            type: { 
              type: 'string',
              enum: ['ref', 'schedule', 'semver', 'match', 'edge', 'raw']
            }
          },
          additionalProperties: true
        },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { 
                type: 'string',
                enum: ['ref', 'schedule', 'semver', 'match', 'edge', 'raw']
              }
            },
            additionalProperties: true
          }
        }
      ]
    },
    flavor: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          additionalProperties: true
        }
      ]
    },
    labels: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  required: ['image'],
  additionalProperties: true
};

const combinedSchema = {
  oneOf: [
    listFormatSchema,
    legacyFormatSchema
  ]
};

module.exports = {
  buildSchema,
  listFormatSchema,
  legacyFormatSchema,
  combinedSchema
};

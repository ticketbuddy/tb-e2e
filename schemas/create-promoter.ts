import { ObjectSchema, versionSchemas } from '@cypress/schema-tools'

const createPromoterExample = {
  account_id: "acc_6049f70a-8d5c-45f7-ac81-b27c8dc8ca2f",
  description: null,
  promoter_id: "c3dd5253-51c5-4220-8e05-fcedcdab94ef",
  title: "Untitled promoter"
};

const CreatePromoterSchema: ObjectSchema = {
  version: { major: 1, minor: 0, patch: 0, },
  schema: {
    title: 'CreatePromoter',
    type: 'object',
    description: 'CreatePromoter response',
    properties: {
      account_id: {
        type: 'string'
      },
      promoter_id: {
        type: 'string'
      },
      title: {
        type: 'string'
      },
      description: {
        type: ['null', 'string']
      }
    },
    // require all properties
    required: true,
    // do not allow any extra properties
    additionalProperties: false,
  },
  example: createPromoterExample,
}

export const CreatePromoter = versionSchemas(CreatePromoterSchema)

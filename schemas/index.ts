import { SchemaCollection, combineSchemas, bind } from '@cypress/schema-tools'
import { CreatePromoter } from './create-promoter'

const schemas: SchemaCollection = combineSchemas(CreatePromoter)

export const api = bind({ schemas })

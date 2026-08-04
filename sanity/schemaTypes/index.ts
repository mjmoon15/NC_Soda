import { type SchemaTypeDefinition } from 'sanity'

import { product } from './product'
import { repAsset } from './repAsset'
import { video } from './video'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, video, repAsset],
}

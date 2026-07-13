import { withInstall } from '../../utils'
import Tag from './tag.vue'

export type { MgTagEffect, MgTagSize, MgTagType } from './tag.vue'

export const MgTag = withInstall(Tag)
export default MgTag

import { withInstall } from '../../utils'
import Skeleton from './skeleton.vue'
import SkeletonItem from './skeleton-item.vue'

export const MgSkeleton = withInstall(Skeleton)
export const MgSkeletonItem = withInstall(SkeletonItem)
export type { MgSkeletonItemVariant } from './skeleton-item.vue'
export default MgSkeleton

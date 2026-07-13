import { withInstall } from '../../utils'
import Progress from './progress.vue'

export const MgProgress = withInstall(Progress)
export type { MgProgressColor, MgProgressColorStop, MgProgressStatus, MgProgressType } from './progress.vue'
export default MgProgress

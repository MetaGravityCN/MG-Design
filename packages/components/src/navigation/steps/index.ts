import { withInstall } from '../../utils'
import Steps from './steps.vue'

export const MgSteps = withInstall(Steps)
export type { MgStepStatus } from './steps.vue'
export default MgSteps

import { withInstall } from '../utils'
import Form from './form.vue'

export const MgForm = withInstall(Form)
export type { FormInstance, FormRule, FormRules } from './types'
export default MgForm

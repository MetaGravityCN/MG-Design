import { withInstall } from '../../utils'
import Dialog from './dialog.vue'

export type { MgDialogBeforeClose } from './dialog.vue'

export const MgDialog = withInstall(Dialog)
export default MgDialog

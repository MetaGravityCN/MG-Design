import { withInstall } from '../../utils'
import Drawer from './drawer.vue'

export type { MgDrawerBeforeClose, MgDrawerDirection } from './drawer.vue'

export const MgDrawer = withInstall(Drawer)
export default MgDrawer

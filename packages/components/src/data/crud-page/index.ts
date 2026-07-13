import { withInstall } from '../../utils'
import CrudPage from './crud-page.vue'

export const MgCrudPage = withInstall(CrudPage)
export default MgCrudPage

export type { MgCrudColumn, MgCrudPageProps } from './crud-page.vue'

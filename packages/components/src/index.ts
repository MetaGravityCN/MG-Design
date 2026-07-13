import type { App } from 'vue'
export type { FormInstance, FormRule, FormRules } from './form/types'

// ===== Basic Components =====
import { MgButton } from './basic/button'
import { MgIcon } from './basic/icon'
import { MgLink } from './basic/link'
import { MgSpace } from './basic/space'
import { MgDivider } from './basic/divider'
import { MgCard } from './basic/card'
import { MgEmpty } from './basic/empty'
import { MgSkeleton, MgSkeletonItem } from './basic/skeleton'
import { MgImage } from './basic/image'
import { MgScrollbar } from './basic/scrollbar'
import { MgRow } from './basic/row'
import { MgCol } from './basic/col'
import { MgContainer } from './basic/container'
import { MgHeader } from './basic/header'
import { MgAside } from './basic/aside'
import { MgMain } from './basic/main'
import { MgFooter } from './basic/footer'
import { MgCarousel } from './basic/carousel'
import { MgCarouselItem } from './basic/carousel-item'
import { MgCollapse } from './basic/collapse'
import { MgCollapseItem } from './basic/collapse-item'

// ===== Form Components =====
import { MgInput } from './form/input'
import { MgInputNumber } from './form/input-number'
import { MgSelect } from './form/select'
import { MgForm } from './form/form'
import { MgFormItem } from './form/form-item'
import { MgCheckbox, MgCheckboxGroup } from './form/checkbox'
import { MgCheckboxButton } from './form/checkbox-button'
import { MgRadio, MgRadioGroup } from './form/radio'
import { MgRadioButton } from './form/radio-button'
import { MgSwitch } from './form/switch'
import { MgSlider } from './form/slider'
import { MgDatePicker } from './form/date-picker'
import { MgTimePicker } from './form/time-picker'
import { MgColorPicker } from './form/color-picker'
import { MgCascader } from './form/cascader'
import { MgAutocomplete } from './form/autocomplete'
import { MgRate } from './form/rate'
import { MgTransfer } from './form/transfer'
import { MgTreeSelect } from './form/tree-select'
import { MgOption } from './form/option'
import { MgOptionGroup } from './form/option-group'

// ===== Data Components =====
import { MgTable } from './data/table'
import { MgTableColumn } from './data/table-column'
import { MgTag } from './data/tag'
import { MgBadge } from './data/badge'
import { MgProgress } from './data/progress'
import { MgStatistic } from './data/statistic'
import { MgDescriptions } from './data/descriptions'
import { MgDescriptionsItem } from './data/descriptions-item'
import { MgTimeline } from './data/timeline'
import { MgTimelineItem } from './data/timeline-item'
import { MgCalendar } from './data/calendar'
import { MgTree } from './data/tree'
import { MgResult } from './data/result'
import { MgPageHeader } from './data/page-header'
import { MgCountdown } from './data/countdown'
import { MgWatermark } from './data/watermark'
import { MgUpload } from './data/upload'
import { MgPagination } from './data/pagination'
import { MgCrudPage } from './data/crud-page'

// ===== Navigation Components =====
import { MgMenu } from './navigation/menu'
import { MgMenuItem } from './navigation/menu-item'
import { MgSubMenu } from './navigation/sub-menu'
import { MgTabs } from './navigation/tabs'
import { MgTabPane } from './navigation/tab-pane'
import { MgBreadcrumb } from './navigation/breadcrumb'
import { MgBreadcrumbItem } from './navigation/breadcrumb-item'
import { MgSteps } from './navigation/steps'
import { MgStep } from './navigation/step'
import { MgAffix } from './navigation/affix'
import { MgBacktop } from './navigation/backtop'
import { MgDropdown } from './navigation/dropdown'
import { MgDropdownItem } from './navigation/dropdown-item'
import { MgDropdownMenu } from './navigation/dropdown-menu'

// ===== Feedback Components =====
import { MgDialog } from './feedback/dialog'
import { MgDrawer } from './feedback/drawer'
import { MgMessage } from './feedback/message'
import { MgMessageBox } from './feedback/message-box'
import { MgNotification } from './feedback/notification'
import { MgPopconfirm } from './feedback/popconfirm'
import { MgPopover } from './feedback/popover'
import { MgTooltip } from './feedback/tooltip'
import { MgLoading, vLoading } from './feedback/loading'
import { MgInfiniteScroll, MgInfiniteScrollDirective } from './feedback/infinite-scroll'

export {
  // Basic
  MgButton,
  MgIcon,
  MgLink,
  MgSpace,
  MgDivider,
  MgCard,
  MgEmpty,
  MgSkeleton,
  MgSkeletonItem,
  MgImage,
  MgScrollbar,
  MgRow,
  MgCol,
  MgContainer,
  MgHeader,
  MgAside,
  MgMain,
  MgFooter,
  MgCarousel,
  MgCarouselItem,
  MgCollapse,
  MgCollapseItem,
  // Form
  MgInput,
  MgInputNumber,
  MgSelect,
  MgForm,
  MgFormItem,
  MgCheckbox,
  MgCheckboxGroup,
  MgCheckboxButton,
  MgRadio,
  MgRadioGroup,
  MgRadioButton,
  MgSwitch,
  MgSlider,
  MgDatePicker,
  MgTimePicker,
  MgColorPicker,
  MgCascader,
  MgAutocomplete,
  MgRate,
  MgTransfer,
  MgTreeSelect,
  MgOption,
  MgOptionGroup,
  // Data
  MgTable,
  MgTableColumn,
  MgTag,
  MgBadge,
  MgProgress,
  MgStatistic,
  MgDescriptions,
  MgDescriptionsItem,
  MgTimeline,
  MgTimelineItem,
  MgCalendar,
  MgTree,
  MgResult,
  MgPageHeader,
  MgCountdown,
  MgWatermark,
  MgUpload,
  MgPagination,
  MgCrudPage,
  // Navigation
  MgMenu,
  MgMenuItem,
  MgSubMenu,
  MgTabs,
  MgTabPane,
  MgBreadcrumb,
  MgBreadcrumbItem,
  MgSteps,
  MgStep,
  MgAffix,
  MgBacktop,
  MgDropdown,
  MgDropdownItem,
  MgDropdownMenu,
  // Feedback
  MgDialog,
  MgDrawer,
  MgMessage,
  MgMessageBox,
  MgNotification,
  MgPopconfirm,
  MgPopover,
  MgTooltip,
  MgLoading,
  vLoading,
  MgInfiniteScroll,
  MgInfiniteScrollDirective,
}

export default {
  install: (app: App) => {
    // Basic
    app.use(MgButton)
    app.use(MgIcon)
    app.use(MgLink)
    app.use(MgSpace)
    app.use(MgDivider)
    app.use(MgCard)
    app.use(MgEmpty)
    app.use(MgSkeleton)
    app.use(MgSkeletonItem)
    app.use(MgImage)
    app.use(MgScrollbar)
    app.use(MgRow)
    app.use(MgCol)
    app.use(MgContainer)
    app.use(MgHeader)
    app.use(MgAside)
    app.use(MgMain)
    app.use(MgFooter)
    app.use(MgCarousel)
    app.use(MgCarouselItem)
    app.use(MgCollapse)
    app.use(MgCollapseItem)
    // Form
    app.use(MgInput)
    app.use(MgInputNumber)
    app.use(MgSelect)
    app.use(MgForm)
    app.use(MgFormItem)
    app.use(MgCheckbox)
    app.use(MgCheckboxGroup)
    app.use(MgCheckboxButton)
    app.use(MgRadio)
    app.use(MgRadioGroup)
    app.use(MgRadioButton)
    app.use(MgSwitch)
    app.use(MgSlider)
    app.use(MgDatePicker)
    app.use(MgTimePicker)
    app.use(MgColorPicker)
    app.use(MgCascader)
    app.use(MgAutocomplete)
    app.use(MgRate)
    app.use(MgTransfer)
    app.use(MgTreeSelect)
    app.use(MgOption)
    app.use(MgOptionGroup)
    // Data
    app.use(MgTable)
    app.use(MgTableColumn)
    app.use(MgTag)
    app.use(MgBadge)
    app.use(MgProgress)
    app.use(MgStatistic)
    app.use(MgDescriptions)
    app.use(MgDescriptionsItem)
    app.use(MgTimeline)
    app.use(MgTimelineItem)
    app.use(MgCalendar)
    app.use(MgTree)
    app.use(MgResult)
    app.use(MgPageHeader)
    app.use(MgCountdown)
    app.use(MgWatermark)
    app.use(MgUpload)
    app.use(MgPagination)
    app.use(MgCrudPage)
    // Navigation
    app.use(MgMenu)
    app.use(MgMenuItem)
    app.use(MgSubMenu)
    app.use(MgTabs)
    app.use(MgTabPane)
    app.use(MgBreadcrumb)
    app.use(MgBreadcrumbItem)
    app.use(MgSteps)
    app.use(MgStep)
    app.use(MgAffix)
    app.use(MgBacktop)
    app.use(MgDropdown)
    app.use(MgDropdownItem)
    app.use(MgDropdownMenu)
    // Feedback
    app.use(MgDialog)
    app.use(MgDrawer)
    app.use(MgMessageBox)
    app.use(MgPopconfirm)
    app.use(MgPopover)
    app.use(MgTooltip)
    app.use(MgLoading)
    app.use(MgInfiniteScroll)
  },
}

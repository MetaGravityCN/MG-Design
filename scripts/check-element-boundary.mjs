import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const migratedRoots = [
  'packages/primitives',
  'packages/components/src/basic/button',
  'packages/components/src/basic/link',
  'packages/components/src/basic/divider',
  'packages/components/src/basic/space',
  'docs/src/views/components/ComponentButton.vue',
  'docs/src/views/components/ComponentLink.vue',
  'docs/src/views/components/ComponentDivider.vue',
  'docs/src/views/components/ComponentSpace.vue',
  'packages/components/src/basic/row',
  'packages/components/src/basic/col',
  'packages/components/src/basic/container',
  'packages/components/src/basic/header',
  'packages/components/src/basic/aside',
  'packages/components/src/basic/main',
  'packages/components/src/basic/footer',
  'packages/components/src/basic/card',
  'packages/components/src/basic/icon',
  'packages/components/src/data/tag',
  'packages/components/src/data/badge',
  'docs/src/views/components/ComponentGrid.vue',
  'docs/src/views/components/ComponentContainer.vue',
  'docs/src/views/components/ComponentCard.vue',
  'docs/src/views/components/ComponentTag.vue',
  'docs/src/views/components/ComponentBadge.vue',
  'docs/src/views/components/ComponentIcon.vue',
  'packages/components/src/feedback/dialog',
  'packages/components/src/feedback/drawer',
  'docs/src/views/components/ComponentDialog.vue',
  'docs/src/views/components/ComponentDrawer.vue',
  'packages/components/src/feedback/tooltip',
  'packages/components/src/feedback/popover',
  'packages/components/src/feedback/popconfirm',
  'packages/components/src/navigation/dropdown',
  'packages/components/src/navigation/dropdown-menu',
  'packages/components/src/navigation/dropdown-item',
  'docs/src/views/components/ComponentTooltip.vue',
  'docs/src/views/components/ComponentPopover.vue',
  'docs/src/views/components/ComponentPopconfirm.vue',
  'docs/src/views/components/ComponentDropdown.vue',
  'packages/components/src/feedback/message',
  'packages/components/src/feedback/loading',
  'docs/src/views/components/ComponentMessage.vue',
  'docs/src/views/components/ComponentLoading.vue',
  'packages/components/src/basic/empty',
  'packages/components/src/basic/skeleton',
  'packages/components/src/data/progress',
  'packages/components/src/data/statistic',
  'packages/components/src/data/result',
  'packages/components/src/data/timeline',
  'packages/components/src/data/timeline-item',
  'packages/components/src/navigation/breadcrumb',
  'packages/components/src/navigation/breadcrumb-item',
  'packages/components/src/navigation/steps',
  'packages/components/src/navigation/step',
  'docs/src/views/components/ComponentEmpty.vue',
  'docs/src/views/components/ComponentSkeleton.vue',
  'docs/src/views/components/ComponentProgress.vue',
  'docs/src/views/components/ComponentStatistic.vue',
  'docs/src/views/components/ComponentResult.vue',
  'docs/src/views/components/ComponentTimeline.vue',
  'docs/src/views/components/ComponentBreadcrumb.vue',
  'docs/src/views/components/ComponentSteps.vue',
  'packages/components/src/form/form',
  'packages/components/src/form/form-item',
  'packages/components/src/form/input',
  'packages/components/src/form/input-number',
  'packages/components/src/form/form.vue',
  'packages/components/src/form/__tests__',
  'docs/src/views/components/ComponentForm.vue',
  'docs/src/views/components/ComponentInput.vue',
  'docs/src/views/components/ComponentInputNumber.vue',
  'packages/components/src/form/selection-context.ts',
  'packages/components/src/form/checkbox',
  'packages/components/src/form/checkbox-button',
  'packages/components/src/form/radio',
  'packages/components/src/form/radio-button',
  'packages/components/src/form/switch',
  'packages/components/src/form/slider',
  'packages/components/src/form/rate',
  'docs/src/views/components/ComponentCheckbox.vue',
  'docs/src/views/components/ComponentRadio.vue',
  'docs/src/views/components/ComponentSwitch.vue',
  'docs/src/views/components/ComponentSlider.vue',
  'docs/src/views/components/ComponentRate.vue',
  'packages/components/src/form/select-context.ts',
  'packages/components/src/form/select',
  'packages/components/src/form/option',
  'packages/components/src/form/option-group',
  'packages/components/src/form/autocomplete',
  'packages/components/src/form/cascader',
  'packages/components/src/form/tree-select',
  'docs/src/views/components/ComponentSelect.vue',
  'docs/src/views/components/ComponentAutocomplete.vue',
  'docs/src/views/components/ComponentCascader.vue',
  'docs/src/views/components/ComponentTreeSelect.vue',
  'packages/components/src/form/date-picker',
  'packages/components/src/form/time-picker',
  'packages/components/src/form/color-picker',
  'packages/components/src/form/transfer',
  'packages/components/src/data/upload',
  'docs/src/views/components/ComponentDatePicker.vue',
  'docs/src/views/components/ComponentTimePicker.vue',
  'docs/src/views/components/ComponentColorPicker.vue',
  'docs/src/views/components/ComponentTransfer.vue',
  'docs/src/views/components/ComponentUpload.vue',
  'packages/components/src/data/table',
  'packages/components/src/data/table-column',
  'packages/components/src/data/pagination',
  'packages/components/src/data/descriptions',
  'packages/components/src/data/descriptions-item',
  'docs/src/views/components/ComponentTable.vue',
  'docs/src/views/components/ComponentPagination.vue',
  'docs/src/views/components/ComponentDescriptions.vue',
  'packages/components/src/data/tree',
  'packages/components/src/data/calendar',
  'packages/components/src/data/countdown',
  'packages/components/src/data/watermark',
  'docs/src/views/components/ComponentTree.vue',
  'docs/src/views/components/ComponentCalendar.vue',
  'docs/src/views/components/ComponentCountdown.vue',
  'docs/src/views/components/ComponentWatermark.vue',
  'packages/components/src/basic/carousel',
  'packages/components/src/basic/carousel-item',
  'packages/components/src/basic/collapse',
  'packages/components/src/basic/collapse-item',
  'packages/components/src/basic/image',
  'packages/components/src/basic/scrollbar',
  'docs/src/views/components/ComponentCarousel.vue',
  'docs/src/views/components/ComponentCollapse.vue',
  'docs/src/views/components/ComponentImage.vue',
  'docs/src/views/components/ComponentScrollbar.vue',
  'packages/components/src/navigation/menu',
  'packages/components/src/navigation/menu-item',
  'packages/components/src/navigation/sub-menu',
  'packages/components/src/navigation/tabs',
  'packages/components/src/navigation/tab-pane',
  'packages/components/src/navigation/affix',
  'packages/components/src/navigation/backtop',
  'docs/src/views/components/ComponentMenu.vue',
  'docs/src/views/components/ComponentTabs.vue',
  'docs/src/views/components/ComponentAffix.vue',
  'docs/src/views/components/ComponentBacktop.vue',
  'packages/components/src/feedback/infinite-scroll',
  'packages/components/src/feedback/message-box',
  'packages/components/src/feedback/notification',
  'docs/src/views/components/ComponentInfiniteScroll.vue',
  'docs/src/views/components/ComponentMessageBox.vue',
  'docs/src/views/components/ComponentNotification.vue',
]
const ignoredDirectories = new Set(['.deploy', '.git', '.plans', '.qoder', 'node_modules', 'dist', 'coverage'])
const sourceExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.mjs', '.scss', '.ts', '.tsx', '.vue', '.yaml', '.yml'])
const elementPatterns = [
  /element[ -]?plus|@element-plus|<el-|--el-|\.el-|\bel-[a-z]|\belement-loading-/i,
  /\bEl(?!ement)[A-Z]/,
]
const currentFileCeiling = 0
const ignoredFiles = new Set()

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue
    const absolute = join(directory, entry)
    const stats = statSync(absolute)
    if (stats.isDirectory()) walk(absolute, files)
    else if (
      sourceExtensions.has(extname(entry)) &&
      absolute !== fileURLToPath(import.meta.url) &&
      !ignoredFiles.has(relative(root, absolute).split(sep).join('/'))
    ) files.push(absolute)
  }
  return files
}

const references = walk(root).filter((file) => {
  const source = readFileSync(file, 'utf8')
  return elementPatterns.some((pattern) => pattern.test(source))
})
const normalizedReferences = references.map((file) => relative(root, file).split(sep).join('/'))
const migratedViolations = normalizedReferences.filter((file) =>
  migratedRoots.some((directory) => file === directory || file.startsWith(`${directory}/`)),
)

if (migratedViolations.length > 0 || references.length > currentFileCeiling) {
  console.error('Element boundary check failed.')
  if (migratedViolations.length > 0) {
    console.error(`Migrated paths contain Element references:\n${migratedViolations.join('\n')}`)
  }
  if (references.length > currentFileCeiling) {
    console.error(`Reference-bearing files increased: ${references.length} > ${currentFileCeiling}`)
  }
  process.exit(1)
}

console.log(`Element boundary: ${migratedRoots.length} migrated roots are clean; ${references.length}/${currentFileCeiling} legacy files remain.`)

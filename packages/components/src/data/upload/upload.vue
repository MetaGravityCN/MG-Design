<template>
  <div
    v-bind="$attrs"
    :class="classes"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <input
      ref="inputRef"
      class="mg-upload__input"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInput"
    />
    <div
      class="mg-upload__trigger"
      role="button"
      :tabindex="disabled ? -1 : 0"
      @click="selectFiles"
      @keydown.enter.prevent="selectFiles"
      @keydown.space.prevent="selectFiles"
    >
      <slot />
    </div>
    <slot name="tip" />
    <ul v-if="showFileList" :class="['mg-upload__list', `mg-upload__list--${listType}`]">
      <li v-for="file in files" :key="file.uid" :class="['mg-upload__file', `is-${file.status}`]">
        <img v-if="listType !== 'text' && file.url" :src="file.url" :alt="file.name" /><slot
          name="file"
          :file="file"
          ><span class="mg-upload__name">{{ file.name }}</span
          ><progress v-if="file.status === 'uploading'" :value="file.percentage" max="100" /><span
            v-if="file.status === 'success'"
            aria-label="上传成功"
            >✓</span
          ><span v-if="file.status === 'fail'" aria-label="上传失败">!</span></slot
        ><button type="button" aria-label="移除文件" @click="remove(file)">×</button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail'
export interface UploadUserFile {
  name: string
  url?: string
  status?: UploadStatus
  uid?: number
  percentage?: number
  raw?: File
  response?: unknown
}
export interface UploadRequestOptions {
  action: string
  method: string
  data: Record<string, unknown>
  filename: string
  file: File
  headers: Record<string, string>
  withCredentials: boolean
  onProgress: (event: ProgressEvent) => void
  onSuccess: (response: unknown) => void
  onError: (error: Error) => void
}
let uid = 0
defineOptions({ name: 'MgUpload', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    action?: string
    method?: string
    headers?: Record<string, string>
    data?:
      | Record<string, unknown>
      | ((file: File) => Record<string, unknown> | Promise<Record<string, unknown>>)
    name?: string
    withCredentials?: boolean
    multiple?: boolean
    accept?: string
    drag?: boolean
    autoUpload?: boolean
    showFileList?: boolean
    listType?: 'text' | 'picture' | 'picture-card'
    fileList?: UploadUserFile[]
    limit?: number
    disabled?: boolean
    beforeUpload?: (file: File) => boolean | Promise<boolean>
    beforeRemove?: (file: UploadUserFile, files: UploadUserFile[]) => boolean | Promise<boolean>
    httpRequest?: (options: UploadRequestOptions) => unknown
    onPreview?: (file: UploadUserFile) => void
  }>(),
  {
    action: '',
    method: 'post',
    headers: () => ({}),
    data: () => ({}),
    name: 'file',
    autoUpload: true,
    showFileList: true,
    listType: 'text',
    fileList: () => [],
  }
)
const emit = defineEmits<{
  'update:fileList': [files: UploadUserFile[]]
  change: [file: UploadUserFile, files: UploadUserFile[]]
  remove: [file: UploadUserFile, files: UploadUserFile[]]
  success: [response: unknown, file: UploadUserFile, files: UploadUserFile[]]
  error: [error: Error, file: UploadUserFile, files: UploadUserFile[]]
  progress: [event: ProgressEvent, file: UploadUserFile, files: UploadUserFile[]]
  exceed: [files: File[], uploadFiles: UploadUserFile[]]
}>()
const inputRef = ref<HTMLInputElement>()
const files = ref<UploadUserFile[]>(props.fileList.map(normalize))
const dragging = ref(false)
const requests = new Map<number, XMLHttpRequest | { abort?: () => void }>()
const objectUrls = new Set<string>()
const classes = computed(() => [
  'mg-upload',
  props.drag && 'is-drag',
  dragging.value && 'is-dragging',
  props.disabled && 'is-disabled',
  `mg-upload--${props.listType}`,
])
watch(
  () => props.fileList,
  (value) => (files.value = value.map(normalize)),
  { deep: true }
)
function normalize(file: UploadUserFile) {
  return { status: 'ready' as UploadStatus, percentage: 0, uid: ++uid, ...file }
}
function selectFiles() {
  if (!props.disabled) inputRef.value?.click()
}
function onInput(event: Event) {
  const selected = Array.from((event.target as HTMLInputElement).files || [])
  addFiles(selected)
  ;(event.target as HTMLInputElement).value = ''
}
function onDrop(event: DragEvent) {
  dragging.value = false
  if (!props.drag || props.disabled) return
  addFiles(Array.from(event.dataTransfer?.files || []))
}
function addFiles(selected: File[]) {
  if (props.limit && files.value.length + selected.length > props.limit) {
    emit('exceed', selected, files.value)
    return
  }
  selected.forEach((raw) => {
    const file = normalize({
      name: raw.name,
      raw,
      url: raw.type.startsWith('image/') ? URL.createObjectURL(raw) : undefined,
    })
    if (file.url) objectUrls.add(file.url)
    files.value.push(file)
    notify(file)
    if (props.autoUpload) void upload(file)
  })
}
function notify(file: UploadUserFile) {
  emit('update:fileList', [...files.value])
  emit('change', file, [...files.value])
}
async function upload(file: UploadUserFile) {
  if (!file.raw) return
  if (props.beforeUpload && !(await props.beforeUpload(file.raw))) {
    await remove(file)
    return
  }
  file.status = 'uploading'
  notify(file)
  const data = typeof props.data === 'function' ? await props.data(file.raw) : props.data
  const options: UploadRequestOptions = {
    action: props.action,
    method: props.method,
    data,
    filename: props.name,
    file: file.raw,
    headers: props.headers,
    withCredentials: props.withCredentials,
    onProgress: (event) => {
      file.percentage = event.total ? Math.round((event.loaded / event.total) * 100) : 0
      emit('progress', event, file, [...files.value])
    },
    onSuccess: (response) => {
      file.status = 'success'
      file.percentage = 100
      file.response = response
      requests.delete(file.uid!)
      emit('success', response, file, [...files.value])
      notify(file)
    },
    onError: (error) => {
      file.status = 'fail'
      requests.delete(file.uid!)
      emit('error', error, file, [...files.value])
      notify(file)
    },
  }
  if (props.httpRequest) {
    const request = props.httpRequest(options) as { abort?: () => void } | undefined
    if (request) requests.set(file.uid!, request)
    return
  }
  if (!props.action) {
    options.onSuccess(undefined)
    return
  }
  const xhr = new XMLHttpRequest()
  requests.set(file.uid!, xhr)
  xhr.open(props.method.toUpperCase(), props.action, true)
  xhr.withCredentials = props.withCredentials
  Object.entries(props.headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
  xhr.upload.onprogress = options.onProgress
  xhr.onerror = () => options.onError(new Error('上传失败'))
  xhr.onload = () =>
    xhr.status >= 200 && xhr.status < 300
      ? options.onSuccess(parseResponse(xhr.responseText))
      : options.onError(new Error(`上传失败：${xhr.status}`))
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)))
  formData.append(props.name, file.raw)
  xhr.send(formData)
}
function parseResponse(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
async function remove(file: UploadUserFile) {
  if (props.beforeRemove && !(await props.beforeRemove(file, files.value))) return
  requests.get(file.uid!)?.abort?.()
  requests.delete(file.uid!)
  const index = files.value.indexOf(file)
  if (index >= 0) files.value.splice(index, 1)
  if (file.url && objectUrls.has(file.url)) {
    URL.revokeObjectURL(file.url)
    objectUrls.delete(file.url)
  }
  emit('remove', file, [...files.value])
  emit('update:fileList', [...files.value])
}
function submit() {
  files.value.filter((file) => file.status === 'ready').forEach((file) => void upload(file))
}
function abort(file?: UploadUserFile) {
  if (file) requests.get(file.uid!)?.abort?.()
  else requests.forEach((request) => request.abort?.())
}
function clearFiles(statuses: UploadStatus[] = ['ready', 'uploading', 'success', 'fail']) {
  ;[...files.value]
    .filter((file) => statuses.includes(file.status || 'ready'))
    .forEach((file) => void remove(file))
}
function handleStart(raw: File) {
  addFiles([raw])
}
function handleRemove(file: UploadUserFile) {
  return remove(file)
}
onBeforeUnmount(() => {
  abort()
  objectUrls.forEach((url) => URL.revokeObjectURL(url))
})
defineExpose({ abort, submit, clearFiles, handleStart, handleRemove, files })
</script>
<style scoped>
.mg-upload {
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
}
.mg-upload__input {
  display: none;
}
.mg-upload__trigger {
  display: inline-flex;
  cursor: pointer;
}
.mg-upload.is-disabled {
  opacity: 0.6;
}
.mg-upload.is-disabled .mg-upload__trigger {
  cursor: not-allowed;
}
.mg-upload:not(.is-disabled) .mg-upload__trigger:hover { color: var(--mg-color-primary, #0052d9); }
.mg-upload__trigger:focus-visible { border-radius: var(--mg-border-radius-base, 3px); outline: none; box-shadow: var(--mg-focus-ring, 0 0 0 2px #d9e1ff); }
.mg-upload:not(.is-disabled) .mg-upload__trigger:active { color: var(--mg-color-primary-active, #003cab); }
.mg-upload.is-drag {
  display: flex;
  align-items: stretch;
  justify-content: center;
  min-height: 160px;
  padding: 24px;
  border: 1px dashed var(--mg-color-border-dark, #b5b8bf);
  border-radius: 5px;
}
.mg-upload.is-drag.is-dragging {
  background: var(--mg-color-primary-light-9, #f2f3ff);
  border-color: var(--mg-color-primary, #0052d9);
}
.mg-upload__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.mg-upload__file {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  color: var(--mg-color-text-regular, #424a57);
}
.mg-upload__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mg-upload__file button {
  cursor: pointer;
  background: none;
  border: 0;
}
.mg-upload__file button:hover { color: var(--mg-color-danger, #d54941); }
.mg-upload__file button:focus-visible { border-radius: 2px; outline: none; box-shadow: var(--mg-focus-ring-danger, 0 0 0 2px #fff0ed); }
.mg-upload__file.is-success {
  color: var(--mg-color-success, #2ba471);
}
.mg-upload__file.is-fail {
  color: var(--mg-color-danger, #d54941);
}
.mg-upload__file img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 3px;
}
.mg-upload__list--picture-card {
  flex-flow: row wrap;
}
.mg-upload__list--picture-card .mg-upload__file {
  position: relative;
  width: 96px;
  height: 96px;
  border: 1px solid var(--mg-color-border, #dcdde1);
  border-radius: 4px;
}
.mg-upload__list--picture-card .mg-upload__file img {
  width: 100%;
  height: 100%;
}
</style>

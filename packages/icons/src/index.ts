import { defineComponent, h, type PropType } from 'vue'
export const iconPaths = {
  House: 'M3 11.2 12 3l9 8.2V21h-6v-6H9v6H3v-9.8Z',
  User: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0H4Z',
  Setting: 'M10.8 2h2.4l.5 2.1 1.5.6L17 3.5l1.7 1.7-1.2 1.8.6 1.5 2.1.5v2.4l-2.1.5-.6 1.5 1.2 1.8-1.7 1.7-1.8-1.2-1.5.6-.5 2.1h-2.4l-.5-2.1-1.5-.6-1.8 1.2-1.7-1.7L6.5 15l-.6-1.5-2.1-.5v-2.4l2.1-.5.6-1.5-1.2-1.8L7 5.1l1.8 1.2 1.5-.6.5-2.1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  Search: 'M10.5 3a7.5 7.5 0 1 0 4.7 13.3L20 21l1-1-4.7-4.8A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
  Edit: 'm4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5ZM17 3l4 4-1.5 1.5-4-4L17 3Z',
  Check: 'm9.5 18-6-6 1.8-1.8 4.2 4.2 9.2-9.2 1.8 1.8-11 11Z',
  Star: 'm12 2.5 3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.2-6 3.2 1.2-6.7-4.9-4.7 6.7-1 3-6.1Z',
  Delete: 'M7 7h2v11H7V7Zm4 0h2v11h-2V7Zm4 0h2v11h-2V7ZM5 4h14v2H5V4Zm3-2h8l1 2H7l1-2ZM6 20h12v2H6v-2Z',
  ArrowDown: 'm5 8 7 7 7-7H5Z',
  Plus: 'M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z',
  UploadFilled: 'M12 3 6 9h4v6h4V9h4l-6-6ZM5 18h14v3H5v-3Z',
  ArrowLeft: 'm14.7 5.3-1.4-1.4L5.2 12l8.1 8.1 1.4-1.4L9 13h11v-2H9l5.7-5.7Z',
  ArrowRight: 'm9.3 18.7 1.4 1.4 8.1-8.1-8.1-8.1-1.4 1.4L15 11H4v2h11l-5.7 5.7Z',
  Avatar: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0H4Z',
  Bell: 'M18 16v-5a6 6 0 0 0-5-5.9V3h-2v2.1A6 6 0 0 0 6 11v5l-2 2h16l-2-2Zm-8 3h4a2 2 0 0 1-4 0Z',
  ChatLineSquare: 'M4 4h16v13H8l-4 4V4Zm2 2v10.2L7.2 15H18V6H6Zm2 3h8v2H8V9Z',
  Checked: 'M4 4h16v16H4V4Zm2 2v12h12V6H6Zm3 5 2 2 4-4 1.4 1.4-5.4 5.4-3.4-3.4L9 11Z',
  CircleCheck: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 10.2-2.6-2.6L7 13l4 4 6-6-1.4-1.4-4.6 4.6Z',
  CircleCheckFilled: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 15-4-4 1.4-1.4 2.6 2.6 4.6-4.6L17 11l-6 6Z',
  CircleClose: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.5 13.5L12 13.4l-3.5 3.5-1.4-1.4 3.5-3.5-3.5-3.5 1.4-1.4 3.5 3.5 3.5-3.5 1.4 1.4-3.5 3.5 3.5 3.5-1.4 1.4Z',
  Connection: 'M5 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm14 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM5 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm13-4h2v3h-2v-3ZM7 6h10v2H7V6Zm-1 4h2v5H6v-5Zm2 9h9v2H8v-2Z',
  CreditCard: 'M3 5h18v14H3V5Zm2 2v2h14V7H5Zm0 5v5h14v-5H5Zm2 2h5v2H7v-2Z',
  DataAnalysis: 'M4 20V9h3v11H4Zm6 0V4h3v16h-3Zm6 0v-7h3v7h-3Z',
  Document: 'M5 2h10l4 4v16H5V2Zm2 2v16h10V8h-4V4H7Zm2 7h6v2H9v-2Zm0 4h6v2H9v-2Z',
  DocumentAdd: 'M5 2h10l4 4v7h-2V8h-4V4H7v16h5v2H5V2Zm11 12h2v3h3v2h-3v3h-2v-3h-3v-2h3v-3Z',
  DocumentChecked: 'M5 2h10l4 4v16H5V2Zm2 2v16h10V8h-4V4H7Zm2 10 2 2 4-4 1.4 1.4-5.4 5.4L7.6 15.4 9 14Z',
  Download: 'M11 3h2v10l3.5-3.5 1.4 1.4L12 16.8 6.1 11l1.4-1.4L11 13V3ZM4 19h16v2H4v-2Z',
  EditPen: 'm4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5ZM17 3l4 4-1.5 1.5-4-4L17 3Z',
  Expand: 'M4 4h7v2H7.4l4.3 4.3-1.4 1.4L6 7.4V11H4V4Zm16 16h-7v-2h3.6l-4.3-4.3 1.4-1.4 4.3 4.3V13h2v7Z',
  Files: 'M7 2h9l4 4v13h-3v3H4V5h3V2Zm2 2v13h9V8h-4V4H9ZM6 7v13h9v-1H7V7H6Z',
  Fold: 'M3 6h18v2H3V6Zm0 5h12v2H3v-2Zm0 5h18v2H3v-2Zm14-6 4 3-4 3v-6Z',
  Folder: 'M3 5h7l2 2h9v12H3V5Zm2 4v8h14V9H5Z',
  Hide: 'm4.3 3 16.7 16.7-1.3 1.3-3-3A11.7 11.7 0 0 1 12 19C6.5 19 3 12 3 12a18 18 0 0 1 3.4-4.3L3 4.3 4.3 3Zm3.5 6.1A13 13 0 0 0 5.3 12c.9 1.5 3.3 5 6.7 5 1.1 0 2.1-.3 3-.7l-1.6-1.6A4 4 0 0 1 9.3 10.6L7.8 9.1ZM12 5c5.5 0 9 7 9 7a18 18 0 0 1-2.6 3.5L17 14.1a13 13 0 0 0 1.7-2.1c-.9-1.5-3.3-5-6.7-5-.5 0-1 .1-1.4.2L9 5.6c1-.4 2-.6 3-.6Z',
  Histogram: 'M3 20h18v2H3v-2Zm2-2V8h3v10H5Zm5 0V3h3v15h-3Zm5 0v-7h3v7h-3Z',
  HomeFilled: 'M3 11.2 12 3l9 8.2V21h-6v-6H9v6H3v-9.8Z',
  InfoFilled: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5h2v2h-2V7Zm0 4h2v6h-2v-6Z',
  Iphone: 'M7 2h10v20H7V2Zm2 2v14h6V4H9Zm2 15h2v1h-2v-1Z',
  List: 'M4 5h3v3H4V5Zm5 0h11v2H9V5Zm-5 6h3v3H4v-3Zm5 0h11v2H9v-2Zm-5 6h3v3H4v-3Zm5 0h11v2H9v-2Z',
  Location: 'M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 2a5 5 0 0 1 5 5c0 3.2-3.2 7.7-5 10.1C10.2 16.7 7 12.2 7 9a5 5 0 0 1 5-5Zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  Lock: 'M6 10V7a6 6 0 0 1 12 0v3h2v12H4V10h2Zm2 0h8V7a4 4 0 0 0-8 0v3Zm-2 2v8h12v-8H6Z',
  Management: 'M7 2h10v3h3v17H4V5h3V2Zm2 2v2h6V4H9ZM6 7v13h12V7h-1v1H7V7H6Zm3 4h6v2H9v-2Zm0 4h6v2H9v-2Z',
  Medal: 'M7 2h4l1 4 1-4h4l-2 7a6 6 0 1 1-6 0L7 2Zm3.7 6h2.6l1.1-4h-1l-1.4 5-1.4-5h-1l1.1 4ZM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2 1 2 2 .3-1.5 1.5.4 2.2-1.9-1-1.9 1 .4-2.2L9 14.3l2-.3 1-2Z',
  Memo: 'M4 3h16v18H4V3Zm2 2v14h12V5H6Zm3 3h6v2H9V8Zm0 4h6v2H9v-2Zm0 4h4v2H9v-2Z',
  Monitor: 'M3 3h18v14H3V3Zm2 2v10h14V5H5Zm4 14h6v2H9v-2Z',
  OfficeBuilding: 'M5 2h10v5h4v15H5V2Zm2 2v16h2v-3h2v3h2V4H7Zm8 5v11h2V9h-2ZM9 6h2v2H9V6Zm0 4h2v2H9v-2Z',
  Picture: 'M3 4h18v16H3V4Zm2 2v12h14V6H5Zm2 9 3-3 2 2 3-4 3 5H7Zm1-6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z',
  Promotion: 'M3 11 21 3l-5 18-4-7-9-3Zm4.5-.5 5.5 2 2 3 2.8-9.5-10.3 4.5Z',
  QuestionFilled: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 15h-2v-2h2v2Zm2-7.5c0 1.2-.7 1.8-1.4 2.3-.6.4-.6.6-.6 1.2h-2c0-1.4.5-2 1.4-2.6.5-.4.6-.6.6-1 0-.8-.6-1.4-1.5-1.4S9 8.6 9 9.5H7c0-2 1.5-3.5 3.5-3.5S14 7.4 14 9.5Z',
  Refresh: 'M17.7 6.3A8 8 0 1 0 19.9 14h-2.1A6 6 0 1 1 16.3 7.7L13 11h8V3l-3.3 3.3Z',
  SwitchButton: 'M11 2h2v10h-2V2Zm5.7 3.3A9 9 0 1 1 7.3 5.3l1.1 1.6a7 7 0 1 0 7.2 0l1.1-1.6Z',
  Tickets: 'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Zm2 2v2a4 4 0 0 1 0 6v2h14v-2a4 4 0 0 1 0-6V7H5Zm7 1h2v2h-2V8Zm0 4h2v2h-2v-2Zm0 4h2v1h-2v-1Z',
  Tools: 'M14.7 6.3a5 5 0 0 0-6-4.8l3 3-2.2 2.2-3-3a5 5 0 0 0 6.3 6.3l7.2 7.2a2 2 0 0 1-2.8 2.8L10 12.8a5 5 0 0 0 4.7-6.5Z',
  UserFilled: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0H4Z',
  View: 'M12 5c5.5 0 9 7 9 7s-3.5 7-9 7-9-7-9-7 3.5-7 9-7Zm0 2c-3.4 0-5.8 3.5-6.7 5 .9 1.5 3.3 5 6.7 5s5.8-3.5 6.7-5c-.9-1.5-3.3-5-6.7-5Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z',
  Warning: 'M12 2 1 21h22L12 2Zm0 4 7.5 13h-15L12 6Zm-1 4v5h2v-5h-2Zm0 6v2h2v-2h-2Z',
} as const

export type MgIconName = keyof typeof iconPaths

function createIcon(name: MgIconName) {
  return defineComponent({
    name,
    props: {
      size: [String, Number] as PropType<string | number>,
      color: String,
      title: String,
    },
    setup(props, { attrs }) {
      return () => h('svg', {
        ...attrs,
        viewBox: '0 0 24 24',
        width: props.size || '1em',
        height: props.size || '1em',
        fill: props.color || 'currentColor',
        role: props.title ? 'img' : undefined,
        'aria-label': props.title,
        'aria-hidden': props.title ? undefined : 'true',
      }, [props.title ? h('title', props.title) : null, h('path', { d: iconPaths[name] })])
    },
  })
}

export const House = createIcon('House')
export const User = createIcon('User')
export const Setting = createIcon('Setting')
export const Search = createIcon('Search')
export const Edit = createIcon('Edit')
export const Check = createIcon('Check')
export const Star = createIcon('Star')
export const Delete = createIcon('Delete')
export const ArrowDown = createIcon('ArrowDown')
export const Plus = createIcon('Plus')
export const UploadFilled = createIcon('UploadFilled')
export const ArrowLeft = createIcon('ArrowLeft')
export const ArrowRight = createIcon('ArrowRight')
export const Avatar = createIcon('Avatar')
export const Bell = createIcon('Bell')
export const ChatLineSquare = createIcon('ChatLineSquare')
export const Checked = createIcon('Checked')
export const CircleCheck = createIcon('CircleCheck')
export const CircleCheckFilled = createIcon('CircleCheckFilled')
export const CircleClose = createIcon('CircleClose')
export const Connection = createIcon('Connection')
export const CreditCard = createIcon('CreditCard')
export const DataAnalysis = createIcon('DataAnalysis')
export const Document = createIcon('Document')
export const DocumentAdd = createIcon('DocumentAdd')
export const DocumentChecked = createIcon('DocumentChecked')
export const Download = createIcon('Download')
export const EditPen = createIcon('EditPen')
export const Expand = createIcon('Expand')
export const Files = createIcon('Files')
export const Fold = createIcon('Fold')
export const Folder = createIcon('Folder')
export const Hide = createIcon('Hide')
export const Histogram = createIcon('Histogram')
export const HomeFilled = createIcon('HomeFilled')
export const InfoFilled = createIcon('InfoFilled')
export const Iphone = createIcon('Iphone')
export const List = createIcon('List')
export const Location = createIcon('Location')
export const Lock = createIcon('Lock')
export const Management = createIcon('Management')
export const Medal = createIcon('Medal')
export const Memo = createIcon('Memo')
export const Monitor = createIcon('Monitor')
export const OfficeBuilding = createIcon('OfficeBuilding')
export const Picture = createIcon('Picture')
export const Promotion = createIcon('Promotion')
export const QuestionFilled = createIcon('QuestionFilled')
export const Refresh = createIcon('Refresh')
export const SwitchButton = createIcon('SwitchButton')
export const Tickets = createIcon('Tickets')
export const Tools = createIcon('Tools')
export const UserFilled = createIcon('UserFilled')
export const View = createIcon('View')
export const Warning = createIcon('Warning')

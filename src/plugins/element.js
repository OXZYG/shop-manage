import Vue from 'vue'
// import { Button } from 'element-ui'
// // 按需导入
// import { Form,FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹框提示组件Message
// import { Message } from 'element-ui'

import { Button,Form,FormItem,Input,Message,
  Container,Header,Aside,Main,Menu,Submenu,MenuItem, MenuItemGroup,
  Breadcrumb,BreadcrumbItem,Card,
  Row,Col,Table,TableColumn,
  Switch,Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,Option,
  Cascader,
  Alert,
  Tabs,TabPane,
  Step,Steps,
  Checkbox,CheckboxGroup,
  Upload,
  Timeline,TimelineItem} from 'element-ui'
import { options } from 'less'

// 注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


// 全局挂载 $message自定义名字,每一个组件都可以通过this来访问到
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

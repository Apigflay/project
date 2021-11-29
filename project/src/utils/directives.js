import store from '../store'
import Vue from 'vue'


//实现按钮级别权限的自定义指令 v-action
Vue.directive('action', {
  inserted(el, binding) {
    const { value } = binding
    const role = store.getters && store.getters.role
    if (value && value instanceof Array && value.length > 0) {
      if (!value.includes(role)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
})


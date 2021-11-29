import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false })

const whiteList = ['login', 'register', 'register-mobile', 'create-qrcode', 'operation-interface']

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN)) {
    if (to.path === '/user/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (JSON.stringify(store.getters.userinfo) === "{}") {
        store.dispatch('GetUserinfo')
          .then(() => {
            store.dispatch('GetRealPointList')
            store.dispatch('GetRealEventList')
            // store.commit('SET_USERINFO','有信息了')
            store.dispatch('GenerateRoutes').then(() => {
              console.log(store.getters.addRouters)
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (redirect === to.path) {
                next({ ...to, replace: true })
              }
              else {
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }

    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

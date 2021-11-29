<template>
  <div class="user-wrapper">
    <div class="content-box">
      <notice-icon class="action" />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" icon="user" />
          <span>{{ userinfo.username }}</span>
        </span>

        <a-menu slot="overlay" class="user-dropdown-menu-wrapper" style="width:110px;">
          <a-menu-item key="0" style="width:110px;">
            <router-link :to="{ name: 'person-set-nb' }">
              <a-icon type="user" />
              <span>个人设置</span>
            </router-link>
          </a-menu-item>

          <a-menu-divider />

          <a-menu-item key="2" style="width:110px;">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="poweroff" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },

  computed: {
    ...mapGetters(['userinfo'])
  },
  methods: {
    ...mapActions(['Logout']),

    handleLogout() {
      const that = this

      this.$confirm({
        title: '确定退出登录吗？',
        // content: '真的要退出登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    }
  }
}
</script>


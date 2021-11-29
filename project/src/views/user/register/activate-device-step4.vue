<template>
  <div>
    <a-form style="margin: 80px auto 0;">
      <result
        :title="registerState() === 'success'?'激活成功':'激活失败'"
        :type="registerState() === 'success'?'success':'error'"
        style="max-width: 400px;"
      >
        <div slot="action">
          <a-row v-if="registerState() === 'success'" :gutter="16" style="margin-top:90px">
            <a-col :span="12">
              <a-button type="primary" size="large" block @click="clickLogin">登录账号</a-button>
            </a-col>
            <a-col :span="12">
              <a-button size="large" block @click="finish">激活其他设备</a-button>
            </a-col>
          </a-row>

          <a-row v-else :gutter="16" style="margin-top:90px">
            <a-col :span="24">
              <a-button size="large" block @click="finish">激活其他设备</a-button>
            </a-col>
          </a-row>
        </div>
      </result>
    </a-form>
  </div>
</template>

<script>
import { Result } from '@/components'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Step3',

  components: {
    Result
  },

  props: ['form'],

  data() {
    return {
      loading: false
    }
  },

  methods: {
    ...mapActions(['Login', 'Logout']),
    ...mapGetters(['registerState']),

    finish() {
      this.$emit('finish')
    },

    clickLogin() {
      this.Login({ username: this.form.username, password: this.form.password })
        .then(res => {
          this.loginSuccess()
        })
        .catch(err => {
          this.requestFailed(err)
        })
    },

    loginSuccess() {
      this.$router.push({ name: 'point-data' })
    },

    requestFailed(err) {
      this.$notification['error']({
        message: '错误',
        description: err.Msg || '请求出现错误，请稍后再试'
      })
    }
  }
}
</script>

<template>
  <div class="main">
    <div class="header">
      <a href="/">
        <img src="../../../../public/logo.png" class="logo" alt="logo" />
        <span class="title">噪声监测平台</span>
      </a>
    </div>

    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form">
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change'}
              ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
          @keyup.enter="handleSubmit"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item class="checkbox-row">
        <a-row type="flex" justify="space-between">
          <a-checkbox v-decorator="['rememberMe',{valuePropName: 'checked'}]">自动登录</a-checkbox>
          <!-- <div>
            <span class="forget-password" @click="$router.push({name:'register'})">激活设备</span>
            <a-divider type="vertical" />
            <span class="forget-password" @click="modalVisible = true">忘记密码</span>
          </div> -->
        </a-row>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          class="login-button"
          :loading="loading"
          :disabled="loading"
          @click="handleSubmit"
        >登录</a-button>
      </a-form-item>
    </a-form>

    <forget-password-modal :visible.sync="modalVisible"></forget-password-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ForgetPasswordModal from '@/views/user/login/forget-password-modal'
export default {
  components: { ForgetPasswordModal },

  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      modalVisible: false
    }
  },

  methods: {
    ...mapActions(['Login']),

    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.Login(values)
            .then(res => {
              this.$router.push({ path: '/' })
            })
            .finally(() => {
              setTimeout(() => {
                this.loading = false
              }, 500)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  padding-top: 150px;
  .header {
    height: 44px;
    line-height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;

    .badge {
      position: absolute;
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
      margin-left: -12px;
      margin-top: -10px;
      opacity: 0.8;
    }

    .logo {
      margin-right: 10px;
      border-style: none;
      width: 70px;
    }

    .title {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.85);
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 4px;
    }
  }
  .user-layout-login {
    margin-top: 60px;
    label {
      font-size: 14px;
    }

    .forget-password {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #1bd39b;
      // float: right;
      cursor: pointer;
      padding: 0;
      user-select: none;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1bd39b;
        }
      }

      .register {
        float: right;
      }
    }
  }
}
</style>

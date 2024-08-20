<!--
 * @Author: 秦少卫
 * @Date: 2024-04-24 12:51:24
 * @LastEditors: June
 * @LastEditTime: 2024-07-24 19:37:40
 * @Description: 登录
-->

<template>
  <div class="box">
    <!-- 登录后 -->
    <el-dropdown v-if="userName" @command="logoutHandle">
      <el-button link>
        {{ userName }}
        <SvgIcon :style="{ width: '20px', height: '20px' }" name="mine" />
      </el-button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 登录前 -->
    <el-button v-else shape="circle" text :icon="User" @click="modal = true" />

    <!-- 登录注册弹框 -->
    <el-dialog v-model="modal" width="500px" footer-hide>
      <h3>{{ $t('login.title') }}</h3>
      <el-tabs :animated="false" @on-click="switchTab">
        <!-- 登录 -->
        <el-tab-pane :label="$t('login.login')">
          <el-form ref="loginForm" :model="formInline" :rules="ruleInline" class="form-box">
            <el-form-item prop="identifier">
              <el-input
                type="text"
                v-model="formInline.identifier"
                :placeholder="$t('login.identifier')"
              >
                <template #prepend>
                  <el-button text :icon="User" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="formInline.password"
                :placeholder="$t('login.password')"
              >
                <template #prepend>
                  <el-button text :icon="Lock" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%" type="primary" @click="loginHandle">
                {{ $t('login.login') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 注册 -->
        <el-tab-pane :label="$t('login.register')">
          <el-form
            ref="registerForm"
            :model="registerFormInline"
            :rules="registerRuleInline"
            class="form-box"
          >
            <el-form-item prop="username">
              <el-input
                type="text"
                v-model="registerFormInline.username"
                :placeholder="$t('login.username')"
              >
                <template #prepend>
                  <el-button text :icon="User" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                type="text"
                v-model="registerFormInline.email"
                :placeholder="$t('login.email')"
              >
                <template #prepend>
                  <el-button text :icon="Message" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="registerFormInline.password"
                :placeholder="$t('login.password')"
              >
                <template #prepend>
                  <el-button text :icon="Lock" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%" type="primary" long @click="registerHandle">
                {{ $t('login.register') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup name="Login">
import { useI18n } from 'vue-i18n'
import { getUserInfo, setToken, login, register, logout } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'

const modal = ref(false)
const { t } = useI18n()
const userName = ref('')
// 获取用户详情
getUserInfo()
  .then((res) => {
    userName.value = res.data.username
  })
  .catch(() => {
    logout()
  })

const reloadPage = () => {
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}
// 退出
const logoutHandle = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm(t('login.logoutTip')).then(() => {
      logout()
      ElMessage.success(t('login.logoutSuccessTip'))
      reloadPage()
    })
  }
}
// 登录逻辑 ------------------
const formInline = reactive({
  identifier: '',
  password: ''
})
const ruleInline = reactive({
  identifier: [{ required: true, message: t('login.identifierValidate'), trigger: 'blur' }],
  password: [
    { required: true, message: t('login.passwordValidate'), trigger: 'blur' },
    {
      type: 'string',
      min: 6,
      message: t('login.passwordValidate'),
      trigger: 'blur'
    }
  ]
})
const loginForm = ref(null)

const loginHandle = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      login(formInline)
        .then((res) => {
          setToken(res.data.jwt)
          ElMessage.success(t('login.welcome'))
          reloadPage()
        })
        .catch((res) => {
          ElMessage.error(res.response.data.error.message)
        })
    }
  })
}

// 注册逻辑 分割线--------------------
const registerFormInline = reactive({
  username: '',
  password: '',
  email: ''
})
const registerRuleInline = reactive({
  username: [{ required: true, message: t('login.identifierValidate'), trigger: 'blur' }],
  password: [
    { required: true, message: t('login.passwordValidate'), trigger: 'blur' },
    {
      type: 'string',
      min: 6,
      message: t('login.passwordValidate'),
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: t('login.emailValidate'), trigger: 'blur' },
    {
      type: 'email',
      message: t('login.emailValidate'),
      trigger: 'blur'
    }
  ]
})
const registerForm = ref(null)

const registerHandle = () => {
  registerForm.value.validate((valid) => {
    if (valid) {
      register(registerFormInline)
        .then((res) => {
          setToken(res.data.jwt)
          ElMessage.success(t('login.welcome'))
          reloadPage()
        })
        .catch((res) => {
          ElMessage.error(res.response.data.error.message)
        })
    }
  })
}

const switchTab = () => {
  registerForm.value && registerForm.value.resetFields()
  loginForm.value && loginForm.value.resetFields()
}
</script>
<style scoped lang="scss">
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-box {
  padding-top: 10px;
}
h3 {
  margin: 0;
}
</style>

<template>
  <Toast position="top-center" />

  <div
    class="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 bg-gray-100 dark:bg-gray-900"
  >
    <div class="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop"
        class="w-full h-full object-cover transition-transform duration-[60s] hover:scale-110 ease-linear"
        alt="Farm Background"
      />
      <div
        class="absolute inset-0 bg-gray-900/50 dark:bg-black/80 backdrop-blur-[2px] transition-colors duration-500"
      ></div>
    </div>

    <div
      class="relative z-10 w-full max-w-[460px] h-[640px] bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden flex flex-col transition-colors duration-500"
    >
      <div class="pt-8 pb-4 flex flex-col items-center shrink-0">
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-br   flex items-center justify-center text-white shadow-lg mb-3"
        >
          <img :src="favicon" alt="icon" class="w-8 h-8 object-contain" />
        </div>
        <h1 class="text-2xl font-black text-gray-800 dark:text-white tracking-tight">田间助手</h1>
      </div>

      <div class="px-8 mb-4 shrink-0">
        <div class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            v-for="tab in ['login', 'register']"
            :key="tab"
            @click="switchTab(tab)"
            class="flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300"
            :class="
              currentTab === tab
                ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
            "
          >
            {{ tab === 'login' ? '账号登录' : '新用户注册' }}
          </button>
        </div>
      </div>

      <div class="px-8 flex-1 flex flex-col justify-center pb-8 overflow-y-auto custom-scrollbar">
        <Transition name="fade" mode="out-in">
          <form
            v-if="currentTab === 'login'"
            key="login"
            @submit.prevent="handleLogin"
            class="flex flex-col gap-5 w-full"
          >
            <div class="space-y-1.5">
              <label :class="labelClass">手机号码</label>
              <input
                v-model="loginForm.phone"
                type="text"
                maxlength="11"
                placeholder="请输入11位手机号"
                :class="inputClass"
              />
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center px-1">
                <label :class="labelClass">登录密码</label>
                <span
                  @click="showForgot = true"
                  class="text-xs text-green-600 cursor-pointer hover:underline font-medium"
                  >忘记密码?</span
                >
              </div>
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :class="inputClass"
              />
            </div>

            <div class="space-y-1.5">
              <label :class="labelClass">验证码</label>
              <div class="grid grid-cols-12 gap-3">
                <input
                  v-model="loginForm.code"
                  type="text"
                  placeholder="输入字符"
                  :class="inputClass + ' col-span-7'"
                />
                <div
                  class="col-span-5 h-[48px] bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:opacity-80 transition-opacity"
                  @click="fetchCaptcha('login')"
                  v-html="loginCaptcha.svg"
                  title="点击刷新"
                ></div>
              </div>
            </div>

            <button
              :disabled="loading"
              :class="btnClass"
              class="bg-green-600 text-white mt-4 hover:bg-green-700"
            >
              <i v-if="loading" class="pi pi-spinner animate-spin mr-2"></i>
              立即登录
            </button>
          </form>

          <form
            v-else
            key="register"
            @submit.prevent="handleRegister"
            class="flex flex-col gap-4 w-full"
          >
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label :class="labelClass">您的称呼</label>
                <input
                  v-model="registerForm.name"
                  type="text"
                  placeholder="如: 张大伯"
                  :class="inputClass"
                />
              </div>

              <div class="space-y-1.5">
                <label :class="labelClass">手机号码</label>
                <input
                  v-model="registerForm.phone"
                  type="text"
                  maxlength="11"
                  placeholder="11位手机号"
                  :class="inputClass"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label :class="labelClass">设置密码</label>
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="6位+字母数字"
                :class="inputClass"
              />
            </div>

            <div class="space-y-1.5">
              <label :class="labelClass">确认密码</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="再次输入以确认"
                :class="inputClass"
              />
            </div>

            <div class="space-y-1.5">
              <label :class="labelClass">验证码</label>
              <div class="grid grid-cols-12 gap-3">
                <input
                  v-model="registerForm.code"
                  type="text"
                  placeholder="输入字符"
                  :class="inputClass + ' col-span-7'"
                />
                <div
                  class="col-span-5 h-[48px] bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:opacity-80 transition-opacity"
                  @click="fetchCaptcha('register')"
                  v-html="registerCaptcha.svg"
                  title="点击刷新"
                ></div>
              </div>
            </div>

            <button
              :disabled="loading"
              :class="btnClass"
              class="bg-green-600 text-white mt-2 hover:bg-green-700"
            >
              <i v-if="loading" class="pi pi-spinner animate-spin mr-2"></i>
              注册并登录
            </button>
          </form>
        </Transition>
      </div>

      <div class="py-4 border-t border-gray-100 dark:border-gray-800 text-center shrink-0">
        <p class="text-[10px] text-gray-400">© 2026 Pastoral Assistant. Secure Access.</p>
      </div>
    </div>

    <Transition name="modal">
      <div
        v-if="showForgot"
        class="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="showForgot = false"
      >
        <div
          class="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl transform transition-all"
        >
          <div class="text-center mb-6">
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl"
            >
              <i class="pi pi-lock"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">重置密码</h3>
            <p class="text-xs text-gray-500 mt-2">安全验证通过后即可重置</p>
          </div>

          <div class="flex flex-col gap-4">
            <input type="text" maxlength="11" placeholder="手机号码" :class="inputClass" />

            <div class="flex gap-3">
              <input type="text" placeholder="短信验证码" :class="inputClass + ' flex-1'" />
              <button
                class="px-4 min-w-[100px] text-xs font-bold rounded-xl whitespace-nowrap transition-colors flex items-center justify-center"
                :class="
                  countdown > 0
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 cursor-pointer'
                "
                :disabled="countdown > 0"
                @click="startCountdown"
              >
                {{ countdown > 0 ? `${countdown}s 后重试` : '获取验证码' }}
              </button>
            </div>

            <input type="password" placeholder="新密码" :class="inputClass" />

            <button
              class="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform hover:bg-green-700"
              @click="handleResetPassword"
            >
              确认重置
            </button>
          </div>

          <button
            @click="showForgot = false"
            class="w-full mt-6 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </Transition>

    <button
      @click="themeStore.toggleDark($event)"
      class="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 flex items-center justify-center text-white transition-colors shadow-lg"
    >
      <i
        class="transition-transform duration-500 rotate-0 dark:rotate-[360deg]"
        :class="themeStore.isDark ? 'pi pi-moon' : 'pi pi-sun'"
      ></i>
    </button>

    <button
      @click="$router.push('/')"
      class="absolute top-6 left-6 z-20 text-sm text-white/80 hover:text-white flex items-center gap-1 transition-colors shadow-sm font-bold"
    >
      <i class="pi pi-arrow-left"></i> 返回首页
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import request from '@/utils/request' // 直接引入 request 以便在注册时手动控制流程
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import favicon from '@/assets/favicon.svg'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const toast = useToast()

// 样式变量
const inputClass =
  'w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-green-500 dark:focus:border-green-500 text-gray-800 dark:text-white text-sm transition-colors duration-300 placeholder-gray-400'
const btnClass =
  'w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center'
const labelClass = 'text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 tracking-wide'

// UI 状态
const currentTab = ref('login')
const loading = ref(false)
const showForgot = ref(false)
const countdown = ref(0)
let timer = null

const loginCaptcha = ref({ key: '', svg: '' })
const registerCaptcha = ref({ key: '', svg: '' })

const loginForm = reactive({ phone: '', password: '', code: '' })
const registerForm = reactive({ name: '', phone: '', password: '', confirmPassword: '', code: '' })

// 获取验证码
const fetchCaptcha = async (type) => {
  try {
    const res = await request.get('/captcha')
    if (type === 'login') {
      loginCaptcha.value = { key: res.key, svg: res.image }
      loginForm.code = '' // 刷新时清空验证码输入
    } else {
      registerCaptcha.value = { key: res.key, svg: res.image }
      registerForm.code = ''
    }
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    toast.add({ severity: 'error', summary: '网络错误', detail: '验证码获取失败', life: 3000 })
  }
}

const switchTab = (tab) => {
  currentTab.value = tab
  fetchCaptcha(tab)
}

// 倒计时逻辑
const startCountdown = () => {
  if (countdown.value > 0) return
  toast.add({ severity: 'success', summary: '验证码已发送', detail: '请注意查收短信', life: 3000 })

  countdown.value = 30
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 校验工具
const validatePassword = (pwd) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pwd)
const validatePhone = (phone) => /^1[3-9]\d{9}$/.test(phone)

// 🟢 登录逻辑优化
const handleLogin = async () => {
  if (!validatePhone(loginForm.phone))
    return toast.add({
      severity: 'warn',
      summary: '格式错误',
      detail: '请输入有效的11位手机号',
      life: 3000,
    })
  if (!loginForm.password)
    return toast.add({ severity: 'warn', summary: '提示', detail: '请输入登录密码', life: 3000 })
  if (!loginForm.code)
    return toast.add({ severity: 'warn', summary: '提示', detail: '请输入验证码', life: 3000 })

  loading.value = true
  try {
    await authStore.login({
      phone: loginForm.phone,
      password: loginForm.password,
      code: loginForm.code,
      key: loginCaptcha.value.key,
    })

    // 登录成功
    toast.add({
      severity: 'success',
      summary: '欢迎回来!',
      detail: '正在进入控制台...',
      life: 1500,
    })
  } catch (error) {
    // 🔴 失败处理：
    // 1. 提示时间延长到 3000ms
    toast.add({
      severity: 'error',
      summary: '登录失败',
      detail: error.response?.data?.message || '请求错误',
      life: 3000,
    })

    // 2. 清空密码和验证码，但【保留手机号】
    loginForm.password = ''
    loginForm.code = ''

    // 3. 立即刷新验证码
    await fetchCaptcha('login')
  } finally {
    loading.value = false
  }
}

// 🟢 注册逻辑优化
const handleRegister = async () => {
  if (!registerForm.name)
    return toast.add({ severity: 'warn', summary: '提示', detail: '请输入您的称呼', life: 3000 })
  if (!validatePhone(registerForm.phone))
    return toast.add({
      severity: 'warn',
      summary: '格式错误',
      detail: '请输入有效的手机号',
      life: 3000,
    })
  if (!validatePassword(registerForm.password))
    return toast.add({
      severity: 'warn',
      summary: '密码太弱',
      detail: '密码至少6位，需包含字母和数字',
      life: 4000,
    })
  if (registerForm.password !== registerForm.confirmPassword)
    return toast.add({
      severity: 'error',
      summary: '错误',
      detail: '两次输入的密码不一致',
      life: 3000,
    })
  if (!registerForm.code)
    return toast.add({ severity: 'warn', summary: '提示', detail: '请输入验证码', life: 3000 })

  loading.value = true
  try {
    // 🔴 这里改用 request 直接请求，不走 authStore 的自动登录逻辑
    // 这样我们可以控制后续流程：不直接跳转，而是切回登录页
    await request.post('/auth/register', {
      name: registerForm.name,
      phone: registerForm.phone,
      password: registerForm.password,
      code: registerForm.code,
      key: registerCaptcha.value.key,
    })

    toast.add({ severity: 'success', summary: '注册成功', detail: '请使用新账号登录', life: 3000 })

    // 🔴 体验优化：
    // 1. 自动切回登录 Tab
    switchTab('login')
    // 2. 自动填入刚才注册的手机号
    loginForm.phone = registerForm.phone
    // 3. 清空注册表单
    Object.keys(registerForm).forEach((key) => (registerForm[key] = ''))
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '注册失败',
      detail: error.response?.data?.message || '请求错误',
      life: 3000,
    })
    // 失败刷新注册验证码
    await fetchCaptcha('register')
  } finally {
    loading.value = false
  }
}

const handleResetPassword = () => {
  toast.add({
    severity: 'success',
    summary: '演示模式',
    detail: '重置密码功能模拟成功',
    life: 3000,
  })
  setTimeout(() => (showForgot.value = false), 1500)
}

onMounted(() => {
  fetchCaptcha('login')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  position: absolute;
  //width: 100%;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.9) translateY(20px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>

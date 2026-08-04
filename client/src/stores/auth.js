import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/request';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);


  // 检测后端服务状态
  const checkServerStatus = async () => {
    try {
      const res = await request.get('/status');

      if (res.code === 200) {
        return true;
      }

      return false;

    } catch (error) {
      console.error('后端服务连接失败:', error);
      return false;
    }
  };


  // 登录动作
  const login = async (payload) => {
    const res = await request.post('/auth/login', payload);
    setSession(res);
  };


  // 注册动作
  const register = async (payload) => {
    const res = await request.post('/auth/register', payload);
    setSession(res);
  };


  // 保存会话
  const setSession = (data) => {
    token.value = data.token;

    user.value = {
      id: data._id,
      name: data.name,
      phone: data.phone,
      role: data.role || 'user',
    };


    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user.value));


    if (user.value.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/app/dashboard');
    }
  };


  // 登出
  const logout = () => {
    user.value = null;
    token.value = null;

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    router.push('/');
  };


  return {
    user,
    token,
    login,
    register,
    logout,
    checkServerStatus
  };
});

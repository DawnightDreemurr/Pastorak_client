import axios from 'axios';

const request = axios.create({
  // baseURL: 'http://localhost:3000/api', // 指向你的 Node 后端
  baseURL:'https://pastoralassistant-back.onrender.com/api',
  timeout: 5000
});

// 请求拦截器：自动带上 Token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  response => response.data,
  error => {
    // 🟢 关键修改：只有当 401 且 【不是】登录接口本身时，才执行强制跳转
    // error.config.url 包含了请求的地址
    if (error.response && error.response.status === 401) {

      const isLoginRequest = error.config.url.includes('/auth/login');

      // 如果不是登录请求报的错，说明是 Token 过期了，这才强制登出
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        // 使用 router 跳转比 location.href 更柔和，但这里为了确保清空状态，href 也可以
        // 只有非登录页才跳转，避免死循环
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default request;

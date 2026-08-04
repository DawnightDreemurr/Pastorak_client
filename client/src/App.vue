<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-200 transition-colors duration-500">
    <router-view />
  </div>
</template>

<style>

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style>

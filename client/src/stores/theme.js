import { defineStore } from 'pinia';
import { useDark, useToggle } from '@vueuse/core';
import { nextTick } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // 1. 初始化 dark 模式
  const isDark = useDark({
    storageKey: 'pastoral-theme-scheme',
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  });

  const toggle = useToggle(isDark);

  // 2. 核心切换逻辑
  const toggleDark = async (event) => {
    // 检查浏览器是否支持 View Transition API
    const isAppearanceTransition = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 如果不支持或没有传入点击事件，直接普通切换
    if (!isAppearanceTransition || !event) {
      toggle();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    // 计算覆盖全屏所需的半径
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );

    // 🟢 重点修改：统一逻辑，永远是“新视图”覆盖“旧视图”
    const transition = document.startViewTransition(async () => {
      toggle();
      await nextTick();
    });

    transition.ready.then(() => {
      // 🟢 只需要定义一个扩散动画
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      // 🟢 永远作用于 ::view-transition-new(root)
      // 意思是：无论变成什么颜色，新出来的那个颜色层，都要执行“从小变大”的动画
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  };

  return { isDark, toggleDark };
});

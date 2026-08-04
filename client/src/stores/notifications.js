import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiGetUnreadCount } from '@/api/notifications.api'

export const useNotificationStore = defineStore('notification', () => {
  const unreadCount = ref(0)
  const loadingUnread = ref(false)

  async function fetchUnreadCount() {
    loadingUnread.value = true
    try {
      const res = await apiGetUnreadCount()
      unreadCount.value = Number(res?.data?.unread || 0)
    } catch {
      unreadCount.value = 0
    } finally {
      loadingUnread.value = false
    }
  }

  function setUnreadCount(count) {
    unreadCount.value = Math.max(0, Number(count || 0))
  }

  function decrementUnread(step = 1) {
    unreadCount.value = Math.max(0, unreadCount.value - Number(step || 1))
  }

  function clearUnread() {
    unreadCount.value = 0
  }

  return {
    unreadCount,
    loadingUnread,
    fetchUnreadCount,
    setUnreadCount,
    decrementUnread,
    clearUnread,
  }
})

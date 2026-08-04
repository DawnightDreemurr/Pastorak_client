import a1 from '@/assets/avatars/a1.png'
import a2 from '@/assets/avatars/a2.png'
import a3 from '@/assets/avatars/a3.png'
import a4 from '@/assets/avatars/a4.png'
import a5 from '@/assets/avatars/a5.png'
import a6 from '@/assets/avatars/a6.png'

const map = { a1, a2, a3, a4, a5, a6 }

export function avatarSrcByKey(key) {
  return map[key] || a1
}

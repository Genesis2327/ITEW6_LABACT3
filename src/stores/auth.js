import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ph_gold_calc_users'
const CURRENT_USER_KEY = 'ph_gold_calc_current_user'

function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)

  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY)
    if (saved) currentUser.value = JSON.parse(saved)
  } catch {}

  const isLoggedIn = computed(() => !!currentUser.value)

  function register(email, password, name) {
    const users = getUsers()
    if (users[email]) return { ok: false, message: 'Email already registered.' }
    users[email] = { email, password, name }
    saveUsers(users)
    return { ok: true }
  }

  function login(email, password) {
    const users = getUsers()
    const user = users[email]
    if (!user || user.password !== password) {
      return { ok: false, message: 'Invalid email or password.' }
    }
    const { password: _, ...profile } = user
    currentUser.value = profile
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile))
    return { ok: true }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return { currentUser, isLoggedIn, register, login, logout }
})

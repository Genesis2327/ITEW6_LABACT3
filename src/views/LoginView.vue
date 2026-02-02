<template>
  <div class="auth-page">
    <div class="auth-card app-card">
      <div class="auth-header">
        <div class="logo-icon">◆</div>
        <h1>Philippines Gold Rate Live and Calculator</h1>
        <p class="subtitle">Before access you must register. Sign in to your account.</p>
      </div>
      <form @submit.prevent="onSubmit" class="auth-form">
        <div v-if="error" class="message error">{{ error }}</div>
        <div class="field">
          <label class="label" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input-field"
            placeholder="you@example.com"
            required
          />
        </div>
        <div class="field">
          <label class="label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input-field"
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" class="btn-primary full-width" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Log in' }}
        </button>
      </form>
      <p class="auth-footer">
        Don't have an account?
        <RouterLink to="/register" class="link">Register</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function onSubmit() {
  error.value = ''
  loading.value = true
  const result = auth.login(email.value.trim(), password.value)
  loading.value = false
  if (result.ok) {
    router.push({ name: 'Dashboard' })
  } else {
    error.value = result.message
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(160deg, var(--green-50) 0%, var(--green-100) 50%, var(--green-200) 100%);
}
.auth-card {
  width: 100%;
  max-width: 420px;
}
.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.logo-icon {
  font-size: 2.5rem;
  color: var(--gold);
  margin-bottom: 0.5rem;
}
.auth-header h1 {
  font-size: 1.35rem;
  color: var(--green-900);
  margin-bottom: 0.25rem;
}
.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}
.auth-form .field {
  margin-bottom: 1rem;
}
.message.error {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.full-width {
  width: 100%;
  margin-top: 0.5rem;
}
.auth-footer {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: var(--gray-700);
}
</style>

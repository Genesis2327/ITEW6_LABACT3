<template>
  <div class="auth-page">
    <div class="auth-card app-card">
      <div class="auth-header">
        <div class="logo-icon">◆</div>
        <h1>Philippines Gold Calculator</h1>
        <p class="subtitle">Before access you must register. Create your account.</p>
      </div>
      <form @submit.prevent="onSubmit" class="auth-form">
        <div v-if="error" class="message error">{{ error }}</div>
        <div v-if="success" class="message success">{{ success }}</div>
        <div class="field">
          <label class="label" for="name">Full name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="input-field"
            placeholder="Juan Dela Cruz"
            required
          />
        </div>
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
            minlength="6"
            required
          />
        </div>
        <button type="submit" class="btn-primary full-width" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>
      <p class="auth-footer">
        Already have an account?
        <RouterLink to="/login" class="link">Log in</RouterLink>
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
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

function onSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true
  const result = auth.register(email.value.trim(), password.value, name.value.trim())
  loading.value = false
  if (result.ok) {
    success.value = 'Account created. Redirecting to login...'
    setTimeout(() => router.push({ name: 'Login' }), 1200)
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
.message {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
.message.error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.message.success {
  background: var(--green-50);
  color: var(--green-800);
  border: 1px solid var(--green-200);
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

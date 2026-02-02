<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-inner">
        <h1 class="brand">
          <span class="brand-icon">◆</span>
          Philippines Gold Rate Live and Calculator
        </h1>
        <nav class="nav">
          <RouterLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">Dashboard</RouterLink>
          <RouterLink to="/calculator" class="nav-link" :class="{ active: $route.path === '/calculator' }">Calculator</RouterLink>
        </nav>
        <div class="user-menu">
          <span class="user-name">{{ auth.currentUser?.name }}</span>
          <button class="btn-secondary btn-sm" @click="auth.logout()">Log out</button>
        </div>
      </div>
    </header>
    <main class="main">
      <!-- Real-time bar -->
      <section class="realtime-bar app-card">
        <div class="realtime-left">
          <span class="live-badge">
            <span class="pulse"></span>
            Live
          </span>
          <span class="clock">{{ now }}</span>
          <span class="timezone">PHT</span>
        </div>
        <div class="realtime-right">
          <span class="updated">Rates updated {{ lastUpdatedAgo }}</span>
        </div>
      </section>

      <!-- Quick stats -->
      <section class="quick-stats">
        <div class="stat-card app-card">
          <span class="stat-label">24K (PHP/g)</span>
          <span class="stat-value">₱{{ goldRates.getRate(24).toLocaleString() }}</span>
          <span class="stat-desc">Pure gold</span>
        </div>
        <div class="stat-card app-card">
          <span class="stat-label">18K (PHP/g)</span>
          <span class="stat-value">₱{{ goldRates.getRate(18).toLocaleString() }}</span>
          <span class="stat-desc">Common jewelry</span>
        </div>
        <div class="stat-card app-card highlight">
          <span class="stat-label">Calculator</span>
          <span class="stat-desc">Gold × grams + making + 12% tax</span>
          <RouterLink to="/calculator" class="stat-cta">Open Calculator</RouterLink>
        </div>
      </section>

      <!-- Live rates grid -->
      <section class="rates-section app-card">
        <h2 class="section-title">
          Philippines gold rate <span class="badge live">Live</span> (PHP per gram)
        </h2>
        <div class="rate-grid">
          <div
            v-for="p in goldRates.purities"
            :key="p.karat"
            class="rate-card"
          >
            <span class="rate-label">{{ p.label }}</span>
            <span class="rate-value">₱{{ goldRates.getRate(p.karat).toLocaleString() }}</span>
            <span class="rate-desc">{{ p.description }}</span>
          </div>
        </div>
        <p class="rates-note">Rates update in calculator. Formula: Gold rate × grams + making charge (total first) + 12% tax = final price.</p>
      </section>

      <!-- Calculator CTA -->
      <section class="cta-section app-card">
        <h2>Calculate final gold price</h2>
        <p>Choose purity (24K–8K), enter grams and making charge. We apply 12% tax automatically.</p>
        <RouterLink to="/calculator" class="btn-primary btn-lg">Go to Calculator</RouterLink>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGoldRatesStore } from '../stores/goldRates'

const auth = useAuthStore()
const goldRates = useGoldRatesStore()

const now = ref('')
const secondsSinceUpdate = ref(0)
let clockInterval = null
let tickInterval = null

function formatTime(date) {
  return date.toLocaleTimeString('en-PH', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function updateClock() {
  const d = new Date()
  now.value = formatTime(d)
}

const lastUpdatedAgo = computed(() => {
  const s = secondsSinceUpdate.value
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m === 1) return '1m ago'
  return `${m}m ago`
})

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  function tick() {
    const t = goldRates.lastUpdated
    const when = t instanceof Date ? t : new Date(t)
    const elapsed = (Date.now() - when.getTime()) / 1000
    secondsSinceUpdate.value = Math.floor(elapsed)
  }
  tick()
  tickInterval = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
  if (tickInterval) clearInterval(tickInterval)
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--green-50) 0%, var(--bg-page) 100%);
}
.header {
  background: linear-gradient(135deg, var(--green-700), var(--green-800));
  color: var(--white);
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow);
}
.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.brand {
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-icon {
  color: var(--gold-light);
}
.nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.nav-link {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;
}
.nav-link:hover {
  color: var(--white);
  background: rgba(255,255,255,0.15);
}
.nav-link.active {
  color: var(--white);
  background: rgba(255,255,255,0.2);
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.user-name {
  font-size: 0.9rem;
  opacity: 0.95;
}
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--white);
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4);
}
.btn-sm:hover {
  background: rgba(255,255,255,0.3);
  color: var(--white);
}

.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.realtime-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
}
.realtime-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  background: var(--green-100);
  color: var(--green-800);
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  position: relative;
}
.pulse {
  width: 6px;
  height: 6px;
  background: var(--green-600);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
.clock {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--green-900);
  letter-spacing: 0.02em;
}
.timezone {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 600;
}
.realtime-right {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.updated {
  font-weight: 500;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.stat-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.stat-card.highlight {
  background: linear-gradient(135deg, var(--green-50), var(--green-100));
  border-color: var(--green-300);
}
.stat-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--green-700);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--green-900);
}
.stat-desc {
  font-size: 0.85rem;
  color: var(--gray-500);
}
.stat-cta {
  margin-top: 0.5rem;
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--green-600);
  color: var(--white);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}
.stat-cta:hover {
  background: var(--green-700);
}

.rates-section {
  padding: 1.5rem;
}
.section-title {
  font-size: 1.1rem;
  color: var(--green-800);
  margin-bottom: 1rem;
}
.rate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.rate-card {
  padding: 1rem;
  background: var(--green-50);
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.rate-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--green-700);
}
.rate-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--green-900);
}
.rate-desc {
  font-size: 0.75rem;
  color: var(--gray-500);
}
.rates-note {
  font-size: 0.8rem;
  color: var(--gray-500);
}
.badge.live {
  background: var(--green-200);
  color: var(--green-800);
  font-size: 0.7rem;
  margin-left: 0.35rem;
}

.cta-section {
  text-align: center;
  padding: 2rem;
}
.cta-section h2 {
  color: var(--green-800);
  margin-bottom: 0.5rem;
}
.cta-section p {
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}
.btn-lg {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  text-decoration: none;
  color: var(--white);
}
</style>

<template>
  <div class="home">
    <header class="header">
      <div class="header-inner">
        <h1 class="brand">
          <span class="brand-icon">◆</span>
          Philippines Gold Calculator
        </h1>
        <div class="user-menu">
          <span class="user-name">{{ auth.currentUser?.name }}</span>
          <button class="btn-secondary btn-sm" @click="auth.logout()">Log out</button>
        </div>
      </div>
    </header>
    <main class="main">
      <section class="hero app-card">
        <h2>Philippines Gold Rate — Live</h2>
        <p class="hero-desc">
          PH gold rate live. <strong>Gold rate × grams + making charge</strong> (total first) <strong>+ 12% tax</strong> = final gold price.
        </p>
        <RouterLink to="/calculator" class="btn-primary cta">
          Open Calculator
        </RouterLink>
      </section>
      <section class="rates-preview app-card">
        <h3>
          Philippines gold rate <span class="badge live">Live</span> (PHP per gram)
        </h3>
        <div class="rate-grid">
          <div v-for="p in goldRates.purities" :key="p.karat" class="rate-item">
            <span class="rate-label">{{ p.label }}</span>
            <span class="rate-value">₱{{ goldRates.getRate(p.karat).toLocaleString() }}</span>
          </div>
        </div>
        <p class="rates-note">Rates are indicative. You can update them in the calculator.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useGoldRatesStore } from '../stores/goldRates'

const auth = useAuthStore()
const goldRates = useGoldRatesStore()
</script>

<style scoped>
.home {
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
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.brand {
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-icon {
  color: var(--gold-light);
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
}
.main {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.hero {
  text-align: center;
  padding: 2rem;
}
.hero h2 {
  color: var(--green-800);
  margin-bottom: 0.5rem;
}
.hero-desc {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}
.cta {
  display: inline-block;
  text-decoration: none;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
}
.rates-preview h3 {
  font-size: 1rem;
  color: var(--green-800);
  margin-bottom: 1rem;
}
.rate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.rate-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background: var(--green-50);
  border-radius: 10px;
  border: 1px solid var(--border);
}
.rate-label {
  font-size: 0.8rem;
  color: var(--green-700);
  font-weight: 600;
}
.rate-value {
  font-size: 1rem;
  color: var(--green-900);
  font-weight: 600;
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
</style>

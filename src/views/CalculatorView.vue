<template>
  <div class="calculator-page">
    <header class="header">
      <div class="header-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-icon">◆</span>
          Gold Calculator
        </RouterLink>
        <div class="user-menu">
          <span class="user-name">{{ auth.currentUser?.name }}</span>
          <button class="btn-secondary btn-sm" @click="auth.logout()">Log out</button>
        </div>
      </div>
    </header>
    <main class="main">
      <h1 class="page-title">Jewelry Final Price Calculator</h1>
      <p class="page-desc">
        Philippines gold rate × grams + making charge, then +12% tax.
      </p>

      <!-- Purity tabs -->
      <div class="purity-tabs">
        <button
          v-for="p in goldRates.purities"
          :key="p.karat"
          type="button"
          class="tab"
          :class="{ active: selectedKarat === p.karat }"
          @click="selectedKarat = p.karat"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Calculator per purity -->
      <div v-for="p in goldRates.purities" :key="p.karat" v-show="selectedKarat === p.karat" class="calc-section app-card">
        <div class="calc-header">
          <h2>{{ p.label }} — {{ p.description }}</h2>
          <div class="rate-edit">
            <label class="label">Gold rate (PHP/gram)</label>
            <input
              type="number"
              min="0"
              step="1"
              class="input-field input-rate"
              :value="goldRates.getRate(p.karat)"
              @input="goldRates.setRate(p.karat, $event.target.value)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label class="label">Grams</label>
            <input
              v-model.number="inputs[p.karat].grams"
              type="number"
              min="0"
              step="0.01"
              class="input-field"
              placeholder="0.00"
            />
          </div>
          <div class="field">
            <label class="label">Making charge (PHP)</label>
            <input
              v-model.number="inputs[p.karat].makingCharge"
              type="number"
              min="0"
              step="1"
              class="input-field"
              placeholder="0"
            />
          </div>
        </div>
        <div class="result-box">
          <div class="result-row">
            <span>Gold value (rate × grams)</span>
            <span>₱{{ goldValue(p.karat).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="result-row">
            <span>+ Making charge</span>
            <span>₱{{ (inputs[p.karat].makingCharge || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="result-row subtotal">
            <span>Subtotal</span>
            <span>₱{{ subtotal(p.karat).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="result-row">
            <span>+ 12% tax</span>
            <span>₱{{ taxAmount(p.karat).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="result-row final">
            <span>Final gold price</span>
            <span>₱{{ finalPrice(p.karat).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGoldRatesStore } from '../stores/goldRates'

const auth = useAuthStore()
const goldRates = useGoldRatesStore()
const selectedKarat = ref(24)

const karats = [24, 22, 21, 18, 14, 10, 8]
const inputs = reactive(
  Object.fromEntries(karats.map(k => [k, { grams: 0, makingCharge: 0 }]))
)

function goldValue(karat) {
  const rate = goldRates.getRate(karat)
  const g = inputs[karat].grams || 0
  return rate * g
}

function subtotal(karat) {
  return goldValue(karat) + (inputs[karat].makingCharge || 0)
}

function taxAmount(karat) {
  return subtotal(karat) * 0.12
}

function finalPrice(karat) {
  return subtotal(karat) + taxAmount(karat)
}
</script>

<style scoped>
.calculator-page {
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
}
.brand {
  color: var(--white);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand:hover {
  color: var(--gold-light);
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
  color: var(--white);
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4);
}
.btn-sm:hover {
  background: rgba(255,255,255,0.3);
  color: var(--white);
}
.main {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}
.page-title {
  color: var(--green-900);
  margin-bottom: 0.25rem;
}
.page-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}
.purity-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.tab {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--green-300);
  background: var(--white);
  color: var(--green-800);
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.tab:hover {
  background: var(--green-50);
}
.tab.active {
  background: var(--green-600);
  color: var(--white);
  border-color: var(--green-600);
}
.calc-section {
  padding: 1.5rem;
}
.calc-header {
  margin-bottom: 1.25rem;
}
.calc-header h2 {
  font-size: 1.1rem;
  color: var(--green-800);
  margin-bottom: 0.75rem;
}
.rate-edit {
  max-width: 180px;
}
.input-rate {
  font-weight: 600;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.result-box {
  background: var(--green-50);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}
.result-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  color: var(--green-800);
}
.result-row.subtotal {
  border-top: 1px solid var(--green-200);
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  font-weight: 600;
}
.result-row.final {
  border-top: 2px solid var(--green-600);
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--green-900);
}
@media (max-width: 540px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

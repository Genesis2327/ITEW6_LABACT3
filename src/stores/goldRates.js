import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Philippines gold rate per gram (PHP) - sample/live-style values
// In production you can replace with API e.g. goldpricez.com
const DEFAULT_RATES_PHP_PER_GRAM = {
  24: 9250,
  22: 8480,
  21: 8094,
  18: 6938,
  14: 5412,
  10: 3858,
  8: 3086
}

const RATE_STORAGE_KEY = 'ph_gold_calc_rates'

function loadSavedRates() {
  try {
    const raw = localStorage.getItem(RATE_STORAGE_KEY)
    if (raw) return { ...DEFAULT_RATES_PHP_PER_GRAM, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULT_RATES_PHP_PER_GRAM }
}

export const useGoldRatesStore = defineStore('goldRates', () => {
  const ratesByKarat = ref(loadSavedRates())

  const purities = computed(() => [
    { karat: 24, label: '24K', description: 'Pure gold (99.9%)' },
    { karat: 22, label: '22K', description: '91.6% gold' },
    { karat: 21, label: '21K', description: '87.5% gold' },
    { karat: 18, label: '18K', description: '75% gold' },
    { karat: 14, label: '14K', description: '58.3% gold' },
    { karat: 10, label: '10K', description: '41.7% gold' },
    { karat: 8, label: '8K', description: '33.3% gold' }
  ])

  function getRate(karat) {
    return ratesByKarat.value[karat] ?? DEFAULT_RATES_PHP_PER_GRAM[karat] ?? 0
  }

  function setRate(karat, ratePHP) {
    ratesByKarat.value[karat] = Math.max(0, Number(ratePHP))
    try {
      localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(ratesByKarat.value))
    } catch {}
  }

  return { ratesByKarat, purities, getRate, setRate }
})

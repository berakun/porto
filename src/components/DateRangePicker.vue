<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger -->
    <div
      class="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition-colors"
      :class="[
        theme === 'dark'
          ? 'bg-[#0b0f17] border-white/10 hover:border-primary/40 text-on-surface-variant'
          : 'bg-white border-gray-200 hover:border-yellow-600/40 text-gray-600'
      ]"
      @click="togglePicker"
    >
      <span class="material-symbols-outlined text-sm" :class="theme === 'dark' ? 'text-primary' : 'text-yellow-600'">calendar_month</span>
      <span class="text-xs font-semibold">{{ displayText }}</span>
      <span class="material-symbols-outlined text-xs ml-auto">expand_more</span>
    </div>

    <!-- Popup -->
    <transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 rounded-xl border shadow-2xl flex flex-col sm:flex-row"
        :class="[
          align === 'right' ? 'right-0' : 'left-0',
          theme === 'dark'
            ? 'bg-surface-container border-white/10'
            : 'bg-white border-gray-200'
        ]"
      >
        <!-- Calendar Section -->
        <div class="p-4">
          <!-- Date Inputs -->
          <div class="flex gap-3 mb-4">
            <div class="flex items-center gap-2 border rounded px-2 py-1.5"
              :class="theme === 'dark' ? 'border-primary/50 bg-background' : 'border-yellow-600/50 bg-gray-50'">
              <span class="material-symbols-outlined text-xs" :class="theme === 'dark' ? 'text-primary' : 'text-yellow-600'">event</span>
              <input type="date" :value="startDate" @input="updateStartDate($event.target.value)"
                class="text-xs border-0 outline-none w-28 bg-transparent"
                :class="theme === 'dark' ? 'text-white' : 'text-gray-800'" />
            </div>
            <div class="flex items-center gap-2 border rounded px-2 py-1.5"
              :class="theme === 'dark' ? 'border-white/10 bg-background' : 'border-gray-200 bg-gray-50'">
              <span class="material-symbols-outlined text-xs" :class="theme === 'dark' ? 'text-on-surface-variant' : 'text-gray-400'">event</span>
              <input type="date" :value="endDate" @input="updateEndDate($event.target.value)"
                class="text-xs border-0 outline-none w-28 bg-transparent"
                :class="theme === 'dark' ? 'text-white' : 'text-gray-800'" />
            </div>
          </div>

          <!-- Dual Calendars -->
          <div class="flex gap-4">
            <!-- Left Calendar -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <button @click="prevMonth" class="p-1 rounded transition-colors"
                  :class="theme === 'dark' ? 'hover:bg-white/5 text-on-surface-variant' : 'hover:bg-gray-100 text-gray-500'">
                  <span class="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <div class="flex gap-1">
                  <select v-model="leftMonth" class="text-xs font-semibold border-0 bg-transparent cursor-pointer"
                    :class="theme === 'dark' ? 'text-white' : 'text-gray-800'">
                    <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
                  </select>
                  <select v-model="leftYear" class="text-xs font-semibold border-0 bg-transparent cursor-pointer"
                    :class="theme === 'dark' ? 'text-white' : 'text-gray-800'">
                    <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
                  </select>
                </div>
                <div class="w-6"></div>
              </div>
              <div class="grid grid-cols-7 gap-0.5 text-center text-[10px] mb-1"
                :class="theme === 'dark' ? 'text-on-surface-variant/60' : 'text-gray-400'">
                <div v-for="d in weekDays" :key="d" class="py-1">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-0.5 text-center">
                <div v-for="(day, i) in leftCalendarDays" :key="'l'+i"
                  class="py-1.5 text-xs cursor-pointer rounded transition-colors"
                  :class="getDayClass(day)"
                  @click="selectDate(day)">
                  {{ day.date || '' }}
                </div>
              </div>
            </div>

            <!-- Right Calendar -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="w-6"></div>
                <div class="flex gap-1">
                  <select v-model="rightMonth" class="text-xs font-semibold border-0 bg-transparent cursor-pointer"
                    :class="theme === 'dark' ? 'text-white' : 'text-gray-800'">
                    <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
                  </select>
                  <select v-model="rightYear" class="text-xs font-semibold border-0 bg-transparent cursor-pointer"
                    :class="theme === 'dark' ? 'text-white' : 'text-gray-800'">
                    <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
                  </select>
                </div>
                <button @click="nextMonth" class="p-1 rounded transition-colors"
                  :class="theme === 'dark' ? 'hover:bg-white/5 text-on-surface-variant' : 'hover:bg-gray-100 text-gray-500'">
                  <span class="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
              <div class="grid grid-cols-7 gap-0.5 text-center text-[10px] mb-1"
                :class="theme === 'dark' ? 'text-on-surface-variant/60' : 'text-gray-400'">
                <div v-for="d in weekDays" :key="d" class="py-1">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-0.5 text-center">
                <div v-for="(day, i) in rightCalendarDays" :key="'r'+i"
                  class="py-1.5 text-xs cursor-pointer rounded transition-colors"
                  :class="getDayClass(day)"
                  @click="selectDate(day)">
                  {{ day.date || '' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Presets -->
        <div class="border-t sm:border-t-0 sm:border-l p-4 flex sm:flex-col justify-between gap-3"
          :class="theme === 'dark' ? 'border-white/10' : 'border-gray-200'">
          <div class="space-y-1">
            <button
              v-for="preset in presets" :key="preset.label"
              @click="applyPreset(preset)"
              class="block w-full text-left px-3 py-1.5 text-xs rounded transition-colors font-semibold"
              :class="[
                activePreset === preset.label
                  ? theme === 'dark' ? 'bg-primary text-on-primary' : 'bg-yellow-600 text-white'
                  : theme === 'dark' ? 'text-on-surface-variant hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
              ]">
              {{ preset.label }}
            </button>
          </div>
          <div class="flex gap-2 sm:mt-3">
            <button @click="applySelection"
              class="flex-1 text-white text-xs py-1.5 px-3 rounded-lg transition-colors font-bold"
              :class="theme === 'dark' ? 'bg-primary hover:bg-primary/80' : 'bg-yellow-600 hover:bg-yellow-700'">
              Apply
            </button>
            <button @click="cancelSelection"
              class="flex-1 border text-xs py-1.5 px-3 rounded-lg transition-colors"
              :class="theme === 'dark' ? 'border-white/10 text-on-surface-variant hover:bg-white/5' : 'border-gray-300 text-gray-600 hover:bg-gray-50'">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  align: { type: String, default: 'left' },
  theme: { type: String, default: 'dark' }
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'change'])

const containerRef = ref(null)
const isOpen = ref(false)
const activePreset = ref(null)

const today = new Date()
const leftMonth = ref(today.getMonth())
const leftYear = ref(today.getFullYear())
const rightMonth = ref(today.getMonth() === 11 ? 0 : today.getMonth() + 1)
const rightYear = ref(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear())

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const yearRange = computed(() => {
  const years = []
  for (let y = today.getFullYear() - 5; y <= today.getFullYear() + 5; y++) years.push(y)
  return years
})

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 15 days', days: 15 },
  { label: 'Last 30 days', days: 30 },
  { label: 'This month', type: 'thisMonth' },
  { label: 'Last Month', type: 'lastMonth' }
]

const displayText = computed(() => {
  if (props.startDate && props.endDate) return `${props.startDate} → ${props.endDate}`
  if (props.startDate) return `${props.startDate} → ...`
  return 'Pilih rentang tanggal...'
})

function getCalendarDays(month, year) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const days = []
  for (let i = firstDay - 1; i >= 0; i--) days.push({ date: daysInPrevMonth - i, month: month - 1, year, isCurrentMonth: false })
  for (let i = 1; i <= daysInMonth; i++) days.push({ date: i, month, year, isCurrentMonth: true })
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) days.push({ date: i, month: month + 1, year, isCurrentMonth: false })
  return days
}

const leftCalendarDays = computed(() => getCalendarDays(leftMonth.value, leftYear.value))
const rightCalendarDays = computed(() => getCalendarDays(rightMonth.value, rightYear.value))

function formatDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toKey(day) {
  return `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
}

function isStartOrEnd(day) {
  return toKey(day) === props.startDate || toKey(day) === props.endDate
}

function isInRange(day) {
  if (!props.startDate || !props.endDate) return false
  const cur = new Date(day.year, day.month, day.date)
  return cur >= parseDate(props.startDate) && cur <= parseDate(props.endDate)
}

function getDayClass(day) {
  if (!day.isCurrentMonth) return props.theme === 'dark' ? 'text-white/15' : 'text-gray-300'
  if (isStartOrEnd(day)) return props.theme === 'dark' ? 'bg-primary text-on-primary font-semibold' : 'bg-yellow-600 text-white font-semibold'
  if (isInRange(day)) return props.theme === 'dark' ? 'bg-primary/15 text-primary' : 'bg-yellow-50 text-yellow-700'
  return props.theme === 'dark' ? 'hover:bg-white/5 text-on-surface-variant' : 'hover:bg-gray-100 text-gray-700'
}

function selectDate(day) {
  if (!day.isCurrentMonth) return
  const selected = toKey(day)
  if (!props.startDate || (props.startDate && props.endDate)) {
    emit('update:startDate', selected)
    emit('update:endDate', '')
    activePreset.value = null
  } else {
    const start = parseDate(props.startDate)
    const clicked = parseDate(selected)
    if (clicked < start) {
      emit('update:startDate', selected)
      emit('update:endDate', props.startDate)
    } else {
      emit('update:endDate', selected)
    }
    activePreset.value = null
  }
}

function updateStartDate(val) { emit('update:startDate', val); activePreset.value = null }
function updateEndDate(val) { emit('update:endDate', val); activePreset.value = null }

function prevMonth() {
  if (leftMonth.value === 0) { leftMonth.value = 11; leftYear.value-- } else { leftMonth.value-- }
  syncRight()
}
function nextMonth() {
  if (rightMonth.value === 11) { rightMonth.value = 0; rightYear.value++ } else { rightMonth.value++ }
  syncLeft()
}
function syncRight() {
  if (leftMonth.value === 11) { rightMonth.value = 0; rightYear.value = leftYear.value + 1 }
  else { rightMonth.value = leftMonth.value + 1; rightYear.value = leftYear.value }
}
function syncLeft() {
  if (rightMonth.value === 0) { leftMonth.value = 11; leftYear.value = rightYear.value - 1 }
  else { leftMonth.value = rightMonth.value - 1; leftYear.value = rightYear.value }
}

function applyPreset(preset) {
  activePreset.value = preset.label
  if (preset.type === 'thisMonth') {
    emit('update:startDate', formatDate(new Date(today.getFullYear(), today.getMonth(), 1)))
    emit('update:endDate', formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)))
  } else if (preset.type === 'lastMonth') {
    emit('update:startDate', formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)))
    emit('update:endDate', formatDate(new Date(today.getFullYear(), today.getMonth(), 0)))
  } else if (preset.days) {
    const end = new Date(); const start = new Date(); start.setDate(start.getDate() - preset.days)
    emit('update:startDate', formatDate(start))
    emit('update:endDate', formatDate(end))
  }
}

function applySelection() { emit('change'); isOpen.value = false }
function cancelSelection() { isOpen.value = false }
function togglePicker() { isOpen.value = !isOpen.value }

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) isOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-enter-active { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-leave-active { transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
</style>

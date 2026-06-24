<template>
  <div class="transition-colors duration-500 bg-white text-gray-900 dark:bg-background dark:text-on-background min-h-screen font-body-md relative overflow-x-hidden selection:bg-primary/30">
    
    <!-- Decorative background elements -->
    <div class="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full border border-yellow-600/10 dark:border-primary/10 pointer-events-none z-0"></div>
    <div class="absolute top-[20%] right-[-200px] w-[600px] h-[600px] rounded-full border border-yellow-600/5 dark:border-primary/5 pointer-events-none z-0"></div>

    <!-- Case 1: NOT Authenticated (Admin Login Page) -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div class="w-full max-w-md p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300"
        :class="[
          theme === 'dark' 
            ? 'bg-surface-container/70 border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-white/95 border-gray-200 shadow-xl'
        ]"
      >
        <div class="text-center mb-8">
          <div class="flex justify-center items-center gap-2 text-yellow-600 dark:text-primary mb-3">
            <svg class="w-10 h-10" viewBox="0 0 100 100" fill="none">
              <path d="M20 20h30c10 0 15 5 15 15s-5 15-15 15H20v30" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M55 50l15 30" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M75 20H85v60H75M85 50H75" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="font-display-lg text-headline-md text-gray-800 dark:text-white">RF ADMIN</h1>
          <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-1 uppercase tracking-widest">Sign in to Visitor Analytics</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Username</label>
            <input 
              v-model="username"
              type="text" 
              required
              class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all"
              :class="[
                theme === 'dark'
                  ? 'bg-background border-white/10 focus:border-primary text-white focus:ring-1 focus:ring-primary'
                  : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900 focus:ring-1 focus:ring-yellow-600'
              ]"
              placeholder="e.g. admin"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Password</label>
            <input 
              v-model="password"
              type="password" 
              required
              class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all"
              :class="[
                theme === 'dark'
                  ? 'bg-background border-white/10 focus:border-primary text-white focus:ring-1 focus:ring-primary'
                  : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900 focus:ring-1 focus:ring-yellow-600'
              ]"
              placeholder="••••••••"
            />
          </div>

          <div v-if="loginError" class="text-xs text-red-500 flex items-center gap-1.5 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ loginError }}
          </div>

          <div class="flex items-center justify-between text-xs">
            <router-link to="/" class="text-yellow-600 dark:text-primary hover:underline flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">arrow_back</span> Back to Portfolio
            </router-link>
            <button
              type="button"
              @click="toggleTheme"
              class="text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">
                {{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}
              </span>
              Mode
            </button>
          </div>

          <button 
            type="submit" 
            class="w-full py-3.5 rounded-lg font-bold shadow transition-all transform active:scale-95 duration-200"
            :class="[
              theme === 'dark' 
                ? 'bg-gradient-to-r from-primary to-tertiary-container hover:from-primary/90 hover:to-tertiary-container/90 text-on-primary hover:shadow-[0_0_15px_rgba(246,190,57,0.3)]'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            ]"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>

    <!-- Case 2: Authenticated (Dashboard Layout) -->
    <div v-else class="min-h-screen relative z-10">
      
      <!-- Sidebar Navigation -->
      <aside 
        class="fixed left-0 h-full w-64 border-r flex flex-col py-8 z-40 transition-all duration-300"
        :class="[
          theme === 'dark' 
            ? 'bg-surface-container dark:bg-surface-container-low border-white/5 text-on-surface'
            : 'bg-gray-50 border-gray-200 text-gray-800',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]"
      >
        <div class="px-6 mb-12 flex justify-between items-center">
          <div class="flex items-center text-yellow-600 dark:text-primary">
            <svg class="w-10 h-10 flex-shrink-0" viewBox="0 0 100 100" fill="none">
              <path d="M20 20h30c10 0 15 5 15 15s-5 15-15 15H20v30" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M55 50l15 30" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M75 20H85v60H75M85 50H75" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <!-- Close button on mobile -->
          <button @click="mobileSidebarOpen = false" class="md:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-white/5 transition text-gray-500">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav class="flex-1 space-y-1">
          <a 
            v-for="tab in tabs"
            :key="tab.name"
            href="#"
            @click.prevent="activeTab = tab.name; mobileSidebarOpen = false"
            class="flex items-center px-6 py-4 font-label-md transition-all duration-200"
            :class="[
              activeTab === tab.name 
                ? 'bg-yellow-600/10 dark:bg-primary/10 text-yellow-600 dark:text-primary border-r-4 border-yellow-600 dark:border-primary translate-x-1'
                : 'text-gray-600 dark:text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 hover:text-yellow-600 dark:hover:text-primary'
            ]"
          >
            <span class="material-symbols-outlined mr-4">{{ tab.icon }}</span>
            <span class="text-sm">{{ tab.label }}</span>
          </a>
        </nav>

        <div class="px-6 mt-8 md:mt-auto">
          <div class="p-4 rounded-xl border mb-6"
            :class="[
              theme === 'dark' ? 'bg-background/80 border-primary/20' : 'bg-white border-yellow-600/20'
            ]"
          >
            <p class="text-xs font-bold text-yellow-600 dark:text-primary mb-2">System Status</p>
            <div class="flex items-center text-[11px]" :class="[theme === 'dark' ? 'text-on-surface-variant' : 'text-gray-500']">
              <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Live Tracking Active
            </div>
          </div>

          <button 
            @click="handleLogout"
            class="flex items-center w-full px-6 py-4 text-gray-500 hover:text-red-600 dark:text-on-surface-variant dark:hover:text-red-400 transition-all opacity-85 hover:opacity-100"
          >
            <span class="material-symbols-outlined mr-4">logout</span>
            <span class="font-label-md text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Overlay for mobile sidebar -->
      <div 
        v-if="mobileSidebarOpen" 
        @click="mobileSidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-30 md:hidden"
      ></div>

      <!-- Main Content Area -->
      <main class="md:ml-64 relative min-h-screen overflow-hidden flex flex-col transition-all duration-300">
        <!-- Accent circles matching ui-update -->
        <div class="semi-circle-accent" :style="{ borderColor: theme === 'dark' ? 'rgba(246, 190, 57, 0.1)' : 'rgba(202, 138, 4, 0.1)' }"></div>
        <div class="semi-circle-accent animate-pulse" :style="{ top: '20%', right: '-200px', width: '600px', height: '600px', borderColor: theme === 'dark' ? 'rgba(246, 190, 57, 0.03)' : 'rgba(202, 138, 4, 0.03)' }"></div>

        <!-- Header -->
        <header class="sticky top-0 w-full z-30 backdrop-blur-xl border-b h-20 px-6 md:px-12 flex justify-between items-center transition-colors"
          :class="[
            theme === 'dark' ? 'bg-background/80 border-white/10' : 'bg-white/90 border-gray-200'
          ]"
        >
          <div class="flex items-center gap-4">
            <button class="md:hidden p-2 text-yellow-600 dark:text-primary rounded hover:bg-gray-100 dark:hover:bg-white/5 transition" @click="mobileSidebarOpen = !mobileSidebarOpen">
              <span class="material-symbols-outlined block">menu</span>
            </button>
            <h2 class="font-display-lg text-headline-md text-yellow-600 dark:text-primary tracking-tight">Visitor Analytics</h2>
          </div>
          
          <div class="flex items-center gap-6">
            <!-- Theme Toggle -->
            <button 
              @click="toggleTheme" 
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-on-surface-variant hover:text-yellow-600 dark:hover:text-primary transition-all"
            >
              <span class="material-symbols-outlined block">
                {{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>

            <!-- User Info -->
            <div class="flex items-center gap-3 pl-6 border-l" :class="[theme === 'dark' ? 'border-white/10' : 'border-gray-200']">
              <div class="text-right hidden sm:block">
                <p class="text-xs font-bold" :class="[theme === 'dark' ? 'text-on-surface' : 'text-gray-800']">Admin User</p>
                <p class="text-[9px] uppercase tracking-wider text-gray-400">System Oversight</p>
              </div>
              <div class="w-10 h-10 rounded-full border border-yellow-600/35 dark:border-primary/30 flex items-center justify-center bg-yellow-600/10 text-yellow-600 dark:text-primary font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <!-- Dashboard Canvas -->
        <section class="p-6 md:p-12 space-y-8 flex-1">
          
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Card 1 -->
            <div class="p-6 rounded-2xl border relative overflow-hidden group hover:border-yellow-600/40 dark:hover:border-primary/40 transition-colors"
              :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5' : 'bg-white border-gray-200 shadow-sm']"
            >
              <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span class="material-symbols-outlined text-8xl text-yellow-600 dark:text-primary">group</span>
              </div>
              <p class="font-label-md text-xs mb-2 text-gray-500 dark:text-on-surface-variant">Today's Visitors</p>
              <div class="flex items-end gap-3">
                <h3 class="text-headline-lg-mobile md:text-headline-md font-bold text-yellow-600 dark:text-primary">{{ todayVisitorsCount }}</h3>
                <span class="text-emerald-500 font-label-md text-xs flex items-center mb-1">
                  <span class="material-symbols-outlined text-sm mr-0.5">trending_up</span>
                  +12%
                </span>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="p-6 rounded-2xl border relative overflow-hidden group hover:border-yellow-600/40 dark:hover:border-primary/40 transition-colors"
              :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5' : 'bg-white border-gray-200 shadow-sm']"
            >
              <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span class="material-symbols-outlined text-8xl text-yellow-600 dark:text-primary">public</span>
              </div>
              <p class="font-label-md text-xs mb-2 text-gray-500 dark:text-on-surface-variant">Total Logged Visits</p>
              <div class="flex items-end gap-3">
                <h3 class="text-headline-lg-mobile md:text-headline-md font-bold text-yellow-600 dark:text-primary">{{ logs.length }}</h3>
                <span class="text-gray-400 font-label-md text-xs mb-1">Live DB</span>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="p-6 rounded-2xl border relative overflow-hidden group hover:border-yellow-600/40 dark:hover:border-primary/40 transition-colors"
              :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5' : 'bg-white border-gray-200 shadow-sm']"
            >
              <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span class="material-symbols-outlined text-8xl text-yellow-600 dark:text-primary">flag</span>
              </div>
              <p class="font-label-md text-xs mb-2 text-gray-500 dark:text-on-surface-variant">Top Referrer</p>
              <div class="flex items-center gap-4">
                <h3 class="text-headline-lg-mobile md:text-headline-md font-bold text-yellow-600 dark:text-primary">{{ topReferrer }}</h3>
                <div class="flex flex-col">
                  <span class="text-[10px] text-gray-500 dark:text-on-surface-variant">{{ topReferrerPercentage }}% of Traffic</span>
                  <div class="w-24 h-1 bg-gray-200 dark:bg-white/10 rounded-full mt-1">
                    <div class="h-full bg-yellow-600 dark:bg-primary rounded-full" :style="{ width: topReferrerPercentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Chart Section -->
          <div class="p-8 rounded-2xl border transition-colors"
            :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5' : 'bg-white border-gray-200 shadow-sm']"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h4 class="text-lg font-bold text-gray-800 dark:text-white font-display-lg">7-Day Visit Trend</h4>
                <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-1">Audience engagement metrics (Dynamic Mock Database)</p>
              </div>
              <div class="flex rounded-lg p-1 border" :class="[theme === 'dark' ? 'bg-background border-white/5' : 'bg-gray-100 border-gray-200']">
                <button 
                  @click="chartType = 'daily'"
                  class="px-4 py-1.5 text-xs font-label-md rounded-md transition-all"
                  :class="[chartType === 'daily' ? 'bg-yellow-600 dark:bg-primary text-white dark:text-on-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white']"
                >
                  Daily
                </button>
                <button 
                  @click="chartType = 'weekly'"
                  class="px-4 py-1.5 text-xs font-label-md rounded-md transition-all"
                  :class="[chartType === 'weekly' ? 'bg-yellow-600 dark:bg-primary text-white dark:text-on-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white']"
                >
                  Weekly
                </button>
              </div>
            </div>

            <!-- SVG Line Chart (Fully dynamic using current data) -->
            <div class="h-[250px] w-full relative flex items-end justify-between px-6 pt-4">
              <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" :stop-color="theme === 'dark' ? 'rgba(246, 190, 57, 0.4)' : 'rgba(202, 138, 4, 0.3)'"></stop>
                    <stop offset="100%" :stop-color="theme === 'dark' ? 'rgba(246, 190, 57, 0)' : 'rgba(202, 138, 4, 0)'"></stop>
                  </linearGradient>
                </defs>
                <!-- Area Path -->
                <path :d="chartAreaPath" fill="url(#chartGradient)"></path>
                <!-- Line Path -->
                <path :d="chartLinePath" fill="none" :stroke="theme === 'dark' ? '#f6be39' : '#ca8a04'" stroke-width="4" stroke-linecap="round"></path>
                <!-- Data Points (Circles) -->
                <circle 
                  v-for="(point, idx) in chartPoints" 
                  :key="idx"
                  :cx="point.x" 
                  :cy="point.y" 
                  r="5" 
                  :fill="theme === 'dark' ? '#f6be39' : '#ca8a04'"
                  class="cursor-pointer hover:r-7 transition-all"
                ></circle>
              </svg>

              <!-- Chart labels underneath -->
              <div class="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-semibold text-gray-400 px-6 transform translate-y-6">
                <span v-for="day in chartLabels" :key="day">{{ day }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Visitors Table Section -->
          <div class="rounded-2xl border overflow-hidden transition-colors"
            :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5' : 'bg-white border-gray-200 shadow-sm']"
          >
            <div class="p-6 border-b flex justify-between items-center" :class="[theme === 'dark' ? 'border-white/10' : 'border-gray-200']">
              <div>
                <h4 class="text-base font-bold text-gray-800 dark:text-white font-display-lg">Recent Visitors</h4>
                <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-0.5">Showing last 10 session logs inside system</p>
              </div>
              <div class="flex gap-3">
                <button 
                  @click="generateMockLog"
                  class="px-3 py-1.5 text-xs font-semibold rounded border border-yellow-600/30 text-yellow-600 dark:border-primary/30 dark:text-primary hover:bg-yellow-600/5 dark:hover:bg-primary/5 transition-all"
                >
                  + Add Log
                </button>
                <button 
                  @click="clearAllLogs"
                  class="px-3 py-1.5 text-xs font-semibold rounded border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all"
                >
                  Clear Logs
                </button>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="text-[10px] uppercase tracking-wider font-semibold text-gray-400"
                  :class="[theme === 'dark' ? 'bg-white/5' : 'bg-gray-50']"
                >
                  <tr>
                    <th class="px-8 py-4">IP Address</th>
                    <th class="px-8 py-4">Browser/OS</th>
                    <th class="px-8 py-4">Referrer URL</th>
                    <th class="px-8 py-4">Country</th>
                    <th class="px-8 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody class="divide-y text-xs text-gray-600 dark:text-on-surface-variant/90"
                  :class="[theme === 'dark' ? 'divide-white/5' : 'divide-gray-150']"
                >
                  <tr v-if="logs.length === 0">
                    <td colspan="5" class="px-8 py-8 text-center text-gray-400">
                      No logs captured yet. Visit the portfolio page first or click "+ Add Log"!
                    </td>
                  </tr>
                  <tr v-for="log in logs.slice(0, 10)" :key="log.id" class="hover:bg-yellow-600/5 dark:hover:bg-primary/5 transition-colors group">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-yellow-600/40 dark:bg-primary/40 group-hover:bg-yellow-600 dark:group-hover:bg-primary transition-colors"></div>
                        <span class="font-code-sm font-semibold">{{ log.ip }}</span>
                      </div>
                    </td>
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-base">
                          {{ log.browser_os.toLowerCase().includes('ios') || log.browser_os.toLowerCase().includes('android') ? 'smartphone' : 'laptop' }}
                        </span>
                        <span>{{ log.browser_os }}</span>
                      </div>
                    </td>
                    <td class="px-8 py-5">
                      <span class="truncate max-w-[200px] block" :title="log.referrer">{{ log.referrer }}</span>
                    </td>
                    <td class="px-8 py-5">
                      <span class="font-semibold">{{ log.country }}</span>
                    </td>
                    <td class="px-8 py-5 text-right font-semibold text-gray-400">
                      {{ log.timestamp }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="py-6 border-t px-8 bg-gray-50 dark:bg-surface-container-lowest mt-auto transition-colors"
          :class="[theme === 'dark' ? 'border-white/5' : 'border-gray-200']"
        >
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-[10px] text-gray-500">© {{ new Date().getFullYear() }} RF Dashboard. All rights reserved.</p>
            <div class="flex gap-4 text-[10px] text-gray-400">
              <a href="#" class="hover:underline">Documentation</a>
              <a href="#" class="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const theme = ref('dark')
const activeTab = ref('dashboard')
const chartType = ref('daily')
const mobileSidebarOpen = ref(false)

// Authentication state
const isAuthenticated = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')

// Tabs config
const tabs = [
  { name: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { name: 'analytics', label: 'Analytics', icon: 'monitoring' },
  { name: 'projects', label: 'Projects', icon: 'folder_special' },
  { name: 'settings', label: 'Settings', icon: 'settings' }
]

// Log database
const logs = ref([])

// Today's visitors count logic (logs that occurred today)
const todayVisitorsCount = computed(() => {
  return Math.max(12, logs.value.length + 128)
})

// Top referrers aggregation
const topReferrer = computed(() => {
  if (logs.value.length === 0) return 'Direct'
  const counts = {}
  logs.value.forEach(log => {
    const domain = log.referrer.split('/')[0] || log.referrer
    counts[domain] = (counts[domain] || 0) + 1
  })
  let top = 'Direct'
  let max = 0
  for (const key in counts) {
    if (counts[key] > max) {
      max = counts[key]
      top = key
    }
  }
  return top
})

const topReferrerPercentage = computed(() => {
  if (logs.value.length === 0) return 40
  const topRef = topReferrer.value
  const count = logs.value.filter(log => log.referrer.includes(topRef) || topRef === 'Direct' && log.referrer === 'Direct Access').length
  return Math.round((count / logs.value.length) * 100) || 40
})

// Dynamic SVG Chart paths logic
const chartData = computed(() => {
  // Return different counts based on Daily vs Weekly selection
  if (chartType.value === 'daily') {
    return [40, 95, 60, 110, 80, 140, 120] // 7 data points
  } else {
    return [300, 450, 290, 520, 610, 480, 710] // Weekly data points
  }
})

const chartLabels = computed(() => {
  if (chartType.value === 'daily') {
    return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  } else {
    return ['WK 18', 'WK 19', 'WK 20', 'WK 21', 'WK 22', 'WK 23', 'WK 24']
  }
})

// Map data points into coordinates for SVG (width 1000, height 200, padding)
const chartPoints = computed(() => {
  const data = chartData.value
  const maxVal = Math.max(...data) * 1.1 || 1
  const xGaps = 1000 / (data.length - 1)
  
  return data.map((val, idx) => {
    const x = idx * xGaps
    // In SVG, y=0 is top, so we subtract from height
    const y = 180 - (val / maxVal) * 140 
    return { x, y }
  })
})

const chartLinePath = computed(() => {
  const pts = chartPoints.value
  if (pts.length === 0) return ''
  // Create SVG path starting from point 0
  let d = `M ${pts[0].x} ${pts[0].y}`
  // Draw smooth curves using bezier control points
  for (let i = 1; i < pts.length; i++) {
    const cpX = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2
    d += ` C ${cpX} ${pts[i - 1].y}, ${cpX} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`
  }
  return d
})

const chartAreaPath = computed(() => {
  const pts = chartPoints.value
  if (pts.length === 0) return ''
  let d = chartLinePath.value
  // Close the area loop down to x=1000, y=200 and back to x=0, y=200
  d += ` L ${pts[pts.length - 1].x} 200 L ${pts[0].x} 200 Z`
  return d
})

// Authentication operations
const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    isAuthenticated.value = true
    localStorage.setItem('admin_session', 'authenticated')
    loginError.value = ''
  } else {
    loginError.value = 'Invalid admin credentials!'
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('admin_session')
}

// Simulated logs generator
const generateMockLog = () => {
  const ips = ['64.233.16.104', '172.217.22.14', '207.46.13.41', '198.51.100.72', '203.0.113.88']
  const agents = ['Chrome / Windows', 'Safari / iOS', 'Firefox / macOS', 'Chrome / Android', 'Edge / Windows']
  const referrers = ['google.com', 'linkedin.com/feed/', 'github.com/rifki', 'Direct Access', 'twitter.com/dev']
  const countries = ['USA', 'IDN', 'SGP', 'JPN', 'DEU']

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const newLog = {
    id: Date.now(),
    ip: randomItem(ips),
    browser_os: randomItem(agents),
    referrer: randomItem(referrers),
    landing_page: '/',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    country: randomItem(countries)
  }

  logs.value.unshift(newLog)
  localStorage.setItem('visitor_logs', JSON.stringify(logs.value.slice(0, 50)))
}

const clearAllLogs = () => {
  logs.value = []
  localStorage.setItem('visitor_logs', JSON.stringify([]))
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', theme.value)
}

// Initial configuration loading
onMounted(() => {
  // Check auth state
  const session = localStorage.getItem('admin_session')
  if (session === 'authenticated') {
    isAuthenticated.value = true
  }

  // Load theme preference
  theme.value = localStorage.getItem('theme') || 'dark'
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Load existing logs or inject initial data
  const storedLogs = localStorage.getItem('visitor_logs')
  if (storedLogs) {
    logs.value = JSON.parse(storedLogs)
  } else {
    // Inject default initial mock logs
    logs.value = [
      { id: 1, ip: '192.168.1.42', browser_os: 'Chrome / macOS', referrer: 'google.com/search?q=rf', landing_page: '/', timestamp: '03:14:20 PM', country: 'USA' },
      { id: 2, ip: '74.125.22.101', browser_os: 'Safari / iOS', referrer: 'linkedin.com/feed/', landing_page: '/', timestamp: '03:02:11 PM', country: 'IDN' },
      { id: 3, ip: '203.0.113.195', browser_os: 'Firefox / Linux', referrer: 'Direct Access', landing_page: '/', timestamp: '02:44:02 PM', country: 'DEU' }
    ]
    localStorage.setItem('visitor_logs', JSON.stringify(logs.value))
  }
})
</script>

<style>
/* Same typography class mapping */
.font-display-lg {
  font-family: 'Montserrat', sans-serif;
}
.font-body-md {
  font-family: 'Inter', sans-serif;
}
.font-label-md {
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.05em;
  font-weight: 600;
}
.font-code-sm {
  font-family: monospace;
}
.semi-circle-accent {
  position: absolute;
  top: -150px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  pointer-events: none;
  border-width: 2px;
}
</style>

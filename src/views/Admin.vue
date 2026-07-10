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
          <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-1 uppercase tracking-widest">Sign in to Portfolio Admin</p>
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
            <h2 class="font-display-lg text-headline-md text-yellow-600 dark:text-primary tracking-tight">Expertise Manager</h2>
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
          
          <!-- Settings (when activeTab === 'settings') -->
          <div v-if="activeTab === 'settings'">
            <div class="mb-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white font-display-lg">Settings</h3>
              <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-1">Manage your admin credentials</p>
            </div>

            <div class="max-w-md">
              <div class="p-6 rounded-xl border"
                :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5' : 'bg-white border-gray-200']">
                <h4 class="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span class="material-symbols-outlined text-yellow-600 dark:text-primary">lock</span>
                  Change Password
                </h4>
                
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Current Password</label>
                    <input 
                      v-model="passwordChange.current"
                      type="password" 
                      required
                      class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                      :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">New Password</label>
                    <input 
                      v-model="passwordChange.newPassword"
                      type="password" 
                      required
                      minlength="6"
                      class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                      :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Confirm New Password</label>
                    <input 
                      v-model="passwordChange.confirm"
                      type="password" 
                      required
                      class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                      :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                      placeholder="••••••••"
                    />
                  </div>

                  <div v-if="passwordChange.error" class="text-xs text-red-500 flex items-center gap-1.5 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <span class="material-symbols-outlined text-sm">error</span>
                    {{ passwordChange.error }}
                  </div>

                  <div v-if="passwordChange.success" class="text-xs text-emerald-500 flex items-center gap-1.5 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                    Password updated successfully!
                  </div>

                  <button 
                    type="submit"
                    class="w-full py-3 rounded-lg text-sm font-bold transition-all"
                    :class="[theme === 'dark' ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-yellow-600 text-white hover:bg-yellow-700']"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Experience Management (when activeTab === 'experience') -->
          <div v-if="activeTab === 'experience'">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white font-display-lg">Manage Experience</h3>
                <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-1">Add, edit, or remove projects from your portfolio</p>
              </div>
              <button 
                @click="openExperienceModal()"
                class="px-4 py-2 text-xs font-semibold rounded-lg bg-yellow-600 dark:bg-primary text-white dark:text-on-primary hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">add</span>
                Add Project
              </button>
            </div>

            <!-- Experience List -->
            <div class="space-y-4">
              <div 
                v-for="(exp, index) in experiences" 
                :key="exp.id"
                class="p-6 rounded-xl border transition-all hover:shadow-md"
                :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5 hover:border-primary/20' : 'bg-white border-gray-200']"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                      :class="[theme === 'dark' ? 'bg-primary/10 text-primary' : 'bg-yellow-600/10 text-yellow-600']">
                      <span class="material-symbols-outlined">{{ exp.icon || 'work' }}</span>
                    </div>
                    <div>
                      <h4 class="text-base font-bold text-gray-800 dark:text-white">{{ exp.title }}</h4>
                      <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-0.5">{{ exp.role }}</p>
                      <p class="text-xs text-gray-600 dark:text-on-surface-variant/80 mt-2 max-w-xl">{{ exp.description }}</p>
                      <div class="flex flex-wrap gap-1.5 mt-3">
                        <span 
                          v-for="tag in exp.tags" 
                          :key="tag"
                          class="text-[9px] font-semibold px-2 py-0.5 rounded"
                          :class="[theme === 'dark' ? 'bg-white/5 text-on-surface-variant border border-white/5' : 'bg-gray-100 text-gray-600 border border-gray-200/50']"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="openExperienceModal(exp, index)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-yellow-600 dark:hover:text-primary transition-all"
                    >
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      @click="deleteExperience(index)"
                      class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
                    >
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="experiences.length === 0" class="text-center py-12 text-gray-400">
                <span class="material-symbols-outlined text-4xl mb-4 block">work_off</span>
                <p class="text-sm">No experience added yet. Click "Add Project" to get started.</p>
              </div>
            </div>
          </div>

          <!-- Experience Modal -->
          <div 
            v-if="showExperienceModal" 
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click.self="showExperienceModal = false"
          >
            <div class="w-full max-w-lg rounded-2xl border p-6 max-h-[90vh] overflow-y-auto"
              :class="[theme === 'dark' ? 'bg-surface-container border-white/10' : 'bg-white border-gray-200']">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                  {{ editingExperienceIndex >= 0 ? 'Edit Project' : 'Add Project' }}
                </h3>
                <button @click="showExperienceModal = false" class="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <form @submit.prevent="saveExperience" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Project Title</label>
                  <input 
                    v-model="experienceForm.title"
                    type="text" 
                    required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. KCM Interior Design"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Role</label>
                  <input 
                    v-model="experienceForm.role"
                    type="text" 
                    required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. Full-stack Developer"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Description</label>
                  <textarea 
                    v-model="experienceForm.description"
                    rows="3"
                    required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all resize-none"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="Brief description of the project..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Icon (Material Symbols)</label>
                  <input 
                    v-model="experienceForm.icon"
                    type="text" 
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. business, smart_toy, dashboard"
                  />
                  <p class="text-[10px] text-gray-400 mt-1">Leave empty for default icon. Examples: business, smart_toy, dashboard, support_agent</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Tags (comma separated)</label>
                  <input 
                    v-model="experienceForm.tagsInput"
                    type="text" 
                    required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. Vue.js, Laravel, MySQL"
                  />
                </div>

                <div class="flex gap-3 pt-4">
                  <button 
                    type="button"
                    @click="showExperienceModal = false"
                    class="flex-1 py-3 rounded-lg border text-sm font-semibold transition-all"
                    :class="[theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-300 hover:bg-gray-50 text-gray-600']"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    class="flex-1 py-3 rounded-lg text-sm font-bold transition-all"
                    :class="[theme === 'dark' ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-yellow-600 text-white hover:bg-yellow-700']"
                  >
                    {{ editingExperienceIndex >= 0 ? 'Update' : 'Save' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Expertise Management (when activeTab === 'expertise') -->
          <div v-if="activeTab === 'expertise'">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white font-display-lg">Manage Expertise</h3>
                <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mt-1">Add, edit, or remove tech stack items from your portfolio</p>
              </div>
              <div class="flex gap-3">
                <button 
                  @click="openCategoryModal()"
                  class="px-4 py-2 text-xs font-semibold rounded-lg border border-yellow-600/30 dark:border-primary/30 text-yellow-600 dark:text-primary hover:bg-yellow-600/5 dark:hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">add</span>
                  Add Category
                </button>
                <button 
                  @click="openExpertiseModal()"
                  class="px-4 py-2 text-xs font-semibold rounded-lg bg-yellow-600 dark:bg-primary text-white dark:text-on-primary hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">add</span>
                  Add Expertise
                </button>
              </div>
            </div>

            <!-- Categories Overview -->
            <div class="mb-8">
              <h4 class="text-sm font-bold text-gray-600 dark:text-on-surface-variant/80 mb-3 uppercase tracking-wider">Categories</h4>
              <div class="flex flex-wrap gap-3">
                <div 
                  v-for="(cat, ci) in expertiseCategories" 
                  :key="cat.id"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all"
                  :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5 hover:border-primary/20' : 'bg-white border-gray-200']"
                >
                  <span class="text-xs font-bold text-yellow-600 dark:text-primary">{{ ci + 1 }}.</span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-white">{{ cat.label }}</span>
                  <button @click="openCategoryModal(cat, ci)" class="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-gray-400 hover:text-yellow-600 dark:hover:text-primary transition-all">
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button @click="deleteCategory(ci)" class="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500 transition-all">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Expertise List grouped by category -->
            <div v-for="cat in expertiseCategories" :key="cat.id" class="mb-8">
              <h4 class="text-sm font-bold text-gray-600 dark:text-on-surface-variant/80 mb-3 uppercase tracking-wider">{{ cat.label }}</h4>
              <div class="space-y-3">
                <div 
                  v-for="(item, idx) in expertiseItems.filter(e => e.category === cat.id)" 
                  :key="item.id"
                  class="p-5 rounded-xl border transition-all hover:shadow-md"
                  :class="[theme === 'dark' ? 'bg-surface-container/70 border-white/5 hover:border-primary/20' : 'bg-white border-gray-200']"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-4">
                      <div class="w-11 h-11 rounded-xl flex items-center justify-center"
                        :class="[theme === 'dark' ? 'bg-primary/10 text-primary' : 'bg-yellow-600/10 text-yellow-600']">
                        <span class="material-symbols-outlined">{{ item.icon || 'code' }}</span>
                      </div>
                      <div>
                        <h5 class="text-sm font-bold text-gray-800 dark:text-white">{{ item.title }}</h5>
                        <p class="text-xs text-gray-600 dark:text-on-surface-variant/80 mt-1 max-w-xl">{{ item.description }}</p>
                        <div class="flex flex-wrap gap-1.5 mt-2">
                          <span 
                            v-for="tag in item.tags" 
                            :key="tag"
                            class="text-[9px] font-semibold px-2 py-0.5 rounded"
                            :class="[theme === 'dark' ? 'bg-white/5 text-on-surface-variant border border-white/5' : 'bg-gray-100 text-gray-600 border border-gray-200/50']"
                          >{{ tag }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button @click="openExpertiseModal(item)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-yellow-600 dark:hover:text-primary transition-all">
                        <span class="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button @click="deleteExpertise(item.id)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all">
                        <span class="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="expertiseItems.filter(e => e.category === cat.id).length === 0" 
                  class="p-4 rounded-xl border border-dashed text-center text-xs text-gray-400"
                  :class="[theme === 'dark' ? 'border-white/10' : 'border-gray-200']">
                  No items in this category yet.
                </div>
              </div>
            </div>
          </div>

          <!-- Expertise Modal -->
          <div 
            v-if="showExpertiseModal" 
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click.self="showExpertiseModal = false"
          >
            <div class="w-full max-w-lg rounded-2xl border p-6 max-h-[90vh] overflow-y-auto"
              :class="[theme === 'dark' ? 'bg-surface-container border-white/10' : 'bg-white border-gray-200']">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                  {{ editingExpertiseId ? 'Edit Expertise' : 'Add Expertise' }}
                </h3>
                <button @click="showExpertiseModal = false" class="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <form @submit.prevent="saveExpertise" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Title</label>
                  <input v-model="expertiseForm.title" type="text" required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. Web Development" />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Category</label>
                  <select v-model="expertiseForm.category" required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all cursor-pointer"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']">
                    <option v-for="cat in expertiseCategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Description</label>
                  <textarea v-model="expertiseForm.description" rows="3" required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all resize-none"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="Brief description of the capability..."></textarea>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Icon (Material Symbols)</label>
                  <input v-model="expertiseForm.icon" type="text"
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. code, dns, forum, smart_toy" />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Tags (comma separated)</label>
                  <input v-model="expertiseForm.tagsInput" type="text" required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. Vue.js, JavaScript, Tailwind CSS" />
                </div>

                <div class="flex gap-3 pt-4">
                  <button type="button" @click="showExpertiseModal = false"
                    class="flex-1 py-3 rounded-lg border text-sm font-semibold transition-all"
                    :class="[theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-300 hover:bg-gray-50 text-gray-600']">
                    Cancel
                  </button>
                  <button type="submit"
                    class="flex-1 py-3 rounded-lg text-sm font-bold transition-all"
                    :class="[theme === 'dark' ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-yellow-600 text-white hover:bg-yellow-700']">
                    {{ editingExpertiseId ? 'Update' : 'Save' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Category Modal -->
          <div 
            v-if="showCategoryModal" 
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click.self="showCategoryModal = false"
          >
            <div class="w-full max-w-md rounded-2xl border p-6"
              :class="[theme === 'dark' ? 'bg-surface-container border-white/10' : 'bg-white border-gray-200']">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                  {{ editingCategoryIndex >= 0 ? 'Edit Category' : 'Add Category' }}
                </h3>
                <button @click="showCategoryModal = false" class="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <form @submit.prevent="saveCategory" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Category ID</label>
                  <input v-model="categoryForm.id" type="text" required :disabled="editingCategoryIndex >= 0"
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all disabled:opacity-50"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. devops" />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-600 dark:text-on-surface-variant">Label</label>
                  <input v-model="categoryForm.label" type="text" required
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[theme === 'dark' ? 'bg-background border-white/10 focus:border-primary text-white' : 'bg-gray-50 border-gray-300 focus:border-yellow-600 text-gray-900']"
                    placeholder="e.g. 04. DEVOPS" />
                </div>

                <div class="flex gap-3 pt-4">
                  <button type="button" @click="showCategoryModal = false"
                    class="flex-1 py-3 rounded-lg border text-sm font-semibold transition-all"
                    :class="[theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-300 hover:bg-gray-50 text-gray-600']">
                    Cancel
                  </button>
                  <button type="submit"
                    class="flex-1 py-3 rounded-lg text-sm font-bold transition-all"
                    :class="[theme === 'dark' ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-yellow-600 text-white hover:bg-yellow-700']">
                    {{ editingCategoryIndex >= 0 ? 'Update' : 'Save' }}
                  </button>
                </div>
              </form>
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

const API_BASE = '/api'

const theme = ref('dark')
const activeTab = ref('dashboard')
const chartType = ref('daily')
const mobileSidebarOpen = ref(false)

// Authentication state
const isAuthenticated = ref(false)
const authToken = ref(null)
const username = ref('')
const password = ref('')
const loginError = ref('')

// Tabs config
const tabs = [
  { name: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { name: 'experience', label: 'Experience', icon: 'work' },
  { name: 'expertise', label: 'Expertise', icon: 'psychology' },
  { name: 'settings', label: 'Settings', icon: 'settings' }
]

// Password change state
const passwordChange = ref({
  current: '',
  newPassword: '',
  confirm: '',
  error: '',
  success: false
})

// Change password handler
const changePassword = async () => {
  passwordChange.value.error = ''
  passwordChange.value.success = false
  
  // Validate
  if (passwordChange.value.newPassword !== passwordChange.value.confirm) {
    passwordChange.value.error = 'New passwords do not match!'
    return
  }
  
  if (passwordChange.value.newPassword.length < 6) {
    passwordChange.value.error = 'Password must be at least 6 characters!'
    return
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken.value}`
      },
      body: JSON.stringify({
        currentPassword: passwordChange.value.current,
        newPassword: passwordChange.value.newPassword
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      passwordChange.value.error = data.error || 'Failed to change password'
      return
    }
    
    // Reset form
    passwordChange.value = {
      current: '',
      newPassword: '',
      confirm: '',
      error: '',
      success: true
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      passwordChange.value.success = false
    }, 3000)
  } catch (error) {
    passwordChange.value.error = 'Network error. Please try again.'
  }
}

// Authentication operations
const handleLogin = async () => {
  loginError.value = ''
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: username.value, 
        password: password.value 
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      loginError.value = data.error || 'Invalid credentials!'
      return
    }
    
    // Store token in sessionStorage (cleared on tab close)
    authToken.value = data.token
    isAuthenticated.value = true
    sessionStorage.setItem('admin_token', data.token)
  } catch (error) {
    loginError.value = 'Network error. Please try again.'
  }
}

// Log database (kept for dashboard tab)
const logs = ref([])

// Experience management
const experiences = ref([])
const showExperienceModal = ref(false)
const editingExperienceIndex = ref(-1)
const experienceForm = ref({
  title: '',
  role: '',
  description: '',
  icon: '',
  tagsInput: ''
})

// Load experiences from API
const loadExperiences = async () => {
  try {
    const res = await fetch(`${API_BASE}/experiences`)
    if (res.ok) {
      experiences.value = await res.json()
    }
  } catch {
    experiences.value = []
  }
}

// Save experiences to API
const saveExperiences = async () => {
  try {
    await fetch(`${API_BASE}/experiences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken.value}`
      },
      body: JSON.stringify({ experiences: experiences.value })
    })
  } catch {
    console.error('Failed to save experiences')
  }
}

// Open experience modal
const openExperienceModal = (exp = null, index = -1) => {
  if (exp) {
    editingExperienceIndex.value = index
    experienceForm.value = {
      title: exp.title,
      role: exp.role,
      description: exp.description,
      icon: exp.icon || '',
      tagsInput: exp.tags.join(', ')
    }
  } else {
    editingExperienceIndex.value = -1
    experienceForm.value = {
      title: '',
      role: '',
      description: '',
      icon: '',
      tagsInput: ''
    }
  }
  showExperienceModal.value = true
}

// Save experience
const saveExperience = () => {
  const newExp = {
    id: Date.now(),
    title: experienceForm.value.title,
    role: experienceForm.value.role,
    description: experienceForm.value.description,
    icon: experienceForm.value.icon || 'work',
    tags: experienceForm.value.tagsInput.split(',').map(t => t.trim()).filter(t => t)
  }

  if (editingExperienceIndex.value >= 0) {
    newExp.id = experiences.value[editingExperienceIndex.value].id
    experiences.value[editingExperienceIndex.value] = newExp
  } else {
    experiences.value.push(newExp)
  }

  saveExperiences()
  showExperienceModal.value = false
}

// Delete experience
const deleteExperience = (index) => {
  if (confirm('Are you sure you want to delete this project?')) {
    experiences.value.splice(index, 1)
    saveExperiences()
  }
}

// === Expertise Management ===
const expertiseItems = ref([])
const expertiseCategories = ref([])
const showExpertiseModal = ref(false)
const editingExpertiseId = ref(null)
const showCategoryModal = ref(false)
const editingCategoryIndex = ref(-1)
const expertiseForm = ref({ title: '', category: 'development', description: '', icon: '', tagsInput: '' })
const categoryForm = ref({ id: '', label: '' })

const loadExpertise = async () => {
  try {
    const res = await fetch(`${API_BASE}/expertise`)
    if (res.ok) {
      const data = await res.json()
      expertiseItems.value = data.expertise || []
      expertiseCategories.value = data.categories || []
    }
  } catch {
    expertiseItems.value = []
    expertiseCategories.value = []
  }
}

const saveExpertiseToAPI = async () => {
  try {
    await fetch(`${API_BASE}/expertise`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken.value}`
      },
      body: JSON.stringify({ expertise: expertiseItems.value, categories: expertiseCategories.value })
    })
  } catch {
    console.error('Failed to save expertise')
  }
}

const openExpertiseModal = (item = null) => {
  if (item) {
    editingExpertiseId.value = item.id
    expertiseForm.value = {
      title: item.title,
      category: item.category,
      description: item.description,
      icon: item.icon || '',
      tagsInput: item.tags.join(', ')
    }
  } else {
    editingExpertiseId.value = null
    expertiseForm.value = { title: '', category: expertiseCategories.value[0]?.id || 'development', description: '', icon: '', tagsInput: '' }
  }
  showExpertiseModal.value = true
}

const saveExpertise = () => {
  const newItem = {
    id: editingExpertiseId.value || Date.now(),
    category: expertiseForm.value.category,
    icon: expertiseForm.value.icon || 'code',
    title: expertiseForm.value.title,
    description: expertiseForm.value.description,
    tags: expertiseForm.value.tagsInput.split(',').map(t => t.trim()).filter(t => t)
  }
  if (editingExpertiseId.value) {
    const idx = expertiseItems.value.findIndex(e => e.id === editingExpertiseId.value)
    if (idx >= 0) expertiseItems.value[idx] = newItem
  } else {
    expertiseItems.value.push(newItem)
  }
  saveExpertiseToAPI()
  showExpertiseModal.value = false
}

const deleteExpertise = (id) => {
  if (confirm('Delete this expertise item?')) {
    expertiseItems.value = expertiseItems.value.filter(e => e.id !== id)
    saveExpertiseToAPI()
  }
}

const openCategoryModal = (cat = null, index = -1) => {
  editingCategoryIndex.value = index
  if (cat) {
    categoryForm.value = { id: cat.id, label: cat.label }
  } else {
    categoryForm.value = { id: '', label: '' }
  }
  showCategoryModal.value = true
}

const saveCategory = () => {
  const newCat = { id: categoryForm.value.id.trim(), label: categoryForm.value.label.trim() }
  if (editingCategoryIndex.value >= 0) {
    expertiseCategories.value[editingCategoryIndex.value] = newCat
  } else {
    expertiseCategories.value.push(newCat)
  }
  saveExpertiseToAPI()
  showCategoryModal.value = false
}

const deleteCategory = (index) => {
  const cat = expertiseCategories.value[index]
  const itemsInCat = expertiseItems.value.filter(e => e.category === cat.id).length
  if (itemsInCat > 0 && !confirm(`Category has ${itemsInCat} items. Delete category AND its items?`)) return
  expertiseItems.value = expertiseItems.value.filter(e => e.category !== cat.id)
  expertiseCategories.value.splice(index, 1)
  saveExpertiseToAPI()
}

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


const handleLogout = () => {
  isAuthenticated.value = false
  authToken.value = null
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
  // Check auth state from sessionStorage
  const savedToken = sessionStorage.getItem('admin_token')
  if (savedToken) {
    authToken.value = savedToken
    isAuthenticated.value = true
  }

  // Load theme preference
  theme.value = localStorage.getItem('theme') || 'dark'
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  }

  // Load experiences
  loadExperiences()

  // Load expertise
  loadExpertise()

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

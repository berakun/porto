<template>
  <div class="transition-colors duration-500 bg-white text-gray-900 dark:bg-background dark:text-on-background min-h-screen font-body-md relative overflow-x-hidden selection:bg-primary/30">
    
    <!-- Navigation Bar -->
    <nav
      id="navbar"
      class="fixed top-0 left-0 right-0 h-20 transition-all duration-500 z-50 flex items-center border-b"
      :class="[
        isHidden ? '-translate-y-full' : 'translate-y-0',
        'bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-xl border-gray-200/50 dark:border-white/10'
      ]"
    >
      <div class="container mx-auto px-6 md:px-12 flex justify-between items-center w-full">
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer text-yellow-600 dark:text-primary transition-colors" @click="scrollToSection('hero')">
          <svg class="w-7 h-7" viewBox="0 0 100 100" fill="none">
            <path d="M20 20h30c10 0 15 5 15 15s-5 15-15 15H20v30" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M55 50l15 30" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M75 20H85v60H75M85 50H75" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="flex flex-col">
            <span class="font-display-lg text-sm leading-none tracking-wider font-bold uppercase">Rifki Firdaus</span>
            <span class="text-[9px] uppercase tracking-widest text-gray-500 dark:text-on-surface-variant/70 font-code-sm">PORTFOLIO</span>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-6 md:gap-10">
          <button
            type="button"
            @click="scrollToSection('hero')"
            class="text-[11px] md:text-xs font-code-sm font-semibold transition-all duration-200 text-gray-600 dark:text-on-surface-variant hover:text-red-700 dark:hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-yellow-600 dark:after:bg-primary hover:after:w-full after:transition-all"
          >
            01. HOME
          </button>
          <button
            type="button"
            @click="scrollToSection('about')"
            class="text-[11px] md:text-xs font-code-sm font-semibold transition-all duration-200 text-gray-600 dark:text-on-surface-variant hover:text-red-700 dark:hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-yellow-600 dark:after:bg-primary hover:after:w-full after:transition-all"
          >
            02. ABOUT
          </button>
          <button
            type="button"
            @click="scrollToSection('work-tracing')"
            class="text-[11px] md:text-xs font-code-sm font-semibold transition-all duration-200 text-gray-600 dark:text-on-surface-variant hover:text-red-700 dark:hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-yellow-600 dark:after:bg-primary hover:after:w-full after:transition-all"
          >
            03. WORK TRACING
          </button>
          <button
            type="button"
            @click="scrollToSection('experience')"
            class="text-[11px] md:text-xs font-code-sm font-semibold transition-all duration-200 text-gray-600 dark:text-on-surface-variant hover:text-red-700 dark:hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-yellow-600 dark:after:bg-primary hover:after:w-full after:transition-all"
          >
            04. EXPERIENCE
          </button>
          <button
            type="button"
            @click="scrollToSection('portfolio')"
            class="text-[11px] md:text-xs font-code-sm font-semibold transition-all duration-200 text-gray-600 dark:text-on-surface-variant hover:text-red-700 dark:hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-yellow-600 dark:after:bg-primary hover:after:w-full after:transition-all"
          >
            05. EXPERTISE
          </button>

          <!-- Theme Switcher -->
          <button
            type="button"
            @click="toggleTheme"
            class="p-2 rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-on-surface-variant hover:text-yellow-600 dark:hover:text-primary hover:border-yellow-600 dark:hover:border-primary transition-all"
            aria-label="Toggle Theme"
          >
            <span class="material-symbols-outlined block text-base">
              {{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
        </div>

        <!-- Mobile: Hamburger + Theme Toggle -->
        <div class="flex md:hidden items-center gap-3">
          <button
            type="button"
            @click="toggleTheme"
            class="p-2 rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-on-surface-variant hover:text-yellow-600 dark:hover:text-primary hover:border-yellow-600 dark:hover:border-primary transition-all"
            aria-label="Toggle Theme"
          >
            <span class="material-symbols-outlined block text-base">
              {{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-on-surface-variant hover:text-yellow-600 dark:hover:text-primary transition-all"
            aria-label="Toggle Menu"
          >
            <div class="w-5 h-4 flex flex-col justify-between">
              <span class="block h-[2px] rounded-full bg-current transition-all duration-300" :class="mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''"></span>
              <span class="block h-[2px] rounded-full bg-current transition-all duration-300" :class="mobileMenuOpen ? 'opacity-0 scale-x-0' : ''"></span>
              <span class="block h-[2px] rounded-full bg-current transition-all duration-300" :class="mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''"></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition name="dropdown">
        <div
          v-if="mobileMenuOpen"
          class="md:hidden absolute top-full left-0 right-0 border-b shadow-xl z-40"
          :class="[
            theme === 'dark' ? 'bg-[#0b0f17] border-white/10 backdrop-blur-xl' : 'bg-white border-gray-200 backdrop-blur-xl'
          ]"
        >
          <div class="container mx-auto px-6 py-4 flex flex-col gap-1">
            <button
              type="button"
              @click="scrollToSection('hero'); mobileMenuOpen = false"
              class="w-full text-left px-4 py-3 rounded-lg text-[11px] font-code-sm font-semibold transition-all duration-200"
              :class="[
                theme === 'dark'
                  ? 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-red-700'
              ]"
            >
              01. HOME
            </button>
            <button
              type="button"
              @click="scrollToSection('about'); mobileMenuOpen = false"
              class="w-full text-left px-4 py-3 rounded-lg text-[11px] font-code-sm font-semibold transition-all duration-200"
              :class="[
                theme === 'dark'
                  ? 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-red-700'
              ]"
            >
              02. ABOUT
            </button>
            <button
              type="button"
              @click="scrollToSection('work-tracing'); mobileMenuOpen = false"
              class="w-full text-left px-4 py-3 rounded-lg text-[11px] font-code-sm font-semibold transition-all duration-200"
              :class="[
                theme === 'dark'
                  ? 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-red-700'
              ]"
            >
              03. WORK TRACING
            </button>
            <button
              type="button"
              @click="scrollToSection('experience'); mobileMenuOpen = false"
              class="w-full text-left px-4 py-3 rounded-lg text-[11px] font-code-sm font-semibold transition-all duration-200"
              :class="[
                theme === 'dark'
                  ? 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-red-700'
              ]"
            >
              04. EXPERIENCE
            </button>
            <button
              type="button"
              @click="scrollToSection('portfolio'); mobileMenuOpen = false"
              class="w-full text-left px-4 py-3 rounded-lg text-[11px] font-code-sm font-semibold transition-all duration-200"
              :class="[
                theme === 'dark'
                  ? 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-red-700'
              ]"
            >
              05. EXPERTISE
            </button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="min-h-screen pt-28 flex items-center relative z-10 px-6 md:px-12 dark:bg-[#0b0f17]">
      <div class="container mx-auto relative z-10 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Text Content -->
          <div class="lg:col-span-7 flex flex-col items-start relative pl-4 md:pl-8 border-l border-yellow-600/30 dark:border-primary/20">
            <span class="text-xs font-code-sm text-yellow-600 dark:text-primary tracking-widest uppercase mb-3">01. INTRODUCTION</span>
            
            <h2 class="font-display-lg text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-gray-900 dark:text-white mb-6">
              Hey, I'm <span class="text-yellow-600 dark:text-primary">Rifki<br/>Firdaus<br/>Kurniawan</span>
            </h2>

            <!-- Terminal-style Profile Window -->
            <div class="w-full max-w-xl rounded-xl border overflow-hidden shadow-lg transition-colors duration-300"
              :class="[
                theme === 'dark' ? 'bg-[#161b25] border-white/10' : 'bg-gray-50 border-gray-200'
              ]"
            >
              <!-- Window top header -->
              <div class="px-4 py-3 border-b flex justify-between items-center bg-black/10 dark:bg-black/20"
                :class="[theme === 'dark' ? 'border-white/5' : 'border-gray-200']"
              >
                <!-- Control dots -->
                <div class="flex gap-2">
                  <span class="w-3 h-3 rounded-full bg-red-500"></span>
                  <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span class="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <!-- Monospace file label -->
                <span class="text-[10px] font-code-sm text-gray-500 dark:text-on-surface-variant/80">PROFILE_SHEET.TXT</span>
              </div>

              <!-- Terminal body -->
              <div class="p-6">
                <p class="text-xs md:text-sm text-gray-600 dark:text-[#dee2f1] font-code-sm text-justify leading-relaxed mb-6">
                  <span class="text-yellow-600 dark:text-primary font-semibold">A Full-stack Developer specializing in AI Chatbots & Web Applications</span> based in Yogyakarta. I build custom websites and maintain chatbot AI systems with JavaScript-based agentic architecture. With expertise in Vue.js, PHP Laravel, and creating custom dashboards for monitoring & analytics.
                </p>
                <button
                  type="button"
                  @click="scrollToSection('contact')"
                  class="px-6 py-2.5 text-xs font-code-sm font-bold rounded-lg shadow-md transition-all duration-300 transform active:scale-95 flex items-center gap-2"
                  :class="[
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-[#f6be39] to-[#fd8b00] text-[#0e131d] hover:shadow-[0_0_15px_rgba(246,190,57,0.4)]'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  ]"
                >
                  CONTACT ME <span class="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Hero Right Detail (Giant Semi-Circle) -->
          <div class="lg:col-span-5 flex justify-end h-full relative">
            <div
              class="w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[350px] md:h-[500px] rounded-l-full border transition-all duration-700 pointer-events-none"
              :class="[
                onIsHidden ? 'opacity-0 translate-x-20' : 'opacity-100 translate-x-0',
                theme === 'dark' ? 'bg-[#161b25]/60 border-white/5 shadow-2xl' : 'bg-red-800 border-red-900 shadow-[0_4px_20px_rgba(239,68,68,0.05)]'
              ]"
            ></div>
          </div>

        </div>
      </div>
    </section>

    <!-- About Me Section -->
    <section id="about" class="py-28 border-t relative z-10 px-6 md:px-12 dark:bg-[#0b0f17] border-gray-150 dark:border-white/5">
      <div class="container mx-auto">
        <!-- Title -->
        <div class="flex flex-col items-start mb-8">
          <span class="text-xs font-code-sm text-yellow-600 dark:text-primary tracking-widest uppercase mb-3">02. BACKGROUND</span>
          <h3 class="font-display-lg text-3xl md:text-4xl font-bold text-gray-900 dark:text-white relative pb-3">
            About Me
            <span class="absolute bottom-0 left-0 w-12 h-1 bg-yellow-600 dark:bg-primary"></span>
          </h3>
        </div>

        <!-- Bio -->
        <p class="text-sm md:text-base text-gray-600 dark:text-on-surface-variant text-justify leading-relaxed mb-8">
          I am a Computer Science graduate, class of 2022, with 4+ years of experience at Botika specializing in web application development and conversational AI systems. For nearly 4 years as a Chatbot AI Developer, I built, maintained, and customized chatbot platforms for enterprise clients from designing conversation flows to managing production deployments and creating custom dashboards for monitoring and analytics. In my current role as Full-stack Developer, I continue maintaining chatbot AI systems built with JavaScript-based agentic architecture, while developing web applications with Vue.js and PHP Laravel backends.
        </p>

        <!-- 4 Info Cards — equal height -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Education -->
          <div class="p-6 rounded-xl border flex items-start gap-4 transition-all duration-300"
            :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5 hover:border-primary/20' : 'bg-gray-50 border-gray-200']"
          >
            <span class="material-symbols-outlined text-2xl text-yellow-600 dark:text-primary mt-1">school</span>
            <div>
              <h4 class="text-xs font-code-sm text-gray-500 uppercase tracking-wider mb-1">Education</h4>
              <p class="text-sm font-semibold text-gray-800 dark:text-white">Computer Science Grad</p>
              <p class="text-xs text-gray-500 dark:text-on-surface-variant/80">Class of 2022</p>
            </div>
          </div>

          <!-- Location -->
          <div class="p-6 rounded-xl border flex items-start gap-4 transition-all duration-300"
            :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5 hover:border-primary/20' : 'bg-gray-50 border-gray-200']"
          >
            <span class="material-symbols-outlined text-2xl text-yellow-600 dark:text-primary mt-1">distance</span>
            <div>
              <h4 class="text-xs font-code-sm text-gray-500 uppercase tracking-wider mb-1">Location</h4>
              <p class="text-sm font-semibold text-gray-800 dark:text-white">Yogyakarta, Indonesia</p>
              <p class="text-xs text-gray-500 dark:text-on-surface-variant/80">Tech Center</p>
            </div>
          </div>

          <!-- Experience -->
          <div class="p-6 rounded-xl border flex items-start gap-4 transition-all duration-300"
            :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5 hover:border-primary/20' : 'bg-gray-50 border-gray-200']"
          >
            <span class="material-symbols-outlined text-2xl text-yellow-600 dark:text-primary mt-1">work_history</span>
            <div>
              <h4 class="text-xs font-code-sm text-gray-500 uppercase tracking-wider mb-1">Experience</h4>
              <p class="text-sm font-semibold text-gray-800 dark:text-white">4+ Years</p>
              <p class="text-xs text-gray-500 dark:text-on-surface-variant/80">Professional career</p>
            </div>
          </div>

          <!-- Projects -->
          <div class="p-6 rounded-xl border flex items-start gap-4 transition-all duration-300"
            :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5 hover:border-primary/20' : 'bg-gray-50 border-gray-200']"
          >
            <span class="material-symbols-outlined text-2xl text-yellow-600 dark:text-primary mt-1">checklist</span>
            <div>
              <h4 class="text-xs font-code-sm text-gray-500 uppercase tracking-wider mb-1">Projects</h4>
              <p class="text-sm font-semibold text-gray-800 dark:text-white">15+ Completed</p>
              <p class="text-xs text-gray-500 dark:text-on-surface-variant/80">Enterprise chatbots & web apps</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Work Tracing Section -->
    <section id="work-tracing" class="py-28 border-t relative z-10 px-6 md:px-12 dark:bg-[#0b0f17] border-gray-150 dark:border-white/5">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <span class="text-xs font-code-sm text-yellow-600 dark:text-primary tracking-widest uppercase mb-3 block">03. WORK TRACING</span>
          <h3 class="font-display-lg text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Career Timeline</h3>
          <p class="text-xs font-code-sm text-gray-500 dark:text-on-surface-variant/80 mt-2">Professional journey & work experience</p>
        </div>

        <div class="max-w-3xl mx-auto">
          <div class="relative">
            <!-- Vertical timeline line -->
            <div class="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-white/10"></div>

            <div v-if="workTracing.length === 0" class="text-center py-12">
              <span class="material-symbols-outlined text-4xl text-gray-300 dark:text-white/10 block mb-3">work_history</span>
              <p class="text-sm text-gray-400 dark:text-on-surface-variant/60">No work history yet.</p>
            </div>

            <div v-for="(work, i) in workTracing" :key="work.id" class="relative pl-14 pb-12 last:pb-0">
              <!-- Timeline dot -->
              <div class="absolute left-[13px] w-[14px] h-[14px] rounded-full border-2 z-10"
                :class="[work.is_current 
                  ? 'bg-yellow-600 dark:bg-primary border-yellow-600 dark:border-primary shadow-[0_0_10px_rgba(246,190,57,0.5)]' 
                  : 'bg-white dark:bg-[#0b0f17] border-gray-300 dark:border-white/20']">
              </div>

              <!-- Content Card -->
              <div class="p-6 rounded-xl border transition-all duration-300"
                :class="[theme === 'dark' 
                  ? 'bg-[#161b25] border-white/5 hover:border-primary/20' 
                  : 'bg-gray-50 border-gray-200 hover:border-yellow-600/20']">
                
                <!-- Header -->
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="text-[10px] font-code-sm text-gray-400 dark:text-on-surface-variant/60 uppercase tracking-wider mb-1">{{ work.type.replace('-',' ') }}</p>
                    <h4 class="text-base font-bold text-gray-800 dark:text-white">{{ work.title }}</h4>
                    <p class="text-sm text-yellow-600 dark:text-primary font-semibold">{{ work.company }}</p>
                  </div>
                  <span v-if="work.is_current" class="text-[10px] font-code-sm px-2 py-1 rounded-full border whitespace-nowrap"
                    :class="[theme === 'dark' ? 'border-primary/30 text-primary bg-primary/5' : 'border-yellow-600/30 text-yellow-700 bg-yellow-50']">
                    Current
                  </span>
                </div>

                <!-- Meta -->
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400 dark:text-on-surface-variant/60 mb-3">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">calendar_month</span>
                    {{ formatDate(work.start_date) }} — {{ work.is_current ? 'Present' : formatDate(work.end_date) }}
                  </span>
                  <span v-if="work.location" class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">location_on</span>
                    {{ work.location }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">schedule</span>
                    {{ calcDuration(work) }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs text-gray-600 dark:text-on-surface-variant/80 leading-relaxed mb-3">{{ work.description }}</p>

                <!-- Tags -->
                <div v-if="work.tags && work.tags.length" class="flex flex-wrap gap-1.5">
                  <span v-for="tag in work.tags" :key="tag" class="text-[9px] font-code-sm px-2 py-0.5 rounded-md"
                    :class="[theme === 'dark' ? 'bg-white/5 text-gray-300' : 'bg-gray-200/70 text-gray-600']">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="py-28 border-t relative z-10 px-6 md:px-12 dark:bg-[#0b0f17] border-gray-150 dark:border-white/5">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <span class="text-xs font-code-sm text-yellow-600 dark:text-primary tracking-widest uppercase mb-3 block">04. EXPERIENCE</span>
          <h3 class="font-display-lg text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Projects & Work</h3>
          <p class="text-xs font-code-sm text-gray-500 dark:text-on-surface-variant/80 mt-2">Featured projects and contributions</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="exp in experiences" 
            :key="exp.id"
            class="p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5 hover:border-primary/20' : 'bg-white border-gray-200']">
            <div class="flex items-center gap-3 mb-4">
              <span class="material-symbols-outlined text-2xl text-yellow-600 dark:text-primary">{{ exp.icon || 'work' }}</span>
              <div>
                <h4 class="text-base font-bold text-gray-800 dark:text-white">{{ exp.title }}</h4>
                <p class="text-[10px] font-code-sm text-gray-500 dark:text-on-surface-variant/80">{{ exp.role }}</p>
              </div>
            </div>
            <p class="text-xs text-gray-600 dark:text-on-surface-variant/80 mb-4 text-justify">
              {{ exp.description }}
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tag in exp.tags" 
                :key="tag"
                class="text-[9px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-on-surface-variant px-2 py-0.5 rounded border border-gray-200/50 dark:border-white/5">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Tech Stack Section -->
    <section id="portfolio" class="py-28 border-t relative z-10 px-6 md:px-12 dark:bg-[#0b0f17] border-gray-150 dark:border-white/5">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <span class="text-xs font-code-sm text-yellow-600 dark:text-primary tracking-widest uppercase mb-3 block">05. EXPERTISE</span>
          <h3 class="font-display-lg text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Core Tech Stack</h3>
          <p class="text-xs font-code-sm text-gray-500 dark:text-on-surface-variant/80 mt-2">Featured tools and technologies</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 border rounded-2xl overflow-hidden shadow-md"
          :class="[theme === 'dark' ? 'bg-[#0f1420] border-white/5' : 'bg-gray-50 border-gray-200']"
        >
          <!-- Left sidebar (Tabs navigation) -->
          <div class="lg:col-span-3 border-r flex flex-col py-6"
            :class="[theme === 'dark' ? 'bg-black/10 border-white/5' : 'bg-gray-100 border-gray-200']"
          >
            <button 
              v-for="cat in expertiseCategories"
              :key="cat.id"
              @click="activeCategory = cat.id"
              class="w-full text-left px-8 py-4 font-code-sm text-xs font-semibold transition-all duration-200 flex items-center justify-between"
              :class="[
                activeCategory === cat.id 
                  ? 'text-yellow-600 dark:text-primary border-l-4 border-yellow-600 dark:border-primary bg-yellow-600/5 dark:bg-primary/5'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
              ]"
            >
              {{ cat.label }}
              <span class="material-symbols-outlined text-sm" v-if="activeCategory === cat.id">chevron_right</span>
            </button>
          </div>

          <!-- Right content area -->
          <div class="lg:col-span-9 p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="item in activeCategoryItems" 
                :key="item.title"
                class="p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                :class="[
                  theme === 'dark' 
                    ? 'bg-[#161b25] border-white/5 hover:border-primary/20' 
                    : 'bg-white border-gray-200'
                ]"
              >
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="material-symbols-outlined text-2xl text-yellow-600 dark:text-primary">{{ item.icon }}</span>
                    <span class="text-[10px] font-code-sm text-gray-400">01. CAPABILITY</span>
                  </div>
                  <h4 class="text-base font-bold text-gray-800 dark:text-white mb-2">{{ item.title }}</h4>
                  <p class="text-xs text-gray-500 dark:text-on-surface-variant/80 mb-6 text-justify">{{ item.description }}</p>
                </div>
                
                <div class="flex flex-wrap gap-1.5 pt-4 border-t" :class="[theme === 'dark' ? 'border-white/5' : 'border-gray-150']">
                  <span 
                    v-for="tag in item.tags" 
                    :key="tag"
                    class="text-[9px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-on-surface-variant px-2 py-0.5 rounded border border-gray-200/50 dark:border-white/5"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Let's Collaborate (Contact Form) -->
    <section id="contact" class="py-28 border-t relative z-10 px-6 md:px-12 dark:bg-[#0b0f17] border-gray-150 dark:border-white/5">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Contact Info -->
          <div class="lg:col-span-5 space-y-8">
            <div class="flex flex-col items-start">
              <span class="text-xs font-code-sm text-yellow-600 dark:text-primary tracking-widest uppercase mb-3">06. CONTACT</span>
              <h3 class="font-display-lg text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Let's Collaborate</h3>
              <p class="text-xs font-code-sm text-gray-500 dark:text-on-surface-variant/80 mt-2">Have an exciting project or want to collaborate?</p>
            </div>

            <div class="space-y-6">
              <!-- Item 1 -->
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center border text-yellow-600 dark:text-primary"
                  :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5' : 'bg-gray-50 border-gray-200']"
                >
                  <span class="material-symbols-outlined text-sm">mail</span>
                </div>
                <div>
                  <span class="text-[9px] font-code-sm text-gray-500 uppercase tracking-wider">Email Address</span>
                  <p class="text-sm font-semibold text-gray-800 dark:text-white">ippi.rifki013@mail.com</p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center border text-yellow-600 dark:text-primary"
                  :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5' : 'bg-gray-50 border-gray-200']"
                >
                  <span class="material-symbols-outlined text-sm">phone</span>
                </div>
                <div>
                  <span class="text-[9px] font-code-sm text-gray-500 uppercase tracking-wider">Phone Number</span>
                  <p class="text-sm font-semibold text-gray-800 dark:text-white">+6281329012710</p>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center border text-yellow-600 dark:text-primary"
                  :class="[theme === 'dark' ? 'bg-[#161b25] border-white/5' : 'bg-gray-50 border-gray-200']"
                >
                  <span class="material-symbols-outlined text-sm">location_on</span>
                </div>
                <div>
                  <span class="text-[9px] font-code-sm text-gray-500 uppercase tracking-wider">Current Location</span>
                  <p class="text-sm font-semibold text-gray-800 dark:text-white">Yogyakarta, IDN</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-7">
            <div class="p-8 rounded-2xl border"
              :class="[theme === 'dark' ? 'bg-[#0f1420]/80 border-white/10' : 'bg-gray-50 border-gray-200']"
            >
              <form @submit.prevent="submitContact" class="space-y-6">
                <div>
                  <label class="block text-[10px] font-code-sm uppercase tracking-wider mb-2 text-gray-500">YOUR NAME</label>
                  <input 
                    type="text" 
                    required
                    v-model="contactForm.name"
                    placeholder="Enter your name..."
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[
                      theme === 'dark'
                        ? 'bg-[#161b25] border-white/10 focus:border-primary text-white focus:ring-1 focus:ring-primary'
                        : 'bg-white border-gray-300 focus:border-yellow-600 text-gray-900 focus:ring-1 focus:ring-yellow-600'
                    ]"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-code-sm uppercase tracking-wider mb-2 text-gray-500">PROJECT TYPE</label>
                  <select 
                    required
                    v-model="contactForm.project_type"
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all cursor-pointer"
                    :class="[
                      theme === 'dark'
                        ? 'bg-[#161b25] border-white/10 focus:border-primary text-white focus:ring-1 focus:ring-primary'
                        : 'bg-white border-gray-300 focus:border-yellow-600 text-gray-900 focus:ring-1 focus:ring-yellow-600'
                    ]"
                  >
                    <option value="" disabled selected>Select Project Type</option>
                    <option value="web">Web Development</option>
                    <option value="chatbot">Chatbot Engineering</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-code-sm uppercase tracking-wider mb-2 text-gray-500">PHONE (OPTIONAL)</label>
                  <input 
                    type="tel" 
                    v-model="contactForm.phone"
                    placeholder="+62..."
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
                    :class="[
                      theme === 'dark'
                        ? 'bg-[#161b25] border-white/10 focus:border-primary text-white focus:ring-1 focus:ring-primary'
                        : 'bg-white border-gray-300 focus:border-yellow-600 text-gray-900 focus:ring-1 focus:ring-yellow-600'
                    ]"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-code-sm uppercase tracking-wider mb-2 text-gray-500">MESSAGE</label>
                  <textarea 
                    rows="4" 
                    required
                    v-model="contactForm.message"
                    class="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all resize-none"
                    :class="[
                      theme === 'dark'
                        ? 'bg-[#161b25] border-white/10 focus:border-primary text-white focus:ring-1 focus:ring-primary'
                        : 'bg-white border-gray-300 focus:border-yellow-600 text-gray-900 focus:ring-1 focus:ring-yellow-600'
                    ]"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  class="w-full py-3.5 rounded-lg font-code-sm font-bold shadow transition-all transform active:scale-95 duration-200"
                  :class="[
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-[#f6be39] to-[#fd8b00] text-[#0e131d] hover:shadow-[0_0_15px_rgba(246,190,57,0.3)]'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  ]"
                >
                  {{ sentStatus ? 'MESSAGE SENT!' : 'SEND MESSAGE' }}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t px-6 md:px-12 bg-gray-50 dark:bg-[#080b11] dark:border-white/5 transition-colors">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex flex-col items-center md:items-start">
          <p class="font-display-lg text-xs font-bold text-yellow-600 dark:text-primary">RF | Rifki Firdaus</p>
          <p class="text-[9px] font-code-sm text-gray-400 mt-1 uppercase tracking-wider">
            © 2026. All rights reserved.
          </p>
        </div>
        <div class="flex gap-8 text-[10px] font-code-sm uppercase tracking-wider font-semibold">
          <a class="text-gray-500 hover:text-yellow-600 dark:text-on-surface-variant dark:hover:text-primary transition-all hover:scale-105" href="https://github.com/berakun" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a class="text-gray-500 hover:text-yellow-600 dark:text-on-surface-variant dark:hover:text-primary transition-all hover:scale-105" href="https://www.linkedin.com/in/rifki-firdaus-997112151" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a class="text-gray-500 hover:text-yellow-600 dark:text-on-surface-variant dark:hover:text-primary transition-all hover:scale-105" href="https://www.instagram.com/rifkifir_/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  </div>

  <!-- Toast Notification -->
  <transition name="toast">
    <div v-if="showToast"
      class="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-sm pointer-events-none"
      :class="[
        theme === 'dark'
          ? 'bg-[#161b25]/95 border-primary/30 text-white'
          : 'bg-white/95 border-gray-200 text-gray-800'
      ]"
    >
      <span class="material-symbols-outlined text-lg" :class="toastColor">{{ toastIcon }}</span>
      <span class="text-sm font-semibold">{{ toastMessage }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const theme = ref('dark')
const isHidden = ref(false)
const onIsHidden = ref(false)
const sentStatus = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('check_circle')
const toastColor = ref('text-green-500')
const sending = ref(false)

const contactForm = ref({
  name: '',
  phone: '',
  project_type: '',
  message: ''
})

const lastScrollTop = ref(0)
const onLastScrollTop = ref(0)

const activeCategory = ref('development')
const mobileMenuOpen = ref(false)

const experiences = ref([])
const workTracing = ref([])
// Expertise data from API
const expertiseItems = ref([])
const expertiseCategories = ref([])

const loadExperiences = async () => {
  try {
    const res = await fetch('/api/experiences')
    if (res.ok) {
      experiences.value = await res.json()
    }
  } catch {
    experiences.value = []
  }
}

const loadExpertise = async () => {
  try {
    const res = await fetch('/api/expertise')
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

const loadWorkTracing = async () => {
  try {
    const res = await fetch('/api/work-tracing')
    if (res.ok) workTracing.value = await res.json()
  } catch { workTracing.value = [] }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
}

const calcDuration = (work) => {
  const start = new Date(work.start_date)
  const end = work.is_current ? new Date() : new Date(work.end_date)
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const yrs = Math.floor(months / 12)
  const mos = months % 12
  if (yrs > 0 && mos > 0) return `${yrs} yr${yrs > 1 ? 's' : ''} ${mos} mo`
  if (yrs > 0) return `${yrs} yr${yrs > 1 ? 's' : ''}`
  return `${mos} mo`
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

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  // Navbar hides when scrolling down, shows when scrolling up
  if (scrollTop > lastScrollTop.value && scrollTop > 100) {
    isHidden.value = true
    mobileMenuOpen.value = false
  } else {
    isHidden.value = false
  }
  lastScrollTop.value = scrollTop

  // Semi-circle detail fades out when scrolling down, reappears at the top
  if (scrollTop > onLastScrollTop.value) {
    onIsHidden.value = true
  } else if (scrollTop === 0) {
    onIsHidden.value = false
  }
  onLastScrollTop.value = scrollTop
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const submitContact = async () => {
  if (sending.value) return
  sending.value = true
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm.value)
    })
    if (res.ok) {
      sentStatus.value = true
      contactForm.value = { name: '', phone: '', project_type: '', message: '' }
      toastMessage.value = 'Message sent successfully!'
      toastIcon.value = 'check_circle'
      toastColor.value = 'text-green-500'
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 3500)
    } else {
      toastMessage.value = 'Failed to send. Try again.'
      toastIcon.value = 'error'
      toastColor.value = 'text-red-500'
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 3500)
    }
  } catch {
    toastMessage.value = 'Network error. Check your connection.'
    toastIcon.value = 'error'
    toastColor.value = 'text-red-500'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3500)
  }
  sending.value = false
  setTimeout(() => { sentStatus.value = false }, 3000)
}

const activeCategoryItems = computed(() => {
  return expertiseItems.value.filter(item => item.category === activeCategory.value)
})

const logVisit = async () => {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer || ''
      })
    })
  } catch { /* silent */ }
}

onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'dark'
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  loadExperiences()
  loadWorkTracing()
  loadExpertise()
  logVisit()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* Typography configurations matching DESIGN.md */
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

/* Toast transition */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

/* Mobile menu dropdown */
.dropdown-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

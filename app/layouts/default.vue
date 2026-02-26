<template>
  <div class="min-h-screen bg-white text-zinc-900 dark:bg-[#141414] dark:text-zinc-100">
    <header v-if="!hideChrome"
      class="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/50 dark:border-zinc-800/60 dark:bg-[#141414]/80 dark:supports-[backdrop-filter]:bg-[#141414]/60"
      :style="headerBoxStyle">
      <div class="relative px-[20px]" :style="headerBoxStyle">
        <!-- Left -->
        <div class="fixed left-[5px] top-[5px] z-[60] flex items-center">
          <button
            class="inline-flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 h-8 w-8 sm:h-10 sm:w-10"
            @click="drawerOpen = true" aria-label="Open menu">
            <i class="pi pi-bars text-base sm:text-lg" />
          </button>
        </div>

        <!-- Center -->
        <div class="fixed left-1/2 top-[5px] z-[55] -translate-x-1/2 text-center">
          <div :style="titleWrapStyle">
            <NuxtLink to="/"
              class="block whitespace-nowrap leading-none font-masthead font-normal not-italic tracking-normal text-[24px] sm:text-[72px] lg:text-[100px]">
              <span ref="titleEl" class="block origin-top transition-transform duration-200 will-change-transform"
                :style="isDesktop ? { transform: `scale(${titleScale})` } : undefined">
                The Suicide Expert
              </span>
            </NuxtLink>
          </div>

          <div class="hidden sm:block" :style="subtitleWrapStyle">
            <span ref="subtitleEl"
              class="block text-xl font-serif text-zinc-600 dark:text-zinc-400 italic origin-top transition-[transform,opacity] duration-200 will-change-transform"
              :style="isDesktop ? { transform: `scale(${subtitleScale})`, opacity: subtitleOpacity } : undefined">
              Suicide without censorship
            </span>
          </div>
        </div>

        <!-- Right -->
        <div class="fixed right-[5px] top-[5px] z-[60] flex items-center gap-2">
          <button
            class="inline-flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 h-8 w-8 sm:h-10 sm:w-10"
            @click="toggle" aria-label="Toggle theme">
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-base sm:text-lg" />
          </button>

          <NuxtLink v-if="!user" to="/login"
            class="inline-flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 h-8 w-8 sm:h-10 sm:px-3 sm:w-auto"
            aria-label="Sign in">
            <i v-if="isMobile" class="pi pi-user text-base" />
            <span v-else class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Sign in</span>
          </NuxtLink>

          <div v-else class="flex items-center gap-2">
            <NuxtLink to="/submit"
              class="rounded-lg border border-zinc-200/70 bg-white/60 px-3 py-2 text-sm dark:border-zinc-800/70 dark:bg-black/40">
              Write
            </NuxtLink>

            <button
              class="rounded-lg border border-zinc-200/70 bg-white/60 px-3 py-2 text-sm dark:border-zinc-800/70 dark:bg-black/40"
              @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Drawer -->
    <transition name="fade">
      <div v-if="drawerOpen" class="fixed inset-0 z-[60] bg-black/40" @click="drawerOpen = false" />
    </transition>

    <transition name="slide">
      <aside v-if="drawerOpen"
        class="fixed left-0 top-0 z-[70] h-dvh w-[86vw] max-w-sm border-r border-zinc-200/60 bg-white/95 p-4 backdrop-blur-xs dark:border-zinc-800/60 dark:bg-[#141414]/95">
        <div class="mb-4 flex items-center justify-between">
          <div class="text-sm font-semibold">Menu</div>
          <button
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/70 dark:border-zinc-800/70"
            @click="drawerOpen = false" aria-label="Close menu">
            <i class="pi pi-times" />
          </button>
        </div>

        <nav class="space-y-1 text-sm">
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/">Home</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/submit">Submit
          </NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/about">About
          </NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/contact">Contact
          </NuxtLink>
        </nav>
      </aside>
    </transition>

    <main class="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()

const drawerOpen = ref(false)

const hideChrome = computed(() => {
  const hide = ['/login']
  return hide.some(p => route.path === p || route.path.startsWith(p + '/'))
})

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

const scrollY = ref(0)
const isDesktop = ref(false)
const isMobile = ref(false)

const titleEl = ref<HTMLSpanElement | null>(null)
const subtitleEl = ref<HTMLSpanElement | null>(null)

const baseTitleH = ref(0)
const baseSubtitleH = ref(0)

const measureHeights = async () => {
  await nextTick()
  baseTitleH.value = titleEl.value?.offsetHeight ?? 0
  baseSubtitleH.value = subtitleEl.value?.offsetHeight ?? 0
}

const onResize = async () => {
  isDesktop.value = window.matchMedia('(min-width: 640px)').matches
  isMobile.value = window.matchMedia('(max-width: 639px)').matches
  await measureHeights()
}

const onScroll = () => {
  scrollY.value = window.scrollY || 0
}

onMounted(async () => {
  await onResize()
  onScroll()
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  if (document.fonts?.ready) {
    await document.fonts.ready
    await measureHeights()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
})

const shrink = computed(() => {
  if (!isDesktop.value) return 0
  return Math.min(scrollY.value / 160, 1)
})

const titleScale = computed(() => 1 - 0.7 * shrink.value)
const subtitleScale = computed(() => 1 - 0.6 * shrink.value)
const subtitleOpacity = computed(() => 1 - 0.35 * shrink.value)

const titleBoxH = computed(() => (isDesktop.value ? baseTitleH.value * titleScale.value : 0))
const subtitleBoxH = computed(() => (isDesktop.value ? baseSubtitleH.value * subtitleScale.value : 0))

const GAP = 5
const TOP = 5
const BOTTOM = 5

const headerHeight = computed(() => {
  if (!isDesktop.value) return 72
  return Math.ceil(TOP + titleBoxH.value + GAP + subtitleBoxH.value + BOTTOM)
})

const headerBoxStyle = computed(() => {
  return isDesktop.value ? { height: `${headerHeight.value}px` } : undefined
})

const titleWrapStyle = computed(() => {
  return isDesktop.value ? { height: `${Math.ceil(titleBoxH.value)}px` } : undefined
})

const subtitleWrapStyle = computed(() => {
  return isDesktop.value ? { marginTop: `${GAP}px`, height: `${Math.ceil(subtitleBoxH.value)}px` } : undefined
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 180ms ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>

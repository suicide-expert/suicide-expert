<template>
  <div class="min-h-screen bg-white text-zinc-900 dark:bg-[#141414] dark:text-zinc-100">
    <header
      v-if="!hideChrome"
      class="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/50 dark:border-zinc-800/60 dark:bg-[#141414]/80 dark:supports-[backdrop-filter]:bg-[#141414]/60"
    >
      <div class="mx-auto grid max-w-7xl grid-cols-3 items-center px-2 py-3 sm:px-3">
        <!-- Left -->
        <div class="flex items-center gap-2">
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200/70 bg-white/60 text-sm dark:border-zinc-800/70 dark:bg-black/40"
            @click="drawerOpen = true"
            aria-label="Open menu"
          >
            <i class="pi pi-bars" />
          </button>
        </div>

        <!-- Center -->
        <div class="text-center leading-tight">
          <NuxtLink to="/" class="block text-[15px] font-semibold tracking-tight">
            The Suicide Expert
          </NuxtLink>
          <div class="text-xs text-zinc-600 dark:text-zinc-400">
            blablabla
          </div>
        </div>

        <!-- Right -->
        <div class="flex items-center justify-end gap-2">
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
            @click="toggle" aria-label="Toggle theme">
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-lg" />
          </button>

          <NuxtLink v-if="!user" to="/login"
            class="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
            Login
          </NuxtLink>

          <div v-else class="flex items-center gap-2">
            <NuxtLink
              to="/submit"
              class="rounded-lg border border-zinc-200/70 bg-white/60 px-3 py-2 text-sm dark:border-zinc-800/70 dark:bg-black/40"
            >
              Write
            </NuxtLink>

            <button
              class="rounded-lg border border-zinc-200/70 bg-white/60 px-3 py-2 text-sm dark:border-zinc-800/70 dark:bg-black/40"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Drawer -->
    <transition name="fade">
      <div
        v-if="drawerOpen"
        class="fixed inset-0 z-[60] bg-black/40"
        @click="drawerOpen = false"
      />
    </transition>

    <transition name="slide">
      <aside
        v-if="drawerOpen"
        class="fixed left-0 top-0 z-[70] h-dvh w-[86vw] max-w-sm border-r border-zinc-200/60 bg-white/95 p-4 backdrop-blur-xs dark:border-zinc-800/60 dark:bg-[#141414]/95"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="text-sm font-semibold">Menu</div>
          <button
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/70 dark:border-zinc-800/70"
            @click="drawerOpen = false"
            aria-label="Close menu"
          >
            <i class="pi pi-times" />
          </button>
        </div>

        <nav class="space-y-1 text-sm">
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/">Home</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/submit">Submit</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/about">About</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/contact">Contact</NuxtLink>
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

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-black/60">
      <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <NuxtLink to="/" class="text-lg font-semibold">
          The Sardine Expert
        </NuxtLink>

        <div class="flex-1" />

        <button class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm" @click="toggle">
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />
          <span class="hidden sm:inline">
            {{ isDark ? 'Light' : 'Dark' }}
          </span>
        </button>

        <NuxtLink v-if="!user" to="/login" class="rounded-lg border px-3 py-2 text-sm">
          Login
        </NuxtLink>

        <div v-else class="flex items-center gap-2">
          <NuxtLink to="/submit" class="rounded-lg border px-3 py-2 text-sm">
            Write
          </NuxtLink>

          <button class="rounded-lg border px-3 py-2 text-sm" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>

<style scoped></style>

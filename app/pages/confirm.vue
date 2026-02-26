<template>
  <div class="mx-auto max-w-md space-y-4">
    <div class="space-y-1">
      <h1 class="text-3xl font-semibold">Confirming…</h1>
      <p class="text-sm opacity-70">
        If your link is valid, you will be redirected automatically.
      </p>
    </div>

    <p v-if="status" class="text-sm opacity-70">{{ status }}</p>

    <div class="text-sm">
      <NuxtLink to="/login" class="underline">Back to login</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()
const status = ref('Waiting for confirmation…')

watch(
  user,
  async () => {
    if (user.value) {
      const path = redirectInfo.pluck()
      await navigateTo(path || '/')
    }
  },
  { immediate: true }
)

onMounted(() => {
  setTimeout(() => {
    if (!user.value) status.value = 'Still waiting… you can retry the link or request a new one.'
  }, 4000)
})
</script>

<style scoped></style>

<template>
  <div class="mx-auto max-w-md space-y-6">
    <div class="space-y-1">
      <h1 class="text-3xl font-semibold">
        {{ mode === 'login' ? 'Login' : 'Create account' }}
      </h1>
      <p class="text-sm opacity-70">
        {{ mode === 'login'
          ? 'Access your account.'
          : 'Create your account. You will need to confirm your email.' }}
      </p>
    </div>

    <div class="space-y-3">
      <input v-if="mode === 'signup'" v-model="name" type="text" placeholder="Display name"
        class="w-full rounded-lg border px-3 py-2" />

      <input v-model="email" type="email" placeholder="Email" class="w-full rounded-lg border px-3 py-2" />

      <input v-model="password" type="password" placeholder="Password" class="w-full rounded-lg border px-3 py-2" />

      <button class="w-full rounded-lg border px-3 py-2 disabled:opacity-50" :disabled="isLoading" @click="submit">
        {{ mode === 'login' ? 'Login' : 'Create account' }}
      </button>

      <p v-if="message" class="text-sm text-green-600">
        {{ message }}
      </p>

      <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>

    <div class="text-sm">
      <button class="underline" @click="toggleMode">
        {{
          mode === 'login'
            ? 'Need an account? Sign up'
            : 'Already have an account? Login'
        }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const name = ref('')

const message = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  message.value = null
  errorMessage.value = null
}

const submit = async () => {
  message.value = null
  errorMessage.value = null

  if (!email.value || !password.value) {
    errorMessage.value = 'Email and password are required.'
    return
  }

  isLoading.value = true

  if (mode.value === 'login') {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    isLoading.value = false

    if (error) {
      errorMessage.value = error.message
      return
    }

    await navigateTo('/')
  }

  if (mode.value === 'signup') {
    if (!name.value.trim()) {
      isLoading.value = false
      errorMessage.value = 'Display name is required.'
      return
    }

    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value.trim()
        },
        emailRedirectTo: `${window.location.origin}/confirm`
      }
    })

    isLoading.value = false

    if (error) {
      errorMessage.value = error.message
      return
    }

    message.value =
      'Account created. Please check your email and confirm your address before logging in.'
  }
}
</script>

<style scoped></style>

<script setup lang="ts">
import { sanitizeHtml } from '~/utils/sanitizeHtml'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const title = ref('')
const subtitle = ref('')
const coverImageUrl = ref<string | null>(null)
const categoryId = ref<string | null>(null)
const contentHtml = ref('')

const categories = ref<Array<{ id: string; title: string }>>([])
const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)

const loadCategories = async () => {
  const { data, error } = await supabase.from('categories').select('id,title').order('title')
  if (!error && data) categories.value = data
}

onMounted(loadCategories)

const canSubmit = computed(() => {
  return !!user.value && title.value.trim().length > 0 && contentHtml.value.trim().length > 0
})

const submit = async () => {
  errorMessage.value = null
  if (!user.value) {
    errorMessage.value = 'You must be logged in.'
    return
  }
  if (!canSubmit.value) {
    errorMessage.value = 'Title and content are required.'
    return
  }

  isSubmitting.value = true
  const sanitized = sanitizeHtml(contentHtml.value)

  const { error } = await supabase.from('articles').insert({
    author_id: user.value.id,
    category_id: categoryId.value,
    title: title.value.trim(),
    subtitle: subtitle.value.trim() || null,
    cover_image_url: (coverImageUrl.value || '').trim() || null,
    content_html: sanitized,
    status: 'pending'
  })

  isSubmitting.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  await navigateTo('/')
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-4">
    <div class="space-y-1">
      <h1 class="text-3xl font-semibold">Write</h1>
      <p class="text-sm opacity-70">Your submission will be pending until an admin approves it.</p>
    </div>

    <div class="grid gap-3">
      <input v-model="title" class="w-full rounded-lg border px-3 py-2" placeholder="Title" />
      <input v-model="subtitle" class="w-full rounded-lg border px-3 py-2" placeholder="Subtitle (optional)" />
      <input v-model="coverImageUrl" class="w-full rounded-lg border px-3 py-2"
        placeholder="Cover image URL (optional)" />

      <select v-model="categoryId" class="w-full rounded-lg border px-3 py-2">
        <option :value="null">No category</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.title }}</option>
      </select>

      <ClientOnly>
        <Editor v-model="contentHtml" editorStyle="height: 320px" />
      </ClientOnly>

      <button class="rounded-lg border px-3 py-2 disabled:opacity-50" :disabled="!canSubmit || isSubmitting"
        @click="submit">
        Submit for review
      </button>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>
  </div>
</template>

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const protectedPaths = ['/submit', '/admin', '/settings']
  const isProtected = protectedPaths.some(p => to.path === p || to.path.startsWith(p + '/'))

  if (isProtected && !user.value) return navigateTo('/login')
})

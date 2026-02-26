export const useTheme = () => {
  const isDark = useState<boolean>('isDark', () => false)

  const apply = (v: boolean) => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', v)
      document.body.classList.toggle('dark', v)
      localStorage.setItem('theme', v ? 'dark' : 'light')
    }
    isDark.value = v
  }

  const init = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      apply(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }

  const toggle = () => apply(!isDark.value)

  return { isDark, init, toggle, apply }
}

export const useTheme = () => {
  const isDark = useState<boolean>('isDark', () => false)

  const apply = (v: boolean) => {
    if (process.client) {
      document.documentElement.classList.toggle('dark', v)
      localStorage.setItem('theme', v ? 'dark' : 'light')
    }
    isDark.value = v
  }

  const init = () => {
    if (process.client) {
      const saved = localStorage.getItem('theme')
      apply(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }

  const toggle = () => apply(!isDark.value)

  return { isDark, init, toggle, apply }
}

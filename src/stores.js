import { writable, derived } from 'svelte/store'

// *** GLOBALS

export const globalLanguage = writable('english')

export const activeNavigation = writable('')
export const navigationColor = writable('rfgen-white')

export const isSinglePage = writable(false)
export const isSinglePost = writable(false)

export const categoryList = writable([])

export const isArabic = derived(
  globalLanguage,
  $globalLanguage => $globalLanguage === 'arabic'
)
export const isEnglish = derived(
  globalLanguage,
  $globalLanguage => $globalLanguage === 'english'
)

export const languagePrefix = derived(globalLanguage, $globalLanguage =>
  $globalLanguage === 'english' ? 'en' : 'ar'
)

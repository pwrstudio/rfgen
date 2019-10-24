import { writable, derived } from 'svelte/store'

// *** GLOBALS

export const activeNavigation = writable('')
export const navigationColor = writable('rfgen-white')

export const categoryList = writable([])

export const globalLanguage = writable('english')

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

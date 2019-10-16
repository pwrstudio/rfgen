import { writable, derived } from 'svelte/store'

// *** GLOBALS
import { categoryList } from './globals.js'

export const globalLanguage = writable('english')

export const activeNavigation = writable('')
export const navigationColor = writable('rfgen-white')
// export const activeCategoryColor = derived(
//   activeNavigation,
//   $activeNavigation => {
//     return $activeNavigation.length > 0 && isSinglePost
//       ? categoryList.find(c => c.slug === $activeNavigation).color
//       : ''
//   }
// )

export const isSinglePage = writable(false)
export const isSinglePost = writable(false)

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

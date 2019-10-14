import { writable, derived } from 'svelte/store'

// *** GLOBALS
import { categoryList } from './globals.js'

export const language = writable('english')

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

export const isArabic = derived(language, $language => $language === 'arabic')
export const isEnglish = derived(language, $language => $language === 'english')

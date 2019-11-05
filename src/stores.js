import { writable, derived } from 'svelte/store'
import get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'

// *** GLOBALS

export const activeNavigation = writable('')

export const categoryList = writable([])

export const satoshiList = writable([])

export const globalLanguage = writable('english')

export const isTileView = writable(false)

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

export const navigationColor = derived(
  [activeNavigation, categoryList, isTileView],
  ([$activeNavigation, $categoryList, $isTileView]) => {
    if ($isTileView) return 'rfgen-white'
    return get(
      $categoryList.find(c => c.categorySlug === kebabCase($activeNavigation)),
      'color',
      'rfgen-white'
    )
  }
)

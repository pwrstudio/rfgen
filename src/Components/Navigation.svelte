<script>
  // # # # # # # # # # # # # #
  //
  //  Navigation
  //
  // # # # # # # # # # # # # #

  // ** FUNCTIONS
  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, links } from "svelte-routing";

  // *** COMPONENTS

  // *** STORES
  import {
    language,
    isArabic,
    isEnglish,
    activeNavigation,
    navigationColor
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList, pageList } from "../globals.js";

  // ** CONSTANTS

  // ** VARIABLES
  let categoryColor = "";

  // $: {
  //   console.log($activeNavigation);
  //   if ($activeNavigation.length > 0) {
  //     categoryColor = categoryList.find(c => c.slug === $activeNavigation)
  //       .color;
  //     console.log(categoryColor);
  //   }
  // }

  // ** FUNCTIONS
  const changeLanguage = () => language.set($isEnglish ? "arabic" : "english");
  // const setActiveNavigation = slug => activeNavigation.set(slug);

  onMount(async () => {});
</script>

<style lang="scss">
  @import "../variables.scss";

  .navigation {
    // background: $rfgen-white;
    color: $rfgen-black;
    left: 0;
    padding: $rfgen-grid-unit;
    position: fixed;
    width: 100%;
    z-index: 1000;
    transition: background 0.5s $easing;
    user-select: none;

    &.team,
    &.theme,
    &.press,
    &.contact,
    &.venues {
      background: $rfgen-grey;
    }
  }

  .top {
    height: $navigation-top-height;
    top: 0;
  }

  .bottom {
    height: $navigation-bottom-height;
    bottom: 0;
  }

  .text-logo {
    display: inline-block;
    margin-bottom: 1em;
  }

  .language-switch {
    float: right;
  }

  .language-switch-button {
    display: inline-block;
    border: 0;
    outline: 0;
    border-radius: 0;
    padding: 0;
    margin: 0;
    font-size: $rfgen-font-size-large;

    border-bottom: 2px solid transparent;
    cursor: pointer;

    &:hover,
    &.active {
      border-bottom: 2px solid $rfgen-black;
    }
  }

  .category-menu {
    margin: 0;
    padding: 0;
  }

  .category-menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .category-menu-list-item {
    display: inline-block;
    padding: 0;
    margin-right: 2 * $rfgen-grid-unit;

    a {
      border-bottom: 2px solid transparent;
      &:hover,
      &.active {
        border-bottom: 2px solid $rfgen-black;
      }
    }
  }
</style>

<Router>

  <header class="navigation top {$navigationColor}" use:links>

    <nav>
      <a href="/" class="text-logo">
        {$navigationColor}
        {#if $isEnglish}{siteInfo.title.english}{/if}
        {#if $isArabic}{siteInfo.title.arabic}{/if}
      </a>
      <div class="language-switch">
        <button
          class="language-switch-button"
          on:click={changeLanguage}
          class:active={$isArabic}>
          AR
        </button>
        <button
          class="language-switch-button"
          on:click={changeLanguage}
          class:active={$isEnglish}>
          EN
        </button>
      </div>
      <menu class="category-menu">
        <ul class="category-menu-list">
          {#each categoryList as category}
            <li class="category-menu-list-item">
              <a
                href="/{category.slug}"
                class:active={$activeNavigation === category.slug}>
                {#if $isEnglish}{category.name.english}{/if}
                {#if $isArabic}{category.name.arabic}{/if}
              </a>
            </li>
          {/each}
        </ul>
      </menu>
    </nav>
  </header>

  <footer class="navigation bottom {$navigationColor}" use:links>
    <nav>
      <menu class="category-menu">
        <ul class="category-menu-list">
          {#each pageList as page}
            <li class="category-menu-list-item">
              <a
                href="/page/{page.slug}"
                class:active={$activeNavigation === page.slug}>
                {#if $isEnglish}{page.name.english}{/if}
                {#if $isArabic}{page.name.arabic}{/if}
              </a>
            </li>
          {/each}
        </ul>
      </menu>
    </nav>
  </footer>

</Router>

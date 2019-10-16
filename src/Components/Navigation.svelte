<script>
  // # # # # # # # # # # # # #
  //
  //  Navigation
  //
  // # # # # # # # # # # # # #

  // ** FUNCTIONS
  // *** IMPORT
  import { onMount } from "svelte";
  import { Router, Link, links } from "svelte-routing";

  // *** COMPONENTS

  // *** STORES
  import {
    globalLanguage,
    isArabic,
    isEnglish,
    activeNavigation,
    navigationColor,
    languagePrefix
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList, pageList } from "../globals.js";

  // ** CONSTANTS

  // ** VARIABLES

  // ** FUNCTIONS
  const changeLanguage = () =>
    globalLanguage.set($isEnglish ? "arabic" : "english");

  onMount(async () => {});
</script>

<style lang="scss">
  @import "../variables.scss";

  .navigation {
    color: $rfgen-black;
    left: 0;
    padding: $rfgen-grid-unit;
    position: fixed;
    width: 100%;
    z-index: 1000;
    transition: background 0.5s $easing;
    user-select: none;
  }

  .top {
    height: $navigation-top-height;
    top: 0;
    @include screen-size("small") {
      height: 80px;
    }
  }

  .bottom {
    height: $navigation-bottom-height;
    bottom: 0;

    @include screen-size("small") {
      height: 50px;
    }
  }

  .text-logo {
    display: inline-block;
    margin-bottom: 0.4em;
    text-align: left;
    position: relative;
    top: 5px;
    font-weight: bold;
    @include screen-size("small") {
      margin-bottom: 0.7em;
    }
  }

  .language-switch {
    float: right;
    margin-right: $rfgen-grid-unit;

    &.arabic {
      float: left;
      margin-left: $rfgen-grid-unit;
    }
  }

  .language-switch-button {
    background: transparent;
    display: inline-block;
    border: 0;
    outline: 0;
    border-radius: 0;
    font-size: $rfgen-font-size-large;
    padding: 0;

    border-bottom: 2px solid transparent;
    cursor: pointer;

    &:hover,
    &.active {
      border-bottom: 2px solid $rfgen-black;
    }

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
    }
  }

  .category-menu {
    margin: 0;
    padding: 0;
    white-space: nowrap;

    &.bottom-menu {
      float: left;
    }

    @include screen-size("small") {
      width: 3000px;
      // overflow-x: scroll;
    }
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

  .sat-link {
    float: right;
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom: 2px solid $rfgen-black;
    }

    @include screen-size("small") {
      float: left;
      display: none;
      // overflow-x: scroll;
    }
  }
</style>

<Router>

  <header class="navigation top {$navigationColor}" use:links>

    <nav>
      <a href="/{$languagePrefix}/" class="text-logo">
        {#if $isEnglish}{siteInfo.title.english}{/if}
        {#if $isArabic}{siteInfo.title.arabic}{/if}
      </a>
      <div class="language-switch" class:arabic={$isArabic}>
        {#if !$isArabic}
          <button class="language-switch-button" on:click={changeLanguage}>
            AR
          </button>
        {/if}

        {#if !$isEnglish}
          <button class="language-switch-button" on:click={changeLanguage}>
            EN
          </button>
        {/if}
      </div>
      <menu class="category-menu">
        <ul class="category-menu-list">
          {#each categoryList as category}
            <li class="category-menu-list-item">
              <a
                href="/{$languagePrefix}/{category.slug}"
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
      <menu class="category-menu bottom-menu">
        <ul class="category-menu-list">
          {#each pageList as page}
            <li class="category-menu-list-item">
              <a
                href="/{$languagePrefix}/page/{page.slug}"
                class:active={$activeNavigation === page.slug}>
                {#if $isEnglish}{page.name.english}{/if}
                {#if $isArabic}{page.name.arabic}{/if}
              </a>
            </li>
          {/each}
        </ul>
      </menu>
    </nav>
    <a
      href="https://www.sharjaharchitecture.org/"
      class="sat-link"
      target="_blank">
      Sharjah Architecture Triennial
    </a>
  </footer>

</Router>

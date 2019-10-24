<script>
  // # # # # # # # # # # # # #
  //
  //  Navigation
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { Router, links } from "svelte-routing";

  // *** STORES
  import {
    globalLanguage,
    isArabic,
    isEnglish,
    activeNavigation,
    navigationColor,
    categoryList,
    languagePrefix
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, pageList } from "../globals.js";

  // ** FUNCTIONS
  const changeLanguage = () =>
    globalLanguage.set($isEnglish ? "arabic" : "english");
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

    @include screen-size("small") {
      padding-left: 0;
      padding-right: 0;
      height: 50px;
    }
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
      margin-bottom: 0;
      padding-left: $rfgen-grid-unit;
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
      &.arabic {
        float: right;
      }
      @include screen-size("small") {
        float: unset;
      }
    }
  }

  .category-menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    @include screen-size("small") {
      padding-top: 10px;
      padding-bottom: 10px;
      padding-right: 5px;
      display: flex;
      overflow-x: scroll;
      // scroll-snap-type: x mandatory;
      @include hide-scroll;
    }
  }

  .category-menu-list-item {
    display: inline-block;
    padding: 0;
    margin-right: 2 * $rfgen-grid-unit;

    @include screen-size("small") {
      margin-left: $rfgen-grid-unit;
      margin-right: $rfgen-grid-unit;

      &:last-child {
        padding-right: $rfgen-grid-unit;
      }
    }

    a {
      // border-bottom: 2px solid transparent;

      @include screen-size("small") {
        // border-bottom: 2px solid transparent;
      }

      &:hover,
      &.active {
        text-decoration: underline;
        // border-bottom: 2px solid black;

        @include screen-size("small") {
          // border-bottom: 2px solid black;
        }
      }
    }

    &.arabic {
      margin-right: 0;
      margin-left: 2 * $rfgen-grid-unit;
    }

    @include screen-size("small") {
      scroll-snap-align: start;
      scroll-padding: $rfgen-grid-unit;
    }
  }

  .sat-link {
    float: right;
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom: 2px solid $rfgen-black;
    }

    &.arabic {
      float: left;
    }

    @include screen-size("small") {
      display: none;
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
          {#each $categoryList as category}
            <li class="category-menu-list-item" class:arabic={$isArabic}>
              <a
                href="/{$languagePrefix}/{category.categorySlug}"
                class:active={$activeNavigation === category.categorySlug}>
                {#if $isEnglish}{category.nameDisplay.english}{/if}
                {#if $isArabic}{category.nameDisplay.arabic}{/if}
              </a>
            </li>
          {/each}
          <li class="category-menu-list-item" class:arabic={$isArabic}>
            <a
              href="/{$languagePrefix}/programme"
              class:active={$activeNavigation === 'programme'}>
              {#if $isEnglish}Opening Programme{/if}
              {#if $isArabic}Opening Programme{/if}
            </a>
          </li>
        </ul>
      </menu>
    </nav>
  </header>

  <footer class="navigation bottom {$navigationColor}" use:links>
    <nav>
      <menu class="category-menu bottom-menu" class:arabic={$isArabic}>
        <ul class="category-menu-list">
          {#each pageList as page}
            <li class="category-menu-list-item" class:arabic={$isArabic}>
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
      class:arabic={$isArabic}
      target="_blank"
      rel="noreferrer">
      {#if $isEnglish}Sharjah Architecture Triennial{/if}
      {#if $isArabic}Sharjah Architecture Triennial (ar){/if}
    </a>
  </footer>

</Router>

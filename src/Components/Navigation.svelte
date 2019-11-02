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
    font-weight: normal;
    @include screen-size("small") {
      margin-bottom: 0;
      padding-left: $rfgen-grid-unit;
      padding-right: $rfgen-grid-unit;
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
    font-family: $font-stack;
    font-size: $rfgen-font-size-large;
    padding: 0;
    cursor: pointer;
    position: relative;
    top: 5px;

    &:hover,
    &.active {
      text-decoration: underline;
    }

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
    }

    &.arabic {
      top: -20px;

      &:hover,
      &.active {
        text-decoration: none;
      }
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
      width: 100%;
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      overflow-x: scroll;
      position: relative;
      @include hide-scroll;
    }
  }

  .category-menu-list-overlay {
    display: none;

    @include screen-size("small") {
      right: 0;
      left: auto;
      display: block;
      height: 48px;
      width: 80px;
      position: fixed;
      top: 32px;
      pointer-events: none;

      &.arabic {
        right: auto;
        left: 0;
      }
    }
  }

  .category-menu-list-item {
    display: inline-block;
    padding: 0;
    margin-right: 2 * $rfgen-grid-unit;

    &.block {
      display: inline-block;
      width: $rfgen-grid-unit * 4;
      padding-right: $rfgen-grid-unit * 8;
    }

    @include screen-size("small") {
      margin-left: $rfgen-grid-unit;
      margin-right: $rfgen-grid-unit;

      &:last-child {
        padding-right: $rfgen-grid-unit;
      }
    }

    a {
      &:hover,
      &.active {
        text-decoration: underline;
      }
    }

    &.arabic {
      margin-right: 0;
      margin-left: 2 * $rfgen-grid-unit;

      &:first-child {
        padding-right: $rfgen-grid-unit;
      }
    }

    @include screen-size("small") {
      scroll-snap-align: start;
      scroll-padding: $rfgen-grid-unit;
    }
  }

  .sat-link {
    float: right;

    &:hover {
      text-decoration: underline;
    }

    &.arabic {
      float: left;
    }

    @include screen-size("small") {
      display: none;
    }
  }

  .opening-programme-spacing-hack {
    margin-right: 2px;
  }

  .social-media-spacing-hack {
    margin-left: -5px;
    @include screen-size("small") {
      margin-left: 5px;
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
          <button
            class="language-switch-button arabic"
            on:click={changeLanguage}>
            ﻉ
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
          <li
            class="category-menu-list-item opening-programme-spacing-hack"
            class:arabic={$isArabic}>
            <a
              href="/{$languagePrefix}/programme"
              class:active={$activeNavigation === 'programme'}>
              {#if $isEnglish}Opening Programme{/if}
              {#if $isArabic}Opening Programme{/if}
            </a>
          </li>
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
          <li
            class="category-menu-list-item social-media-spacing-hack"
            class:arabic={$isArabic}>
            <a
              href="https://www.instagram.com/explore/tags/rfgen/"
              target="_blank"
              rel="noreferrer">
              #rfgen
            </a>
          </li>
          <!-- EXTRA WHITESPACE -->
          <li class="category-menu-list-item block">&nbsp;</li>
        </ul>
        <!-- OVERLAY -->
        <div class="category-menu-list-overlay" class:arabic={$isArabic} />
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
      {#if $isArabic}Sharjah Architecture Triennial{/if}
    </a>
  </footer>

</Router>

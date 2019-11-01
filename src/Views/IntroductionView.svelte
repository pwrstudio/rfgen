<script>
  // # # # # # # # # # # # # #
  //
  // Introduction View
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { fade } from "svelte/transition";
  // _lodash
  import get from "lodash/get";

  // *** COMPONENTS
  import Satoshi from "../Components/Satoshi.svelte";
  import MetaData from "../Components/MetaData.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    isTileView,
    activeNavigation,
    categoryList,
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { loadSingleData, renderBlockText } from "../sanity.js";

  // *** PROPS
  export let slug = "";
  export let category = "";
  export let language = "";
  export let location = {};

  // ** VARIABLES
  let post = {};

  // ** CONSTANTS
  const query =
    '*[slug.current == $slug && _type == "categoryIntroduction"]{satoshiIndex, en_title, ar_title, en_content, ar_content, "slug": slug.current, mainImage, "category": _type}[0]';

  $: {
    post = loadSingleData(query, { slug: slug });
  }

  $: {
    activeNavigation.set(slug ? slug : "");
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  isTileView.set(false);
</script>

<style lang="scss">
  @import "../variables.scss";

  .introduction-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $unified-line-height;
    padding-bottom: $navigation-bottom-height;

    @include screen-size("small") {
      padding-bottom: 30px;
    }
  }

  .introduction-view-text {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    left: 0;
    padding-top: $rfgen-grid-unit;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );
    @include screen-size("small") {
      position: static;
      float: right;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
    }

    overflow-y: auto;
    @include hide-scroll;

    &.arabic {
      left: unset;
      right: 0;
    }
  }

  .introduction-view-image {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    background: rgba(0, 0, 0, 0.05);
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );

    @include screen-size("small") {
      position: static;
      float: left;
      width: 100vw;
      top: unset;
      left: unset;
      height: 50vh;
    }

    opacity: 1;

    &.arabic {
      right: unset;
      left: 0;
    }
  }

  a {
    text-decoration: underline;
  }

  .introduction-view-title {
    margin-bottom: $unified-line-height;
    font-weight: normal;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
  }

  .introduction-view-text-inner {
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
    width: 95%;
    max-width: 45ch;

    &.arabic {
      padding-left: 4 * $rfgen-grid-unit;
      padding-right: $rfgen-grid-unit;
    }
  }

  .links-container {
    margin-top: $unified-line-height;
  }
</style>

{#await post then post}
  <MetaData {post} />
{/await}

<div class="introduction-view">
  {#await post then post}
    <div class="introduction-view-image" class:arabic={$isArabic}>
      <Satoshi satoshiIndex={post.satoshiIndex} />
    </div>
    <div class="introduction-view-text" class:arabic={$isArabic} in:fade>
      <div class="introduction-view-title">
        {#if $isEnglish}{post.title.english}{/if}
        {#if $isArabic}{post.title.arabic}{/if}
      </div>
      <div class="introduction-view-text-inner" class:arabic={$isArabic}>
        {#if $isEnglish}
          {@html renderBlockText(post.content.english)}
        {/if}
        {#if $isArabic}
          {@html renderBlockText(post.content.arabic)}
        {/if}
      </div>
    </div>
  {/await}
</div>

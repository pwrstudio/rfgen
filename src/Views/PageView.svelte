<script>
  // # # # # # # # # # # # # #
  //
  //  PageView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router } from "svelte-routing";
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
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { loadSingleData, renderBlockText } from "../sanity.js";

  // *** PROPS
  export let slug = {};
  export let location = {};
  export let language = "";

  // ** VARIABLES
  let page = {};
  let title = "";

  // ** CONSTANTS
  const query = '*[_type == "page" && slug.current == $slug][0]';

  $: {
    page = loadSingleData(query, { slug: slug });
  }

  $: {
    activeNavigation.set(slug ? slug : "");
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  isTileView.set(false);

  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .page-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;

    @include screen-size("small") {
      padding-bottom: 30px;
    }
  }

  .page-view-text {
    width: 50vw;
    padding-left: $rfgen-grid-unit;
    padding-right: $rfgen-grid-unit;
    padding-top: $rfgen-grid-unit;
    @include screen-size("small") {
      width: 100vw;
    }
    overflow-y: auto;
    @include hide-scroll;
  }

  .page-view-text-inner {
    width: 95%;
    max-width: 45ch;
  }

  .page-view-image {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );

    &.arabic {
      right: unset;
      left: 0;
    }

    @include screen-size("small") {
      position: static;
      width: 100%;
      line-height: 0;
      tiop: unset;
    }
  }

  a {
    text-decoration: underline;
  }
</style>

{#await page then page}
  <MetaData post={page} />
{/await}

<div class="page-view">
  {#await page then page}
    <div class="page-view-text" in:fade>
      <div class="page-view-text-inner">
        {#if $isEnglish}
          {@html renderBlockText(page.content.english)}
        {/if}
        {#if $isArabic}
          {@html renderBlockText(page.content.arabic)}
        {/if}
      </div>
    </div>
    <div class="page-view-image" class:arabic={$isArabic}>
      <Satoshi satoshiIndex={page.satoshiIndex} />
    </div>
  {/await}
</div>

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
  import { siteInfo } from "../globals.js";
  import { loadSingleData, renderBlockText, urlFor } from "../sanity.js";

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
  }

  .page-view-text {
    width: 50vw;
    padding-left: $rfgen-grid-unit;
    padding-right: $rfgen-grid-unit;
    padding-top: 2 * $rfgen-grid-unit;
    @include screen-size("small") {
      width: 100vw;
    }
    overflow-y: auto;
    @include hide-scroll;
  }

  .page-view-image {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.arabic {
      right: unset;
      left: 0;
    }
  }

  a {
    text-decoration: underline;
  }
</style>

<svelte:head>
  {#await page then page}
    {#if $isEnglish}
      <title>{page.title.english} / {siteInfo.title.english}</title>
    {/if}
    {#if $isArabic}
      <title>{siteInfo.title.arabic} / {page.title.arabic}</title>
    {/if}
  {/await}
</svelte:head>

<div class="page-view">
  {#await page then page}
    {#if $isEnglish}
      <div class="page-view-text" in:fade>
        {@html renderBlockText(page.content.english)}
      </div>
    {/if}
    {#if $isArabic}
      <div class="page-view-text" in:fade>
        {@html renderBlockText(page.content.arabic)}
      </div>
    {/if}
    <div class="page-view-image" class:arabic={$isArabic}>
      {#if page.mainImage}
        <img
          src={urlFor(page.mainImage)
            .height(1400)
            .quality(90)
            .auto('format')
            .url()}
          alt={$isEnglish ? page.title.english : page.title.arabic} />
      {/if}
    </div>
  {/await}
</div>

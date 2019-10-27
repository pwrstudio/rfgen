<script>
  // # # # # # # # # # # # # #
  //
  // Introduction View
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import imagesLoaded from "imagesloaded";
  import { fade } from "svelte/transition";
  // _lodash
  import get from "lodash/get";
  import kebabCase from "lodash/kebabCase";

  // *** COMPONENTS
  import InternalLink from "../Components/InternalLink.svelte";

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
  import { siteInfo, baseProjections } from "../globals.js";
  import { loadSingleData, renderBlockText, urlFor } from "../sanity.js";

  // *** PROPS
  export let slug = "";
  export let category = "";
  export let language = "";
  export let location = {};

  // *** DOM REFERENCES
  let imageEl = {};

  // ** VARIABLES
  let post = {};
  let headTitle = {
    english: "",
    arabic: ""
  };
  let loaded = false;

  // ** CONSTANTS
  const query =
    '*[slug.current == $slug && _type == "categoryIntroduction"]{en_title, ar_title, en_content, ar_content, "slug": slug.current, mainImage, "category": _type}[0]';

  $: {
    post = loadSingleData(query, { slug: slug });
  }

  $: {
    activeNavigation.set(slug ? slug : "");
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  isTileView.set(false);

  // *** ON MOUNT
  onMount(async () => {
    window.scrollTo(0, 0);
    imagesLoaded(imageEl, instance => {
      loaded = true;
    });
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .introduction-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
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
    padding-top: 2 * $rfgen-grid-unit;
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

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    iframe {
      display: block;
      margin-top: 40px;
      margin-left: auto;
      margin-right: auto;
      width: calc(100% - 10px);
    }

    @include screen-size("small") {
      position: static;
      float: left;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
    }

    opacity: 0;
    transition: opacity 0.5s $easing;

    &.loaded {
      opacity: 1;
    }

    &.arabic {
      right: unset;
      left: 0;
    }
  }

  a {
    text-decoration: underline;
  }

  .introduction-view-title {
    margin-bottom: 1em;
    // font-weight: bold;
    font-weight: normal;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
  }

  .introduction-view-text-inner {
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
  }

  .links-container {
    margin-top: 1em;
  }
</style>

<svelte:head>
  {#await post then post}
    {#if $isEnglish}
      <title>{post.title.english} / {siteInfo.title.english}</title>
    {/if}
    {#if $isArabic}
      <title>{post.title.arabic} / {siteInfo.title.arabic}</title>
    {/if}
  {/await}

</svelte:head>

<div class="introduction-view">
  {#await post then post}
    <div class="introduction-view-text" class:arabic={$isArabic} in:fade>
      <div class="introduction-view-title">
        {#if $isEnglish}{post.title.english}{/if}
        {#if $isArabic}{post.title.arabic}{/if}
      </div>
      <div class="introduction-view-text-inner">
        {#if $isEnglish}
          {@html renderBlockText(post.content.english)}
        {/if}
        {#if $isArabic}
          {@html renderBlockText(post.content.arabic)}
        {/if}
      </div>
    </div>
    {#if post.mainImage}
      <div
        class="introduction-view-image"
        bind:this={imageEl}
        class:loaded
        class:arabic={$isArabic}>
        <img
          src={urlFor(post.mainImage)
            .height(1400)
            .quality(90)
            .auto('format')
            .url()}
          alt={$isEnglish ? post.title.english : post.title.arabic} />
      </div>
    {/if}
  {/await}
</div>

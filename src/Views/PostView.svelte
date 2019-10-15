<script>
  // # # # # # # # # # # # # #
  //
  //  PostView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";
  import imagesLoaded from "imagesloaded";
  import get from "lodash/get";

  // *** COMPONENTS
  import Tile from "../Components/Tile.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    navigationColor,
    activeNavigation
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList } from "../globals.js";
  import { client, renderBlockText, urlFor } from "../sanity.js";

  // *** PROPS
  export let slug = {};
  export let category = {};
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
    '*[slug.current == $slug]{"en_title": en_name, en_title, "ar_title": ar_name, ar_title, "en_content": en_biography, en_content, "ar_content": ar_biography, ar_content, "slug": slug.current, mainImage, "category": _type}[0]';

  $: {
    post = loadData(query, { slug: slug });
  }

  $: {
    activeNavigation.set(category ? category : "");
  }

  navigationColor.set(categoryList.find(c => c.slug == category).color);

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      console.dir(res);

      let postConstruction = {
        title: {
          english: "",
          arabic: ""
        },
        content: {
          english: [],
          arabic: []
        },
        mainImage: false,
        slug: ""
      };

      postConstruction.title.english = get(res, "en_title", "");
      postConstruction.title.arabic = get(res, "ar_title", "");
      postConstruction.content.english = get(res, "en_content", []);
      postConstruction.content.arabic = get(res, "ar_content", []);
      postConstruction.mainImage = get(res, "mainImage", false);
      postConstruction.slug = get(res, "slug", "");
      postConstruction.category = get(res, "category", "");

      console.dir(postConstruction);

      return postConstruction;
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    }
  }

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
  @import "../variables.scss";

  .post-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;
  }

  .post-view-text {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    left: 0;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );
    padding-left: $rfgen-grid-unit;
    padding-right: $rfgen-grid-unit;
    padding-top: 2 * $rfgen-grid-unit;
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

  .post-view-image {
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

    @include screen-size("small") {
      position: static;
      float: left;
      width: 100vw;
      top: unset;
      left: unset;
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

  .post-view-category {
    text-transform: capitalize;
    margin-bottom: 1em;
  }

  .post-view-title {
    margin-bottom: 1em;
  }
</style>

<svelte:head>
  {#if $isEnglish}
    <title>{headTitle.english} / {siteInfo.title.english}</title>
  {/if}
  {#if $isArabic}
    <title>{siteInfo.title.arabic} / {headTitle.arabic}</title>
  {/if}
</svelte:head>

<div class="post-view">
  {#await post then post}
    {#if $isEnglish}
      <div class="post-view-text">
        <div class="post-view-category">{post.category}</div>
        <div class="post-view-title">{post.title.english}</div>
        {#if Array.isArray(post.content.english)}
          {@html renderBlockText(post.content.english)}
        {:else}{post.content.english}{/if}
      </div>
    {/if}
    {#if $isArabic}
      <div class="post-view-text arabic">
        {#if Array.isArray(post.content.arabic)}
          {@html renderBlockText(post.content.arabic)}
        {:else}{post.content.arabic}{/if}
      </div>
    {/if}
    <div
      class="post-view-image"
      bind:this={imageEl}
      class:loaded
      class:arabic={$isArabic}>
      {#if post.mainImage}
        <img
          src={urlFor(post.mainImage)
            .width(900)
            .quality(90)
            .auto('format')
            .url()}
          alt={$isEnglish ? post.title.english : post.title.arabic} />
      {/if}
    </div>
  {/await}
</div>

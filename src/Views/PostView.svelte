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
  import kebabCase from "lodash/kebabCase";
  import { fade } from "svelte/transition";

  // *** COMPONENTS
  import Tile from "../Components/Tile.svelte";
  import Video from "../Components/Video.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    navigationColor,
    activeNavigation,
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList } from "../globals.js";
  import { client, renderBlockText, urlFor } from "../sanity.js";

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
    '*[slug.current == $slug]{"en_title": en_name, en_title, "ar_title": ar_name, ar_title, "en_content": en_biography, en_content, "ar_content": ar_biography, ar_content, "slug": slug.current, mainImage, videoLink, "category": _type}[0]';

  $: {
    post = loadData(query, { slug: slug });
  }

  $: {
    activeNavigation.set(category ? category : "");
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  navigationColor.set(
    categoryList.find(c => c.categorySlug == kebabCase(category)).color
  );

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);

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
      postConstruction.videoLink = get(res, "videoLink", "");
      // postConstruction.videoLink = "https://vimeo.com/25692618";
      postConstruction.slug = get(res, "slug", "");
      postConstruction.category = get(res, "category", "");

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

    padding-bottom: 80px;
  }

  .post-view-image {
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

  .post-view-category {
    text-transform: capitalize;
    margin-bottom: 1em;
    // font-size: $rfgen-font-size-small;
    // line-height: $rfgen-font-size-small;
  }

  .post-view-title {
    margin-bottom: 1em;
    font-weight: bold;
  }
</style>

<svelte:head>
  {#await post then post}
    {#if $isEnglish}
      <title>{post.title.english} / {siteInfo.title.english}</title>
    {/if}
    {#if $isArabic}
      <title>{siteInfo.title.arabic} / {post.title.arabic}</title>
    {/if}
  {/await}

</svelte:head>

<div class="post-view">
  {#await post then post}
    {#if $isEnglish}
      <div class="post-view-text" in:fade>
        <div class="post-view-category">{post.category}</div>
        <div class="post-view-title">{post.title.english}</div>
        {#if Array.isArray(post.content.english)}
          {@html renderBlockText(post.content.english)}
        {:else}{post.content.english}{/if}
      </div>
    {/if}
    {#if $isArabic}
      <div class="post-view-text arabic" in:fade>
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
      {#if post.videoLink}
        <Video url={post.videoLink} />
        <!-- <iframe
          src="https://player.vimeo.com/video/{post.videoLink.slice(post.videoLink.length - 9)}"
          width="640"
          height="360"
          title="rfgen"
          frameborder="0"
          byline="false"
          color="#ffffff"
          allow="autoplay; fullscreen"
          allowfullscreen /> -->
      {:else if post.mainImage}
        <img
          src={urlFor(post.mainImage)
            .height(1400)
            .quality(90)
            .auto('format')
            .url()}
          alt={$isEnglish ? post.title.english : post.title.arabic} />
      {/if}
    </div>
  {/await}
</div>

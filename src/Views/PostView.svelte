<script>
  // # # # # # # # # # # # # #
  //
  //  PostView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { Router } from "svelte-routing";
  import imagesLoaded from "imagesloaded";
  import { fade } from "svelte/transition";
  // _lodash
  import kebabCase from "lodash/kebabCase";

  // *** COMPONENTS
  import InternalLink from "../Components/InternalLink.svelte";
  import Video from "../Components/Video.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    isTileView,
    activeNavigation,
    languagePrefix,
    globalLanguage,
    categoryList
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
  let links = [];
  let headTitle = {
    english: "",
    arabic: ""
  };
  let loaded = false;

  // ** CONSTANTS
  const query =
    '*[slug.current == $slug && _type == $category]{_id, "en_title": en_name, en_title, "ar_title": ar_name, ar_title, "en_content": en_biography, en_content, "ar_content": ar_biography, ar_content, "slug": slug.current, mainImage, videoLink, posterImage, link, publisherName, "category": _type, participants[]->{"en_title": en_name, en_title, "ar_title": ar_name, "slug": slug.current, "category": _type}}[0]';

  $: {
    post = loadSingleData(query, { slug: slug, category: category });
  }

  $: {
    activeNavigation.set(category ? category : "");
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
  @import "../variables.scss";

  .post-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;

    @include screen-size("small") {
      padding-bottom: 46px;
    }
  }

  .post-view-text {
    position: fixed;
    width: 100vw;
    top: $navigation-top-height;
    left: 0;
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

    .post-view-column {
      padding-top: 2 * $rfgen-grid-unit;
      width: 50%;
      position: relative;
      clear: both;
      height: auto;

      @include screen-size("small") {
        width: 100%;
      }

      &.left {
        float: left;
        &.arabic {
          float: right;
        }
      }

      &.right {
        float: left;
        padding-top: 0;
        &.arabic {
          float: right;
        }
      }
    }

    &.video {
      position: static;
      height: auto;

      .post-view-column {
        clear: none;

        &.right {
          float: right;
        }
      }
    }
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

    @include screen-size("small") {
      position: static;
      float: left;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
      background: transparent;
      height: 50vh;
      line-height: 0;
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
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
  }

  .post-view-title {
    margin-bottom: 1em;
    font-weight: normal;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
  }

  .post-view-text-inner {
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
    margin-bottom: 40px;
    width: 95%;
    max-width: 45ch;
  }

  .video-container {
    width: 100vw;
    height: 56.25vw;
    max-height: 35vw;
    background: lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    @include screen-size("medium") {
      max-height: none;
    }
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
    {#if post.videoLink}
      <div class="video-container">
        <Video url={post.videoLink} posterImage={post.posterImage} />
      </div>
    {/if}
    {#if post.mainImage && !post.videoLink}
      <div
        class="post-view-image"
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
    <div
      class="post-view-text"
      class:arabic={$isArabic}
      in:fade
      class:video={post.videoLink}>
      <div class="post-view-column left" class:arabic={$isArabic}>
        <div class="post-view-category">{post.category}</div>
        <div class="post-view-title">
          {#if $isEnglish}{post.title.english}{/if}
          {#if $isArabic}{post.title.arabic}{/if}
        </div>
        {#if category !== 'workingGroup'}
          <div class="post-view-text-inner">
            {#if $isEnglish}
              {#if Array.isArray(post.content.english)}
                {@html renderBlockText(post.content.english)}
              {:else}{post.content.english}{/if}
            {/if}
            {#if $isArabic}
              {#if Array.isArray(post.content.arabic)}
                {@html renderBlockText(post.content.arabic)}
              {:else}{post.content.arabic}{/if}
            {/if}
            {#if category === 'writing'}
              <p>
                <a href={post.link} target="_blank" class="external-link">
                  Read on {post.publisherName}
                </a>
              </p>
            {/if}
          </div>
        {/if}
      </div>
      <div class="post-view-column right" class:arabic={$isArabic}>
        <div class="links-container" class:video={post.videoLink}>
          {#each post.links as link}
            <InternalLink post={link} />
          {/each}
        </div>
      </div>
    </div>
  {/await}
</div>

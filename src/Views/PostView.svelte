<script>
  // # # # # # # # # # # # # #
  //
  //  PostView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { Router, links } from "svelte-routing";
  import { fade } from "svelte/transition";
  // _lodash
  import kebabCase from "lodash/kebabCase";
  import get from "lodash/get";

  // *** COMPONENTS
  import InternalLink from "../Components/InternalLink.svelte";
  import Video from "../Components/Video.svelte";
  import MetaData from "../Components/MetaData.svelte";

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
  import { loadSingleData, renderBlockText, urlFor } from "../sanity.js";

  // *** PROPS
  export let slug = "";
  export let category = "";
  export let language = "";

  // *** DOM REFERENCES
  let imageEl = {};

  // ** VARIABLES
  let post = {};
  let loaded = false;

  // ** CONSTANTS
  const query =
    '*[slug.current == $slug && _type == $category]{_id, "en_title": en_name, en_title, "ar_title": ar_name, ar_title, en_content, ar_content, "slug":language.current, mainImage, videoLink, posterImage, link, publisherName, "category": _type, participants[]->{en_title, ar_title, "slug": slug.current, "category": _type}}[0]';

  $: {
    post = loadSingleData(query, { slug: slug, category: category });
  }

  $: {
    activeNavigation.set(category ? category : "");
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");

  // *** ON MOUNT
  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";
  @import "../variables.scss";

  .post-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    padding-bottom: $navigation-bottom-height;

    @include screen-size("small") {
      padding-bottom: 42px;
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

    &.arabic {
      right: unset;
      left: 0;
    }

    img {
      opacity: 0;
      transition: opacity 1s $easing;

      &.loaded {
        opacity: 1;
      }
    }
  }

  a {
    text-decoration: underline;
  }

  .post-view-category {
    text-transform: capitalize;
    margin-bottom: $unified-line-height;
    padding-left: $rfgen-grid-unit;

    &.arabic {
      padding-left: 4 * $rfgen-grid-unit;
      padding-right: $rfgen-grid-unit;
    }
  }

  .post-view-title {
    margin-bottom: $unified-line-height;
    font-weight: bold;
    padding-left: $rfgen-grid-unit;

    &.arabic {
      padding-left: 4 * $rfgen-grid-unit;
      padding-right: $rfgen-grid-unit;
    }
  }

  .post-view-text-inner {
    padding-left: $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
    margin-bottom: 40px;
    width: 95%;
    max-width: 45ch;

    &.arabic {
      padding-right: $rfgen-grid-unit;
    }
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

  .error {
    margin: $rfgen-grid-unit;
    a {
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }
</style>

{#await post then post}
  <MetaData {post} />
{/await}

<div class="post-view">
  {#await post}
    <div />
  {:then post}
    {#if post.videoLink}
      <div class="video-container">
        <Video url={post.videoLink} posterImage={post.posterImage} />
      </div>
    {/if}
    {#if post.mainImage && !post.videoLink}
      <div class="post-view-image" bind:this={imageEl} class:arabic={$isArabic}>
        <img
          class:loaded
          src={urlFor(post.mainImage)
            .height(1200)
            .width(1000)
            .quality(90)
            .auto('format')
            .url()}
          on:load={() => (loaded = true)}
          alt={$isEnglish ? post.title.english : post.title.arabic} />
      </div>
    {/if}
    <div
      class="post-view-text"
      class:arabic={$isArabic}
      in:fade
      class:video={post.videoLink}>
      <div class="post-view-column left" class:arabic={$isArabic}>
        <div class="post-view-category" class:arabic={$isArabic}>
          {post.category === 'workingGroup' ? 'Working group' : post.category}
        </div>
        <div class="post-view-title" class:arabic={$isArabic}>
          {#if $isEnglish}{post.title.english}{/if}
          {#if $isArabic}{post.title.arabic}{/if}
        </div>
        <div class="post-view-text-inner" class:arabic={$isArabic}>
          {#if $isEnglish}
            {@html renderBlockText(post.content.english)}
          {/if}
          {#if $isArabic}
            {@html renderBlockText(post.content.arabic)}
          {/if}
          {#if category === 'writing'}
            <p>
              <a href={post.link} target="_blank" class="external-link">
                Read on {post.publisherName}
              </a>
            </p>
          {/if}
        </div>
      </div>
      <div class="post-view-column right" class:arabic={$isArabic}>
        <div class="links-container" class:video={post.videoLink}>
          {#each post.links as link}
            <InternalLink post={link} />
          {/each}
        </div>
      </div>
    </div>
  {:catch error}
    <Router>
      <div class="error" use:links>
        <div class="msg">Error: {error.message}</div>
        <a href="/">Return to home page</a>
      </div>
    </Router>
  {/await}
</div>

<script>
  // # # # # # # # # # # # # #
  //
  //  Tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Router, links } from "svelte-routing";
  import imagesLoaded from "imagesloaded";
  // _lodash
  import kebabCase from "lodash/kebabCase";
  import get from "lodash/get";
  import isEmpty from "lodash/isEmpty";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    categoryList,
    languagePrefix
  } from "../stores.js";

  // *** GLOBALS
  import { urlFor } from "../sanity.js";

  // *** PROPS
  export let post = {};
  export let width = 20;
  export let order = 0;

  // *** DOM REFERENCES
  let tileEl = {};

  // ** VARIABLES
  let color = "";
  let loaded = false;
  let linkOutActive = false;
  const imgWidth = width >= 25 ? 600 : 400;

  // >>> RE-USE
  $: {
    if (post.category) {
      let matchingCategory = $categoryList.find(
        cat => cat.categorySlug === kebabCase(post.category)
      );
      color = matchingCategory ? matchingCategory.color : "rfgen-white";
    }
  }
  // <<< RE-USE

  const isLongTitle = () => post.en_title.length > 35;

  const handleClick = e => {
    linkOutActive = !linkOutActive;
  };

  // *** ON MOUNT
  onMount(async () => {
    imagesLoaded(tileEl, instance => {
      loaded = true;
    });
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .tile {
    width: 33.33%;
    height: $tile-height;
    margin: 0;
    float: left;
    position: relative;
    opacity: 0;
    transition: opacity 0.5s $easing;
    cursor: pointer;
    margin-bottom: 2px;

    @include screen-size("small") {
      width: 100%;
      height: $mobile-tile-height;
      margin-bottom: 0px;
    }

    &.loaded {
      opacity: 1;
    }
  }

  .tile-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: $tile-bar-height;
    width: 100%;
    font-size: $rfgen-font-size-small;
    line-height: $unified-line-height;
    z-index: 10;
    overflow: hidden;

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
      line-height: $unified-line-height;
    }
  }

  .tile-title {
    height: $tile-bar-height;
    padding: $rfgen-grid-unit;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .tile-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $unified-line-height;
    height: calc(#{$tile-height} - #{$tile-bar-height});
    height: $tile-height;
    z-index: 11;
    pointer-events: none;
    opacity: 0;

    &.active {
      opacity: 1;
      pointer-events: all;
    }

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
      line-height: $unified-line-height;
      height: $mobile-tile-height;
    }
  }

  .tile-image {
    margin-top: $tile-bar-height;
    height: calc(#{$tile-height} - #{$tile-bar-height});
    width: 100%;

    @include screen-size("small") {
      height: calc(#{$mobile-tile-height} - #{$tile-bar-height});
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .external-link {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  .width-15 {
    width: 15%;
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-20 {
    width: 20%;
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-25 {
    width: 25%;
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-30 {
    width: 30%;

    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-35 {
    width: 35%;
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-40 {
    width: 40%;
    @include screen-size("small") {
      width: 100%;
    }
  }

  .order-0,
  .order-1,
  .order-2,
  .order-3 {
    border-right: 2px solid white;
    @include screen-size("small") {
      border-right: 0px solid white;
    }
  }
</style>

<Router>

  <div
    class="tile width-{width} order-{order}
    {color}"
    use:links
    bind:this={tileEl}
    class:loaded>

    {#if post.category === 'writing' || post.category === 'socialMedia'}
      <div
        on:click={e => {
          handleClick(e);
        }}>
        <div class="tile-bar">
          {#if !linkOutActive}
            <div class="tile-title">
              {#if $isEnglish}{post.en_title}{/if}
              {#if $isArabic}{post.ar_title}{/if}
            </div>
          {/if}
        </div>
        <div class="tile-image">
          {#if post.mainImage}
            <img
              src={urlFor(post.mainImage)
                .height(320)
                .width(imgWidth)
                .quality(100)
                .auto('format')
                .url()}
              alt={$isEnglish ? post.en_title : post.ar_title} />
          {/if}
        </div>
        <div class="tile-overlay {color}" class:active={linkOutActive}>
          {#if linkOutActive}
            {#if !isEmpty(post.participants)}
              <p in:fly={{ duration: 150, y: 10 }}>
                <a
                  href="/{$languagePrefix}/participant/{get(post, 'participants[0].slug', '')}"
                  class="author">
                  {get(post, 'participants[0].en_title', '')}
                </a>
              </p>
            {/if}
            <p in:fly={{ duration: 150, delay: 100, y: 10 }}>
              {#if $isEnglish}{post.en_title}{/if}
              {#if $isArabic}{post.ar_title}{/if}
            </p>

            <p in:fly={{ duration: 150, delay: 200, y: 10 }}>
              <a href={post.link} target="_blank" class="external-link">
                Read on {post.publisherName}
              </a>
            </p>
          {/if}
        </div>
      </div>
    {:else}
      <a href="/{$languagePrefix}/{post.category}/{post.slug}">
        <div class="tile-bar">
          {#if !linkOutActive}
            <div class="tile-title">
              {#if $isEnglish && post.en_title}{post.en_title}{/if}
              {#if $isArabic && post.ar_title}{post.ar_title}{/if}
            </div>
          {/if}
        </div>
        <div class="tile-image">
          {#if post.mainImage}
            <img
              src={urlFor(post.mainImage)
                .height(320)
                .width(imgWidth)
                .quality(100)
                .auto('format')
                .url()}
              alt={$isEnglish ? post.en_title : post.ar_title} />
          {/if}
        </div>
      </a>
    {/if}
  </div>

</Router>

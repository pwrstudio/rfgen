<script>
  // # # # # # # # # # # # # #
  //
  //  Tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, links } from "svelte-routing";
  import { fade } from "svelte/transition";

  // *** COMPONENTS

  // *** STORES
  import { isArabic, isEnglish } from "../stores.js";

  // *** GLOBALS
  import { categoryList } from "../globals.js";
  import { urlFor } from "../sanity.js";

  // *** Props
  export let post = {};

  // ** CONSTANTS

  // ** VARIABLES
  let color = "";

  $: {
    color = post.category
      ? categoryList.find(cat => cat.slug === post.category).color
      : "rfgen-white";
  }

  // ** FUNCTIONS
  //   const linear = function(n) {
  //     return n;
  //   };

  onMount(async () => {});
</script>

<style lang="scss">
  @import "../variables.scss";

  $tile-height: 400px;
  $tile-bar-height: 60px;

  .tile {
    // display: inline-block;
    width: calc(100% / 3);
    width: 33.33%;
    height: $tile-height;
    margin: 0;
    float: left;
    position: relative;

    @include screen-size("small") {
      width: 100%;
    }
  }

  .tile-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: $tile-bar-height;
    height: auto;
    min-height: $tile-bar-height;
    // clip-path: inset(0px 0 340px 0);
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    font-size: $rfgen-font-size-large;
    line-height: $rfgen-font-size-large;
    display: flex;
    justify-content: space-between;
    // padding-top: $tile-bar-height;
    transition: none;

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
    }
  }

  .tile-image {
    margin-top: $tile-bar-height;
    height: calc(#{$tile-height} - #{$tile-bar-height});
    width: 100%;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .tile-title {
    padding-right: 4 * $rfgen-grid-unit;
  }

  .tile-category {
    white-space: nowrap;
    text-transform: capitalize;
    // text-align: right;
  }

  .tile:hover .tile-bar {
    height: $tile-height;
    // transition: clip-path 0.15s $easing;
    // clip-path: inset(0px 0 0px 0);
  }
</style>

<Router>
  <div class="tile" use:links in:fade>
    <a href="{post.category}/{post.slug}">
      <div class="tile-bar {color}">
        <div class="tile-title">
          {#if $isEnglish}{post.en_title}{/if}
          {#if $isArabic}{post.ar_title}{/if}
        </div>
        <!-- <div class="tile-category">
          {post.category} -->
        <!-- {#if $isEnglish}{post.en_category}{/if}
          {#if $isArabic}{post.ar_category}{/if} -->
        <!-- </div> -->
      </div>
      <div class="tile-image">
        {#if post.mainImage}
          <img
            src={urlFor(post.mainImage)
              .height(400)
              .quality(100)
              .auto('format')
              .url()}
            alt={$isEnglish ? post.en_title : post.ar_title} />
        {/if}
      </div>
    </a>
  </div>
</Router>

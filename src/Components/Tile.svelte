<script>
  // # # # # # # # # # # # # #
  //
  //  Tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, links } from "svelte-routing";

  // *** COMPONENTS
  //   import Scroller from "./Scroller.svelte";
  //   import Horz from "./Scroller2.svelte";
  //   import Menu from "./Menu.svelte";
  //   import Page from "./Page.svelte";

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

  $tile-height: 380px;
  $tile-bar-height: 60px;

  .tile {
    // display: inline-block;
    width: calc(100% / 3);
    width: 33%;
    height: $tile-height;
    margin: 0;
    float: left;
    position: relative;

    @include screen-size("small") {
      width: 50%;
    }
  }

  .tile-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: $tile-height;
    clip-path: inset(0px 0 320px 0);
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    // font-size: $rfgen-font-size-large;
    // line-height: $rfgen-font-size-large;
    display: flex;
    justify-content: space-between;
    // padding-top: $tile-bar-height;
    transition: clip-path 0.2s $easing;
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
    padding-right: 2 * $rfgen-grid-unit;
  }

  .tile-category {
    white-space: nowrap;
    // text-align: right;
  }

  .tile:hover .tile-bar {
    clip-path: inset(0px 0 0px 0);
  }
</style>

<Router>
  <div class="tile" use:links>
    <a href="{post.category}/{post.slug}">
      <div class="tile-bar {color}">
        <div class="tile-title">
          {#if $isEnglish}{post.en_title}{/if}
          {#if $isArabic}{post.ar_title}{/if}
        </div>
        <div class="tile-category">
          {post.category}
          <!-- {#if $isEnglish}{post.en_category}{/if}
          {#if $isArabic}{post.ar_category}{/if} -->
        </div>
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

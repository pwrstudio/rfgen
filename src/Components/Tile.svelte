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

  // *** Props
  export let post = {};

  // ** CONSTANTS

  // ** VARIABLES

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
    height: $tile-height;
    background: blue;
    margin: 0;
    float: left;
    position: relative;
  }

  .tile-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: $tile-bar-height;
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    // font-size: $rfgen-font-size-large;
    // line-height: $rfgen-font-size-large;
    display: flex;
    justify-content: space-between;
    // padding-top: $tile-bar-height;
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
    height: 100%;
  }
</style>

<Router>
  <div class="tile" use:links>
    <a href="{post.category.slug}/{post.title.slug}">
      <div class="tile-bar {post.color}">
        <div class="tile-title">
          {#if $isEnglish}{post.title.english}{/if}
          {#if $isArabic}{post.title.arabic}{/if}
        </div>
        <div class="tile-category">
          {#if $isEnglish}{post.category.english}{/if}
          {#if $isArabic}{post.category.arabic}{/if}
        </div>
      </div>
      <div class="tile-image">
        <img
          src="/img/{post.image}"
          alt={$isEnglish ? post.title.english : post.title.arabic} />
      </div>
    </a>
  </div>
</Router>

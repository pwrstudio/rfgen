<script>
  // # # # # # # # # # # # # #
  //
  //  IntroTile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { Router, Link, links, navigate } from "svelte-routing";
  import kebabCase from "lodash/kebabCase";

  // *** COMPONENTS

  // *** STORES
  import { isArabic, isEnglish, languagePrefix } from "../stores.js";

  // *** GLOBALS
  import { categoryList } from "../globals.js";
  import { urlFor } from "../sanity.js";

  // *** PROPS
  export let category;
  export let width = 20;

  // *** DOM REFERENCES
  let tileEl = {};

  // ** VARIABLES
  let color = "";
  let loaded = false;
  let linkOutActive = false;

  // console.dir(categoryList[0].name);
  // console.log(post);
  $: {
    if (category) {
      let matchingCategory = categoryList.find(
        cat => cat.categorySlug === kebabCase(category)
      );
      color = matchingCategory ? matchingCategory.color : "rfgen-white";
    }
  }

  // *** ON MOUNT
  onMount(async () => {
    loaded = true;
    // imagesLoaded(tileEl, instance => {
    //   loaded = true;
    // });
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  $tile-height: 400px;
  $tile-bar-height: 40px;

  .tile {
    width: 33.33%;
    height: $tile-height;
    margin: 0;
    float: left;
    position: relative;
    opacity: 0;
    transition: opacity 0.5s $easing;
    cursor: pointer;

    @include screen-size("small") {
      width: 100%;
    }

    &.loaded {
      opacity: 1;
    }
  }

  .width-30 {
    width: 30%;
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-33 {
    width: 33.3333%;
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

  .width-25 {
    width: 25%;
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

  .width-50 {
    width: 50%;
    @include screen-size("small") {
      width: 100%;
    }
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
    display: flex;
    justify-content: space-between;
    transition: none;
    z-index: 10;
    // @include screen-size("small") {
    //   font-size: $rfgen-font-size-mobile-large;
    // }
  }

  .tile-overlay {
    position: absolute;
    left: 0;
    top: $tile-bar-height;
    top: 0;
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    font-size: $rfgen-font-size-large;
    line-height: $rfgen-font-size-large;
    // clip-path: inset(0px 0px 100% 0px);
    height: calc(#{$tile-height} - #{$tile-bar-height});
    height: $tile-height;

    z-index: 11;
    pointer-events: none;
    // transition: clip-path 0.2s $easing;
    opacity: 0;

    &.active {
      opacity: 1;
      // clip-path: inset(0% 0% 0% 0%);

      // transition: clip-path 0.2s $easing;

      pointer-events: all;
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
  }

  // .tile:active .tile-bar {
  //   height: $tile-height;
  // }

  .external-link {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
</style>

<Router>

  <div class="tile width-{width}" use:links bind:this={tileEl} class:loaded>

    <a href="/{$languagePrefix}/category}/introduction">
      <div class="tile-bar {color}">
        <div class="tile-title">
          {#if $isEnglish}{category}{/if}
          {#if $isArabic}{category}{/if}
        </div>

      </div>
      kdkdkd
    </a>
  </div>

</Router>

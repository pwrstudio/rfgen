<script>
  // # # # # # # # # # # # # #
  //
  //  Tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { Router, Link, links, navigate } from "svelte-routing";
  import kebabCase from "lodash/kebabCase";
  import get from "lodash/get";

  // *** STORES
  import { isArabic, isEnglish, languagePrefix } from "../stores.js";

  // *** GLOBALS
  import { categoryList } from "../globals.js";
  import { urlFor } from "../sanity.js";

  // *** PROPS
  export let post = {};

  // *** DOM REFERENCES
  let tileEl = {};

  // ** VARIABLES
  let color = "";
  let loaded = true;
  let linkOutActive = false;
  let categoryDisplayName = "";

  $: {
    if (post.category) {
      let matchingCategory = categoryList.find(
        cat => cat.categorySlug === kebabCase(post.category)
      );
      color = matchingCategory ? matchingCategory.color : "rfgen-white";
      categoryDisplayName = get(matchingCategory, "nameDisplay.english", false);
    }
  }

  const isLongTitle = () => post.en_title.length > 35;

  const handleClick = e => {
    linkOutActive = !linkOutActive;
  };

  // const openOverlay = e => {
  //   if (post.category === "writing") {
  //     linkOutActive = true;
  //   }
  // };

  // *** ON MOUNT
</script>

<style lang="scss">
  @import "../variables.scss";

  $tile-height: 400px;
  $tile-bar-height: 40px;

  .tile {
    margin: 0;
    float: left;
    opacity: 0;
    transition: opacity 0.5s $easing;
    cursor: pointer;

    width: 100%;
    @include screen-size("small") {
      width: 100%;
    }

    &.loaded {
      opacity: 1;
    }
  }

  .tile-bar {
    height: auto;
    min-height: 200px;
    width: 100%;
    padding: $rfgen-grid-unit;
    // padding-left: 0;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    font-size: $rfgen-font-size-large;
    line-height: $rfgen-font-size-large;
    transition: none;
    z-index: 10;
  }

  .tile-title {
    margin-bottom: 1em;
  }

  .tile-category {
    margin-bottom: 1em;
  }
</style>

<Router>

  <div class="tile width-100" use:links bind:this={tileEl} class:loaded>

    <a href="/{$languagePrefix}/{post.category}/{post.slug}">
      <div class="tile-bar {color}">
        <div class="tile-category">
          {categoryDisplayName}
          <!-- {#if $isEnglish}{post.en_category}{/if}
          {#if $isArabic}{post.ar_category}{/if} -->
        </div>
        <div class="tile-title">
          {#if $isEnglish}{post.en_title}{/if}
          {#if $isArabic}{post.ar_title}{/if}
        </div>

      </div>
    </a>

  </div>

</Router>

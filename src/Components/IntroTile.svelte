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
  import truncate from "lodash/truncate";
  import { renderBlockText } from "../sanity.js";

  // *** COMPONENTS

  // *** STORES
  import {
    isArabic,
    isEnglish,
    categoryList,
    languagePrefix
  } from "../stores.js";
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

  $: {
    if (post.category) {
      let matchingCategory = $categoryList.find(
        cat => cat.categorySlug === kebabCase(post.slug)
      );
      color = matchingCategory ? matchingCategory.color : "rfgen-white";
      // console.log(color);
    }
  }

  // *** ON MOUNT
  onMount(async () => {
    loaded = true;
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  $tile-height: 220px;
  $tile-bar-height: 40px;

  .intro-tile {
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
    height: 100%;
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    display: flex;
    justify-content: space-between;
    transition: none;
    z-index: 10;
    // font-size: $rfgen-font-size-large;
    // line-height: $rfgen-font-size-large;
    overflow: hidden;
    // @include screen-size("small") {
    //   font-size: $rfgen-font-size-mobile-large;
    // }
  }
  // .tile:active .tile-bar {
  //   height: $tile-height;
  // }

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
  }
</style>

<Router>

  <div
    class="intro-tile width-{width} order-{order}"
    use:links
    bind:this={tileEl}
    class:loaded>

    <a href="/{$languagePrefix}/introduction/{post.slug}">
      <div class="tile-bar {color}">
        {@html truncate(renderBlockText(post.en_content), {
          length: 240,
          separator: ' '
        })}
        <!-- {truncate(post.en_content, { length: 300, separator: ' ' })} -->
      </div>

    </a>
  </div>

</Router>

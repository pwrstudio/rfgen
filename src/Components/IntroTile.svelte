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

  // *** COMPONENTS

  // *** STORES
  import { isArabic, isEnglish, languagePrefix } from "../stores.js";

  // *** GLOBALS
  import { categoryList } from "../globals.js";
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

  $: {
    if (post.category) {
      let matchingCategory = categoryList.find(
        cat => cat.categorySlug === kebabCase(post.category)
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
    height: 100%;
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    display: flex;
    justify-content: space-between;
    transition: none;
    z-index: 10;
    font-size: $rfgen-font-size-large;
    line-height: $rfgen-font-size-large;
    // @include screen-size("small") {
    //   font-size: $rfgen-font-size-mobile-large;
    // }
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

  .width-30 {
    width: calc(30% - 2px);

    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-33 {
    width: calc(33.3333% - 2px);
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-40 {
    width: calc(40% - 2px);
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-25 {
    width: calc(25% - 2px);
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-35 {
    width: calc(35% - 2px);
    @include screen-size("small") {
      width: 100%;
    }
  }

  .width-50 {
    width: calc(50% - 2px);
    @include screen-size("small") {
      width: 100%;
    }
  }

  .order-0,
  .order-1 {
    margin-right: 2px;
  }
</style>

<Router>

  <div
    class="tile width-{width} order-{order}"
    use:links
    bind:this={tileEl}
    class:loaded>

    <a href="/{$languagePrefix}/{post.category}/introduction">
      <div class="tile-bar {color}">
        {truncate(post.text, { length: 300, separator: ' ' })}
      </div>

    </a>
  </div>

</Router>

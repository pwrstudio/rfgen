<script>
  // # # # # # # # # # # # # #
  //
  //  Tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, links } from "svelte-routing";
  import imagesLoaded from "imagesloaded";

  // *** COMPONENTS

  // *** STORES
  import { isArabic, isEnglish } from "../stores.js";

  // *** GLOBALS
  import { categoryList } from "../globals.js";
  import { urlFor } from "../sanity.js";

  // *** Props
  export let post = {};
  export let width = 20;

  // *** DOM REFERENCES
  let tileEl = {};

  // ** VARIABLES
  let color = "";
  let loaded = false;

  $: {
    color = post.category
      ? categoryList.find(cat => cat.slug === post.category).color
      : "rfgen-white";
  }

  const isLongTitle = () => post.en_title.length > 35;

  // *** ON MOUNT
  onMount(async () => {
    console.log(post.en_title.length);
    console.log(isLongTitle());
    imagesLoaded(tileEl, instance => {
      loaded = true;
    });
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  $tile-height: 400px;
  $tile-bar-height: 80px;

  .tile {
    width: 33.33%;
    height: $tile-height;
    margin: 0;
    float: left;
    position: relative;
    opacity: 0;
    transition: opacity 0.5s $easing;

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
    width: 33%;
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
    // height: auto;
    // min-height: $tile-bar-height;
    // clip-path: inset(0px 0 340px 0);
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    font-size: $rfgen-font-size-large;
    line-height: $rfgen-font-size-large;
    display: flex;
    justify-content: space-between;
    transition: none;

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
    }

    &.double {
      height: 80px;
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

  .tile:active .tile-bar {
    height: $tile-height;
  }
</style>

<Router>
  <div class="tile width-{width}" use:links bind:this={tileEl} class:loaded>
    <a href="{post.category}/{post.slug}">
      <div class="tile-bar {color}" class:double={post.en_title.length > 65}>
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
              .minWidth(800)
              .fit('clip')
              .quality(100)
              .auto('format')
              .url()}
            alt={$isEnglish ? post.en_title : post.ar_title} />
        {/if}
      </div>
    </a>
  </div>
</Router>

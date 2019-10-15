<script>
  // # # # # # # # # # # # # #
  //
  //  Tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, links, navigate } from "svelte-routing";
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
  let linkOutActive = false;

  $: {
    color = post.category
      ? categoryList.find(cat => cat.slug === post.category).color
      : "rfgen-white";
  }

  const isLongTitle = () => post.en_title.length > 35;

  const handleClick = e => {
    if (post.category === "writing") {
      linkOutActive = !linkOutActive;
    } else {
      navigate(post.category + "/" + post.slug);
    }
  };

  // const openOverlay = e => {
  //   if (post.category === "writing") {
  //     linkOutActive = true;
  //   }
  // };

  // *** ON MOUNT
  onMount(async () => {
    // console.log(post.en_title.length);
    // console.log(isLongTitle());
    console.dir(post);
    imagesLoaded(tileEl, instance => {
      loaded = true;
    });
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

    // @include screen-size("small") {
    //   font-size: $rfgen-font-size-mobile-large;
    // }
  }

  .tile-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: $tile-height;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    font-size: $rfgen-font-size-large;
    line-height: $rfgen-font-size-large;

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5 $easing;

    &.active {
      transition: opacity 0.5 $easing;

      opacity: 1;
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
    border-bottom: 2px solid $rfgen-black;

    &:hover {
      border-bottom: 2px solid transparent;
    }
  }
</style>

<Router>
  <div class="tile width-{width}" use:links bind:this={tileEl} class:loaded>
    <div on:click={handleClick}>
      <div class="tile-bar {color}">
        {#if !linkOutActive}
          <div class="tile-title">
            {#if $isEnglish}{post.en_title}{/if}
            {#if $isArabic}{post.ar_title}{/if}
          </div>
        {/if}
        <!-- <div class="tile-category"> -->
        <!-- {post.category} -->
        <!-- {#if $isEnglish}{post.en_category}{/if}
          {#if $isArabic}{post.ar_category}{/if} -->
        <!-- </div> -->
      </div>
      <div class="tile-image">
        {#if post.mainImage}
          <img
            src={urlFor(post.mainImage)
              .height(800)
              .width(800)
              .fit('clip')
              .quality(100)
              .auto('format')
              .url()}
            alt={$isEnglish ? post.en_title : post.ar_title} />
        {/if}
      </div>
      {#if post.category === 'writing'}
        <div class="tile-overlay {color}" class:active={linkOutActive}>
          <p>
            {#if $isEnglish}{post.en_title}{/if}
            {#if $isArabic}{post.ar_title}{/if}
          </p>
          <p>
            <a
              href="participant/{post.author && post.author.slug && post.author.slug.current ? post.author.slug.current : ''}"
              class="author">
              {post.author.en_name}
            </a>
          </p>
          <p>
            <a href={post.link} target="_blank" class="external-link">
              Read on {post.publisherName}
            </a>
          </p>
        </div>
      {/if}
    </div>
  </div>
</Router>

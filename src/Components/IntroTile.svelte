<script>
  // # # # # # # # # # # # # #
  //
  //  Introduction text tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { Router, links } from "svelte-routing";
  import { toPlainText } from "../sanity.js";
  // _lodash
  import kebabCase from "lodash/kebabCase";

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

  // ** VARIABLES
  let color = "";

  // >>> RE-USE
  $: {
    if (post.category) {
      let matchingCategory = $categoryList.find(
        cat => cat.categorySlug === kebabCase(post.slug)
      );
      color = matchingCategory ? matchingCategory.color : "rfgen-white";
    }
  }
  // <<< RE-USE
</script>

<style lang="scss">
  @import "../variables.scss";

  .intro-tile {
    width: 33.33%;
    height: $tile-height;
    margin: 0;
    float: left;
    position: relative;
    opacity: 1;
    transition: opacity 0.5s $easing;
    cursor: pointer;
    border-right: 2px solid white;

    @include screen-size("small") {
      width: 100%;
      margin-bottom: 2px;
      border-right: 0px;
    }
  }

  .intro-tile-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-small;
    line-height: $rfgen-font-size-small;
    transition: none;
    z-index: 10;
    overflow: hidden;

    span {
      padding-top: $rfgen-grid-unit;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 12;
      -webkit-line-clamp: 12;
      width: 95%;
      max-width: 45ch;

      @include screen-size("small") {
        line-clamp: 10;
        -webkit-line-clamp: 8;
      }
    }

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
      line-height: $rfgen-font-size-mobile-large;
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
</style>

<Router>

  <div class="intro-tile width-{width}" use:links>

    <a href="/{$languagePrefix}/introduction/{post.slug}">
      <div class="intro-tile-bar {color}">
        <span>{toPlainText(post.en_content)}</span>
      </div>
    </a>
  </div>

</Router>

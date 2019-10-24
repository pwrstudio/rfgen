<script>
  // # # # # # # # # # # # # #
  //
  //  Internal cross-link
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { fly } from "svelte/transition";
  import { Router, links } from "svelte-routing";
  // _lodash
  import kebabCase from "lodash/kebabCase";
  import get from "lodash/get";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    categoryList,
    languagePrefix
  } from "../stores.js";

  // *** PROPS
  export let post = {};

  // ** VARIABLES
  let color = "";
  let categoryDisplayName = "";

  // >>> RE-USE
  $: {
    if (post.category) {
      let matchingCategory = $categoryList.find(
        cat => cat.categorySlug === kebabCase(post.category)
      );
      color = matchingCategory ? matchingCategory.color : "rfgen-white";
      categoryDisplayName = get(matchingCategory, "nameDisplay.english", false);
    }
  }
  // <<< RE-USE
</script>

<style lang="scss">
  @import "../variables.scss";

  .cross-link {
    margin: 0;
    float: left;
    opacity: 1;
    transition: opacity 0.5s $easing;
    cursor: pointer;
    width: 100%;
    margin-bottom: 2px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .cross-link-bar {
    height: auto;
    min-height: 200px;
    width: 100%;
    padding: $rfgen-grid-unit;
    font-size: $rfgen-font-size-large;
    line-height: $rfgen-font-size-large;
    transition: none;
    z-index: 10;
  }

  .cross-link-title {
    margin-bottom: 1em;
  }

  .cross-link-category {
    margin-bottom: 1em;
  }
</style>

<Router>
  <div class="cross-link width-100" use:links>
    <a href="/{$languagePrefix}/{post.category}/{post.slug}">
      <div class="cross-link-bar {color}">
        <div
          class="cross-link-category"
          in:fly={{ duration: 150, delay: 0, y: 10 }}>
          {categoryDisplayName}
        </div>
        <div
          class="cross-link-title"
          in:fly={{ duration: 150, delay: 100, y: 10 }}>
          {#if $isEnglish}{post.en_title}{/if}
          {#if $isArabic}{post.ar_title}{/if}
        </div>
      </div>
    </a>
  </div>
</Router>

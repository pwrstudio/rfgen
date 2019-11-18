<script>
  // # # # # # # # # # # # # #
  //
  //  Programme View
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { fade } from "svelte/transition";
  // _lodash
  import get from "lodash/get";

  // *** COMPONENTS
  import ProgrammeSection from "../Components/ProgrammeSection.svelte";
  import MetaData from "../Components/MetaData.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    isTileView,
    categoryList,
    activeNavigation,
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { loadProgrammeData, renderBlockText } from "../sanity.js";

  // *** PROPS
  export let language = "";

  // ** CONSTANTS
  const query =
    '*[_type == "event" || (_type == "categoryIntroduction" && slug.current == "opening-programme")] | order(performanceDate asc) {simpleDate, startTime, performanceDate, eventType, _id, en_title, ar_title, en_content,  ar_content, mainImage, videoLink,  "category": _type, participants[]->{"en_title": en_name, en_title, ar_title, "slug": slug.current, "category": _type}, discussions[]->{en_title, ar_title, "slug": slug.current, "category": _type}}';

  let programme = loadProgrammeData(query, {});

  const getEventColor = type =>
    get($categoryList.find(c => c.categorySlug === type), "color", "");

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  isTileView.set(true);
  activeNavigation.set("programme");
</script>

<style lang="scss">
  @import "../variables.scss";
  @import "../variables.scss";

  .programme {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $unified-line-height;
    padding-bottom: $navigation-bottom-height;
  }

  .programme-text {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    left: 0;
    padding-top: $rfgen-grid-unit;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );

    @include screen-size("small") {
      position: static;
      float: right;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
    }

    overflow-y: auto;
    @include hide-scroll;

    &.arabic {
      left: unset;
      right: 0;
    }
  }

  .programme-category {
    text-transform: capitalize;
    margin-bottom: $unified-line-height;
    padding-left: $rfgen-grid-unit;
  }

  .programme-title {
    margin-bottom: $unified-line-height;
    font-weight: normal;
    padding-left: $rfgen-grid-unit;
  }

  .programme-text-inner {
    padding-left: $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
    width: 95%;
    &.arabic {
      padding-right: $rfgen-grid-unit;
    }
  }

  .programme-calendar {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );
    overflow-y: auto;

    user-select: none;

    @include screen-size("small") {
      position: static;
      float: left;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
    }

    opacity: 1;
    transition: opacity 0.5s $easing;

    &.arabic {
      right: unset;
      left: 0;
    }
  }
</style>

{#await programme}
  <div />
{:then programme}
  <MetaData post={programme.introduction} />
  <div class="programme">
    <div class="programme-text" class:arabic={$isArabic} in:fade>
      <div class="programme-text-inner" class:arabic={$isArabic}>
        {#if $isEnglish}
          {@html renderBlockText(programme.introduction.content.english)}
        {/if}
        {#if $isArabic}
          {@html renderBlockText(programme.introduction.content.arabic)}
        {/if}
      </div>
    </div>
    <div class="programme-calendar" class:arabic={$isArabic}>
      <ProgrammeSection
        date="Saturday, November 9th"
        events={programme.events['9']} />
      <ProgrammeSection
        date="Sunday, November 10th"
        events={programme.events['10']} />
      <ProgrammeSection
        date="Monday, November 11th"
        events={programme.events['11']} />
      <ProgrammeSection
        date="Tuesday, November 12th"
        events={programme.events['12']} />
    </div>
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

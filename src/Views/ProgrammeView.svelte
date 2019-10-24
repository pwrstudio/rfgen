<script>
  // # # # # # # # # # # # # #
  //
  //  PostView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, links } from "svelte-routing";
  import imagesLoaded from "imagesloaded";
  import get from "lodash/get";
  import uniq from "lodash/uniq";
  import flattenDeep from "lodash/flattenDeep";
  import kebabCase from "lodash/kebabCase";
  import { fade } from "svelte/transition";
  import format from "date-fns/format";
  import remove from "lodash/remove";

  // *** COMPONENTS
  import InternalLink from "../Components/InternalLink.svelte";
  import Video from "../Components/Video.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    navigationColor,
    activeNavigation,
    categoryList,
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, baseProjections } from "../globals.js";
  import { client, renderBlockText, urlFor } from "../sanity.js";

  // *** PROPS
  export let slug = "";
  export let category = "";
  export let language = "";
  export let location = {};

  // *** DOM REFERENCES
  let imageEl = {};

  // ** VARIABLES
  let loaded = true;
  let color = "rfgen-white";
  let introduction = {};

  // ** CONSTANTS
  const query =
    '*[_type == "event" || (_type == "categoryIntroduction" && slug.current == "opening-programme")] | order(performanceDate asc) {performanceDate, eventType, _id, en_title, ar_title, en_content, ar_content, mainImage, videoLink,  "category": _type, participants[]->{"en_title": en_name, en_title, "ar_title": ar_name, "slug": slug.current, "category": _type}, discussions[]->{en_title, ar_title, "slug": slug.current, "category": _type}}';

  const isCategoryIntroduciton = p => p.category === "categoryIntroduction";

  let events = loadData(query, {});

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  navigationColor.set("rfgen-white");

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      introduction = remove(res, isCategoryIntroduciton)[0];
      res.forEach(
        e =>
          (e.color = $categoryList.find(
            c => c.categorySlug === e.eventType
          ).color)
      );
      return res;
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    }
  }

  // *** ON MOUNT
  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";
  @import "../variables.scss";

  .programme {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;
  }

  .programme-text {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    left: 0;
    padding-top: 2 * $rfgen-grid-unit;
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

  .programme-calendar {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    background: rgba(0, 0, 0, 0.05);
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    iframe {
      display: block;
      margin-top: 40px;
      margin-left: auto;
      margin-right: auto;
      width: calc(100% - 10px);
    }

    @include screen-size("small") {
      position: static;
      float: left;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
    }

    opacity: 0;
    transition: opacity 0.5s $easing;

    &.loaded {
      opacity: 1;
    }

    &.arabic {
      right: unset;
      left: 0;
    }
  }

  .programme-event {
    margin-bottom: 2px;
    padding: $rfgen-grid-unit;
    padding-bottom: 1em;
  }

  a {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  .programme-category {
    text-transform: capitalize;
    margin-bottom: 1em;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    // font-size: $rfgen-font-size-small;
    // line-height: $rfgen-font-size-small;
  }

  .programme-title {
    margin-bottom: 1em;
    font-weight: bold;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
  }

  .programme-event-title {
    font-weight: bold;
  }

  .programme-text-inner {
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
  }

  .links-container {
    margin-top: 1em;
  }
</style>

<svelte:head>
  {#if $isEnglish}
    <title>Opening Programme / {siteInfo.title.english}</title>
  {/if}
  {#if $isArabic}
    <title>{siteInfo.title.arabic} / Opening Programme</title>
  {/if}
</svelte:head>

<Router>
  <div class="programme">
    {#await events then events}
      <div class="programme-text" class:arabic={$isArabic} in:fade>
        <div class="programme-title">Opening programme</div>
        <div class="programme-text-inner">
          {#if $isEnglish}
            {@html renderBlockText(introduction.en_content)}
          {/if}
          {#if $isArabic}
            {@html renderBlockText(introduction.ar_content)}
          {/if}
        </div>
      </div>

      <div
        class="programme-calendar"
        class:loaded
        class:arabic={$isArabic}
        use:links>
        {#each events as event}
          <div class="programme-event {event.color}">
            <div class="programme-event-date">
              {format(new Date(event.performanceDate), 'MMMM do kk:mm')}
            </div>
            <div class="programme-event-title">
              {#if $isEnglish}{event.en_title}{/if}
              {#if $isArabic}{event.ar_title}{/if}
            </div>
            <div class="programme-event-text">
              {#if $isEnglish && event.en_content}
                {@html renderBlockText(event.en_content)}
              {/if}
              {#if $isArabic && event.ar_content}
                {@html renderBlockText(event.ar_content)}
              {/if}
            </div>
            <div class="programme-event-text" />
            {#if event.participants}
              {#each event.participants as participant}
                <a
                  href="/{$languagePrefix}/{participant.category}/{participant.slug}">
                  {participant.en_title}
                </a>
              {/each}
            {/if}
            {#if event.discussions}
              {#each event.discussions as discussion}
                <a
                  href="/{$languagePrefix}/{discussion.category}/{discussion.slug}">
                  {discussion.en_title}
                </a>
              {/each}
            {/if}
          </div>
        {/each}
      </div>

    {/await}
  </div>
</Router>

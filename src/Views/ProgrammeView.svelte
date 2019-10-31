<script>
  // # # # # # # # # # # # # #
  //
  //  PostView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { Router, links } from "svelte-routing";
  import { fade } from "svelte/transition";
  // _lodash
  import get from "lodash/get";
  import isEmpty from "lodash/isEmpty";

  // date-fns
  // import format from "date-fns/format";
  import isValid from "date-fns/isValid";
  // import zonedTimeToUtc from "date-fns/zonedTimeToUtc";

  // *** COMPONENTS
  import InternalLink from "../Components/InternalLink.svelte";
  import MetaData from "../Components/MetaData.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    isTileView,
    activeNavigation,
    categoryList,
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo } from "../globals.js";
  import { loadProgrammeData, renderBlockText } from "../sanity.js";

  // *** PROPS
  export let slug = "";
  export let category = "";
  export let language = "";
  export let location = {};

  // ** CONSTANTS
  const query =
    '*[_type == "event" || (_type == "categoryIntroduction" && slug.current == "opening-programme")] | order(performanceDate asc) {startTime,  performanceDate, eventType, _id, en_title, ar_title, en_content,  ar_content, mainImage, videoLink,  "category": _type, participants[]->{"en_title": en_name, en_title, ar_title, "slug": slug.current, "category": _type}, discussions[]->{en_title, ar_title, "slug": slug.current, "category": _type}}';

  let programme = loadProgrammeData(query, {});

  const getEventColor = type =>
    get($categoryList.find(c => c.categorySlug === type), "color", "");

  // const getEventDate = date => {
  //   let eventDate = new Date(date);
  //   const output = format(zonedDate, pattern, { timeZone });
  //   if (isValid(eventDate)) return format(eventDate, "kk:mm");
  //   return "";
  // };

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  isTileView.set(true);
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

  .programme-calendar {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    background: rgba(0, 0, 0, 0.05);
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );
    overflow-y: auto;

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

    opacity: 1;
    transition: opacity 0.5s $easing;

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

  .programme-event-title {
    margin-bottom: 1em;
  }

  .programme-event-text {
    margin-bottom: 1em;
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
  }

  .programme-title {
    margin-bottom: 1em;
    font-weight: normal;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
  }

  .programme-text-inner {
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
  }

  .links-container {
    margin-top: 1em;
  }

  .top-date {
    background: $rfgen-dark-grey;
    padding-bottom: 3em;
  }

  .other {
    background: $rfgen-grey;
  }
</style>

{#await programme then programme}
  <MetaData post={programme.introduction} />
{/await}

<Router>
  <div class="programme">
    {#await programme then programme}
      <div class="programme-text" class:arabic={$isArabic} in:fade>
        <div class="programme-text-inner">
          {#if $isEnglish}
            {@html renderBlockText(programme.introduction.content.english)}
          {/if}
          {#if $isArabic}
            {@html renderBlockText(programme.introduction.content.arabic)}
          {/if}
        </div>
      </div>

      <div class="programme-calendar" class:arabic={$isArabic} use:links>
        {#each programme.events as event}
          {#if event.category === 'date-marker'}
            <div class="programme-event top-date">
              <div class="programme-event-date">{event.text}</div>
            </div>
          {:else}
            <div
              class="programme-event {getEventColor(event.event.type)}
              {event.event.type}">
              <div class="programme-event-date">
                {event.event.startTime}
                <!-- {getEventDate(event.event.date)} -->
              </div>
              {#if !isEmpty(event.event.performers)}
                <div class="programme-event-text">
                  {#each event.event.performers as performer}
                    <a
                      href="/{$languagePrefix}/{performer.category}/{performer.slug}">
                      {#if $isEnglish}{performer.en_title}{/if}
                      {#if $isArabic}{performer.ar_title}{/if}
                    </a>
                  {/each}
                </div>
              {/if}
              {#if !isEmpty(event.event.discussions)}
                <div class="programme-event-text">
                  {#each event.event.discussions as discussion}
                    <a
                      href="/{$languagePrefix}/{discussion.category}/{discussion.slug}">
                      {#if $isEnglish}{discussion.en_title}{/if}
                      {#if $isArabic}{discussion.ar_title}{/if}
                    </a>
                  {/each}
                </div>
              {/if}
              {#if isEmpty(event.event.performers) && isEmpty(event.event.discussions)}
                <div class="programme-event-title">
                  {#if $isEnglish}{event.title.english}{/if}
                  {#if $isArabic}{event.title.arabic}{/if}
                </div>
              {/if}
              <div class="programme-event-text">
                {#if $isEnglish && event.content.arabic}
                  {@html renderBlockText(event.content.english)}
                {/if}
                {#if $isArabic && event.content.arabic}
                  {@html renderBlockText(event.content.arabic)}
                {/if}
              </div>
            </div>
          {/if}
        {/each}
      </div>

    {/await}
  </div>
</Router>

<script>
  // # # # # # # # # # # # # #
  //
  //  Programme Section
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { Router, links } from "svelte-routing";
  import { fade, scale } from "svelte/transition";

  // _lodash
  import get from "lodash/get";
  import has from "lodash/has";
  import isEmpty from "lodash/isEmpty";

  // *** PROPS
  export let events = [];
  export let date = "";

  // *** VARIABLES
  let open = false;

  // *** STORES
  import {
    isArabic,
    isEnglish,
    categoryList,
    languagePrefix
  } from "../stores.js";

  // *** GLOBALS
  import { renderBlockText } from "../sanity.js";

  const getEventColor = type =>
    get($categoryList.find(c => c.categorySlug === type), "color", "");
</script>

<style lang="scss">
  @import "../variables.scss";

  .programme-event {
    margin-bottom: 2px;
    padding: $rfgen-grid-unit;
    padding-bottom: $unified-line-height;
  }

  .programme-event-title {
    margin-bottom: $unified-line-height;
  }

  .programme-event-text {
    margin-bottom: $unified-line-height;
  }

  a {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  .other {
    background: $rfgen-grey;
  }

  .programme-event-header-date {
    float: left;
  }

  .programme-event-open {
    float: right;
    width: 50px;
    height: 50px;
    position: relative;
    top: -7px;
    svg {
      width: 100%;
    }
    margin-bottom: $unified-line-height;
  }

  .top-date {
    background: $rfgen-yellow;
    padding: $rfgen-grid-unit;
    padding-bottom: 15 * $rfgen-grid-unit;
    cursor: pointer;
  }
</style>

<Router>
  <div
    class="programme-event top-date"
    on:click={e => {
      open = !open;
    }}>
    <div class="programme-event-header-date">{date}</div>
    <div class="programme-event-open">
      {#if open}
        <svg
          in:scale={{ duration: 250 }}
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          class="feather feather-x">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      {:else}
        <svg
          in:scale={{ duration: 250 }}
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          class="feather feather-chevron-down">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      {/if}
    </div>
  </div>
  {#if open}
    <div class="programme-event-body">
      {#each events as event, i}
        <div
          class="programme-event {getEventColor(event.event.type)}
          {event.event.type}"
          in:fade={{ duration: 100, delay: 75 * (i + 1) }}
          use:links>
          <div class="programme-event-date">{event.event.startTime}</div>
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
            {#if $isEnglish && has(event, 'content.english', false)}
              {@html renderBlockText(event.content.english)}
            {/if}
            {#if $isArabic && has(event, 'content.arabic', false)}
              {@html renderBlockText(event.content.arabic)}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</Router>

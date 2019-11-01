<script>
  // # # # # # # # # # # # # #
  //
  //  Programme Section
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { Router, links } from "svelte-routing";
  import { fade } from "svelte/transition";

  // _lodash
  import get from "lodash/get";
  import isEmpty from "lodash/isEmpty";

  // *** COMPONENTS
  import InternalLink from "../Components/InternalLink.svelte";

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

  .other {
    background: $rfgen-grey;
  }

  .top-date {
    background: $rfgen-yellow;
    padding: $rfgen-grid-unit;
    padding-bottom: 15 * $rfgen-grid-unit;
    cursor: pointer;
  }
</style>

<Router>
  <div class="programme-event top-date" on:click={() => (open = !open)}>
    <div class="programme-event-date">{date}</div>
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
            {#if $isEnglish && event.content.arabic}
              {@html renderBlockText(event.content.english)}
            {/if}
            {#if $isArabic && event.content.arabic}
              {@html renderBlockText(event.content.arabic)}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</Router>

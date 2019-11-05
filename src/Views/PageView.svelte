<script>
  // # # # # # # # # # # # # #
  //
  //  PageView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  // _lodash
  import get from "lodash/get";

  // *** COMPONENTS
  import Satoshi from "../Components/Satoshi.svelte";
  import MetaData from "../Components/MetaData.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    isTileView,
    activeNavigation,
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { loadSingleData, renderBlockText } from "../sanity.js";

  // *** PROPS
  export let slug = {};
  export let location = {};
  export let language = "";

  // ** VARIABLES
  let page = {};
  let title = "";

  // ** CONSTANTS
  const query = '*[_type == "page" && slug.current == $slug][0]';

  $: {
    page = loadSingleData(query, { slug: slug });
  }

  $: {
    activeNavigation.set(slug ? slug : "");
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");

  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .page-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $unified-line-height;
    padding-bottom: $navigation-bottom-height;

    @include screen-size("small") {
      padding-bottom: 30px;
    }
  }

  .page-view-text {
    width: 50vw;
    padding-left: $rfgen-grid-unit;
    padding-right: $rfgen-grid-unit;
    padding-top: $rfgen-grid-unit;
    @include screen-size("small") {
      width: 100vw;
    }
    overflow-y: auto;
    @include hide-scroll;
  }

  .page-view-text-inner {
    width: 95%;
    max-width: 45ch;
  }

  .page-title {
    font-weight: bold;
    margin-bottom: $unified-line-height;
  }

  .page-view-image {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );

    &.arabic {
      right: unset;
      left: 0;
    }

    @include screen-size("small") {
      position: static;
      width: 100%;
      line-height: 0;
      top: unset;
      height: 50vh;
    }
  }

  a {
    text-decoration: underline;
  }

  .team-header {
    margin-bottom: $unified-line-height;
  }

  .page-category {
    margin-bottom: $unified-line-height;
  }

  .team-title {
    font-weight: bold;
  }

  .team-body {
    margin-bottom: 2em;
  }

  .sharjah-team {
    padding-top: $unified-line-height;
  }
</style>

{#await page then page}
  <MetaData post={page} />
{/await}

<div class="page-view">
  {#await page}
    <div />
  {:then page}
    <div class="page-view-image" class:arabic={$isArabic}>
      <Satoshi satoshiIndex={page.satoshiIndex} />
    </div>
    <div class="page-view-text" in:fade>
      <div class="page-view-text-inner">
        {#if slug === 'team'}
          <div class="curatorial-team">
            <div class="team-header">Curatorial Team</div>
            {#each page.curatorialTeam as curatorialMember}
              <div class="team-header team-title">
                {#if $isEnglish}{curatorialMember.en_name}{/if}
                {#if $isArabic}{curatorialMember.ar_name}{/if}
              </div>
              <div class="team-body">
                {#if $isEnglish}
                  {@html renderBlockText(curatorialMember.en_bio)}
                {/if}
                {#if $isArabic}
                  {@html renderBlockText(curatorialMember.ar_bio)}
                {/if}
              </div>
            {/each}
          </div>
          <div class="sharjah-team">
            <div class="team-header">Sharjah Architecture Triennial Team</div>
            {#each page.sharjahTeam as sharjahlMember}
              <div class="team-header">
                <a href={sharjahlMember.link} target="_blank" rel="noreferrer">
                  {#if $isEnglish}{sharjahlMember.en_name}{/if}
                  {#if $isArabic}{sharjahlMember.ar_name}{/if}
                </a>
                <br />
                {#if $isEnglish}{sharjahlMember.en_position}{/if}
                {#if $isArabic}{sharjahlMember.ar_position}{/if}
              </div>
            {/each}
          </div>
        {:else}
          <div class="page-category">
            {#if $isEnglish}{page.title.english}{/if}
            {#if $isArabic}{page.title.arabic}{/if}
          </div>
          {#if $isEnglish}
            {@html renderBlockText(page.content.english)}
          {/if}
          {#if $isArabic}
            {@html renderBlockText(page.content.arabic)}
          {/if}
        {/if}
      </div>
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

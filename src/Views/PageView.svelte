<script>
  // # # # # # # # # # # # # #
  //
  //  PageView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";
  import get from "lodash/get";

  // *** COMPONENTS

  // *** STORES
  import {
    isArabic,
    isEnglish,
    navigationColor,
    activeNavigation
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, pageList } from "../globals.js";
  import { client, renderBlockText, urlFor } from "../sanity.js";

  // *** PROPS
  export let slug = {};
  export let location = {};

  // ** VARIABLES
  let page = {};
  let title = "";

  // ** CONSTANTS
  const query = '*[_type == "page" && slug.current == $slug][0]';
  // const params = { slug: slug };

  $: {
    page = loadData(query, { slug: slug });
  }

  $: {
    activeNavigation.set(slug ? slug : "");
  }

  //   $isSinglePage.set(true);

  navigationColor.set("rfgen-grey");

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      console.dir(res);

      let pageConstruction = {
        title: {
          english: "",
          arabic: ""
        },
        content: {
          english: [],
          arabic: []
        },
        mainImage: false,
        slug: ""
      };

      pageConstruction.title.english = get(res, "en_title", "");
      pageConstruction.title.arabic = get(res, "ar_title", "");
      pageConstruction.content.english = get(res, "en_content", []);
      pageConstruction.content.arabic = get(res, "ar_content", []);
      pageConstruction.slug = get(res, "slug.current", "");
      pageConstruction.mainImage = get(res, "mainImage", false);

      console.dir(pageConstruction);

      return pageConstruction;
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    }
  }

  onMount(async () => {
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .page-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;
  }

  .page-view-text {
    width: 50vw;
    padding-left: $rfgen-grid-unit;
    padding-right: $rfgen-grid-unit;
    padding-top: 2 * $rfgen-grid-unit;
    @include screen-size("small") {
      width: 100vw;
    }
    overflow-y: auto;
    @include hide-scroll;
  }

  .page-view-image {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.arabic {
      right: unset;
      left: 0;
    }
  }

  a {
    text-decoration: underline;
  }
</style>

<svelte:head>
  <title>{title} / {siteInfo.title.english}</title>
</svelte:head>

<div class="page-view">
  {#await page then page}
    {#if $isEnglish}
      <div class="page-view-text">
        {@html renderBlockText(page.content.english)}
      </div>
    {/if}
    {#if $isArabic}
      <div class="page-view-text">
        {@html renderBlockText(page.content.arabic)}
      </div>
    {/if}

    <div class="page-view-image" class:arabic={$isArabic}>
      {#if page.mainImage}
        <img
          src={urlFor(page.mainImage)
            .width(900)
            .quality(90)
            .auto('format')
            .url()}
          alt={$isEnglish ? page.title.english : page.title.arabic} />
      {/if}
    </div>
  {/await}
</div>

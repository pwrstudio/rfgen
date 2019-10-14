<script>
  // # # # # # # # # # # # # #
  //
  //  PageView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";

  // *** COMPONENTS
  import Tile from "../Components/Tile.svelte";

  // *** STORES
  import { isArabic, isEnglish, navigationColor } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList, pageList } from "../globals.js";
  import { client, renderBlockText } from "../sanity.js";

  // *** PROPS
  export let slug = {};
  export let location = {};

  // ** VARIABLES
  let page = {};
  let title = "";

  // ** CONSTANTS
  const query = '*[_type == "page" && slug.current == $slug]';
  // const params = { slug: slug };

  $: {
    page = loadData(query, { slug: slug });
  }

  //   $isSinglePage.set(true);

  navigationColor.set("rfgen-grey");

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      console.dir(res);
      title = res[0].en_title;
      return res[0];
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
    width: 50%;
    padding-left: $rfgen-grid-unit;
    padding-top: 2 * $rfgen-grid-unit;
  }

  .page-view-image {
    width: 50%;
  }
</style>

<svelte:head>
  <title>{title} / {siteInfo.title.english}</title>
</svelte:head>

<div class="page-view">
  {#await page then page}
    {#if $isEnglish}
      <div class="page-view-text">
        {@html renderBlockText(page.en_content)}
      </div>
    {/if}
    {#if $isArabic}
      <div class="page-view-text">
        {@html renderBlockText(page.ar_content)}
      </div>
    {/if}
    <div class="page-view-image">
      <img src="/img/img1.jpg" />
    </div>
  {/await}
</div>

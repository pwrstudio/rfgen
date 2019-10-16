<script>
  // # # # # # # # # # # # # #
  //
  //  TileView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";
  import shuffle from "lodash/shuffle";
  import chunk from "lodash/chunk";

  // *** COMPONENTS
  import Tile from "../Components/Tile.svelte";
  import Row from "../Components/Row.svelte";

  // *** STORES
  import {
    navigationColor,
    activeNavigation,
    isArabic,
    isEnglish,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList } from "../globals.js";
  import { client } from "../sanity.js";

  // *** PROPS
  export let category = "";
  export let location = {};
  export let language = "";
  export let slug = "";

  // ** CONSTANTS
  const query =
    '*[_type == "writing" || _type == "participant" || _type == "talk" || _type == "performance" || _type == "workingGroup" || _type == "project" || _type == "socialMedia"]{"en_title": en_name, en_title, "ar_title": ar_name, ar_title, "slug": slug.current, link, mainImage, author->{en_name, ar_name, slug}, publisherName, "category": _type}';

  // ** VARIABLES
  let posts = loadData(query, {});

  $: {
    activeNavigation.set(category ? category : "");
  }

  // Set globals
  globalLanguage.set(language === "en" ? "english" : "arabic");
  navigationColor.set("rfgen-white");

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      return shuffle(res.filter(r => r.mainImage));
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    }
  }

  onMount(async () => {
    console.log(language);
    console.log(category);
    console.log(category.length > 0);
    window.scrollTo(0, 0);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .tile-view {
    width: 100vw;
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: 0;
    padding-bottom: $navigation-bottom-height;

    @include screen-size("small") {
      margin-top: 80px;
    }
  }
</style>

<svelte:head>
  {#if $isEnglish}
    <title>{$activeNavigation}s / {siteInfo.title.english}</title>
  {/if}
  {#if $isArabic}
    <title>{siteInfo.title.arabic} / {$activeNavigation}s</title>
  {/if}
</svelte:head>

<div class="tile-view">
  {#await posts then posts}
    {#each category.length > 0 ? chunk(posts.filter(p => p.category === category), 3) : chunk(posts, 3) as row}
      <Row {row} />
    {/each}
  {/await}
</div>

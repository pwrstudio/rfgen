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
  import concat from "lodash/concat";
  import uniq from "lodash/uniq";
  import flattenDeep from "lodash/flattenDeep";
  import zip from "lodash/zip";
  import groupBy from "lodash/groupBy";
  import values from "lodash/values";
  import compact from "lodash/compact";
  import fp from "lodash/fp";
  import kebabCase from "lodash/kebabCase";

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
  import { siteInfo, categoryList, baseProjections } from "../globals.js";
  import { client } from "../sanity.js";

  // *** PROPS
  export let category = "";
  export let location = {};
  export let language = "";
  export let slug = "";

  // ** VARIABLES

  $: {
    console.log(category);
    activeNavigation.set(category ? category : "");
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  navigationColor.set("rfgen-white");

  // ** FUNCTIONS

  const tracer = x => {
    console.dir(x);
    return x;
  };

  const allCategories = fp.map(c => c.name)(categoryList);

  const allProjections = uniq(
    flattenDeep([...baseProjections, ...categoryList.map(c => c.projections)])
  );

  // Convert all categories into a comma-seperate list.
  const categoryReducer = (acc, curr) => acc + ' "' + curr + '", ';

  const query =
    "*[_type in [" +
    allCategories.reduce(categoryReducer, "").slice(0, -2) + //Removel comma and space from last itme
    "]]{" +
    allProjections +
    "}";

  console.log(query);

  const hasImage = p => p.mainImage;

  const intertwineCategories = posts =>
    fp.compose(
      fp.compact, // Remove undefined and null values, introduced when one category has few posts than another
      fp.flatten, // Remove wrapping array
      fp.zipAll, // Intertwine the arrays
      fp.map(fp.shuffle), // Shuffle internal order of post-array
      fp.values, // Get values from grouped object => an aray for each
      fp.groupBy(p => p.category), // Group by category
      fp.filter(hasImage) // Filter out posts without preview images (for now)
    )(posts);

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      return intertwineCategories(res);
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    }
  }

  let posts = loadData(query, {});

  onMount(async () => {
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
    {#each category.length > 0 ? chunk(posts.filter(p => kebabCase(p.category) === category), 3) : chunk(posts, 3) as row}
      <Row {row} />
    {/each}
  {/await}
</div>

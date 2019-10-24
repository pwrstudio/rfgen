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
  import remove from "lodash/remove";
  import uniq from "lodash/uniq";
  import flattenDeep from "lodash/flattenDeep";
  import zip from "lodash/zip";
  import groupBy from "lodash/groupBy";
  import values from "lodash/values";
  import get from "lodash/get";
  import compact from "lodash/compact";
  import fp from "lodash/fp";
  import kebabCase from "lodash/kebabCase";
  import uniqueId from "lodash/uniqueId";

  // *** COMPONENTS
  import Head from "../Components/Head.svelte";
  import IntroTile from "../Components/IntroTile.svelte";
  import Row from "../Components/Row.svelte";

  // *** STORES
  import {
    navigationColor,
    activeNavigation,
    isArabic,
    categoryList,
    isEnglish,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, baseProjections } from "../globals.js";
  import { client } from "../sanity.js";

  // *** PROPS
  export let category = "";
  export let categoryDisplayName = false;
  export let dynamicTitle = "";
  export let location = {};
  export let language = "";
  export let slug = "";

  // ** VARIABLES
  let introductions = [];

  $: {
    activeNavigation.set(category ? category : "");
  }

  $: {
    let categoryObject = $categoryList.find(
      c => c.categorySlug === $activeNavigation
    );
    // console.log(category);
    if (categoryObject) {
      categoryDisplayName = get(categoryObject, "nameDisplay.english", false);
    }
  }

  $: {
    if (categoryDisplayName) {
      dynamicTitle = `${categoryDisplayName} / ${siteInfo.title.english}`;
    } else {
      dynamicTitle = siteInfo.title.english;
    }
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  navigationColor.set("rfgen-white");

  // ** FUNCTIONS

  const tracer = x => {
    console.dir(x);
    return x;
  };

  const allCategories = concat(fp.map(c => c.name)($categoryList), [
    "categoryIntroduction"
  ]);

  const allProjections = uniq(
    flattenDeep([...baseProjections, ...$categoryList.map(c => c.projections)])
  );

  // Convert all categories into a comma-seperate list.
  const categoryReducer = (acc, curr) => acc + ' "' + curr + '", ';

  const query =
    "*[_type in [" +
    allCategories.reduce(categoryReducer, "").slice(0, -2) + //Removel comma and space from last itme
    "]]{" +
    allProjections +
    "}";

  const filterPostsByCategory = posts => {
    let filteredPosts = posts.filter(p => kebabCase(p.category) === category);
    filteredPosts.unshift(introductions.find(p => p.slug === category));
    return filteredPosts;
  };

  // Predicates
  const hasImage = p => p.mainImage;
  const isCategoryIntroduciton = p => p.category === "categoryIntroduction";

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
      // console.dir(res);
      introductions = remove(res, isCategoryIntroduciton);
      // console.dir(introductions);
      // console.dir(res);
      return intertwineCategories(res);
    } catch (err) {
      // console.log(err);
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
  }
</style>

<Head title={dynamicTitle} />

<div class="tile-view">
  {#await posts then posts}
    <!-- <IntroTile category /> -->
    {#each category.length > 0 ? chunk(filterPostsByCategory(posts), 5) : chunk(posts, 5) as row, i (uniqueId('row_'))}
      <Row {row} order={i + 1} />
    {/each}
  {/await}
</div>

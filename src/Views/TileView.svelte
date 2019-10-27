<script>
  // # # # # # # # # # # # # #
  //
  //  TileView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  // _lodash
  import shuffle from "lodash/shuffle";
  import chunk from "lodash/chunk";
  import concat from "lodash/concat";
  import remove from "lodash/remove";
  import uniq from "lodash/uniq";
  import map from "lodash/map";
  import flattenDeep from "lodash/flattenDeep";
  import groupBy from "lodash/groupBy";
  import sample from "lodash/sample";
  import values from "lodash/values";
  import get from "lodash/get";
  import compact from "lodash/compact";
  import kebabCase from "lodash/kebabCase";
  import uniqueId from "lodash/uniqueId";
  // _lodash/fp
  import fp from "lodash/fp";

  // *** COMPONENTS
  import Head from "../Components/Head.svelte";
  import IntroTile from "../Components/IntroTile.svelte";
  import Row from "../Components/Row.svelte";
  import Satoshi from "../Components/Satoshi.svelte";

  // *** STORES
  import {
    activeNavigation,
    isTileView,
    isArabic,
    categoryList,
    isEnglish,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, baseProjections, colorList } from "../globals.js";
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

  // >>> RE-USE
  $: {
    let categoryObject = $categoryList.find(
      c => c.categorySlug === $activeNavigation
    );
    if (categoryObject) {
      categoryDisplayName = get(categoryObject, "nameDisplay.english", false);
    }
  }
  // <<< RE-USE

  $: {
    if (categoryDisplayName) {
      dynamicTitle = `${categoryDisplayName} / ${siteInfo.title.english}`;
    } else {
      dynamicTitle = siteInfo.title.english;
    }
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  isTileView.set(true);

  // – – –
  // Start: Build query
  // – – –

  const allCategories = concat(fp.map(c => c.name)($categoryList), [
    "categoryIntroduction"
  ]);

  const allProjections = uniq(
    flattenDeep([...baseProjections, ...$categoryList.map(c => c.projections)])
  );

  // Convert all categories into a comma-separate list.
  const categoryReducer = (acc, curr) => acc + ' "' + curr + '", ';

  const query =
    "*[_type in [" +
    allCategories.reduce(categoryReducer, "").slice(0, -2) + //Removel comma and space from last itme
    "]]{" +
    allProjections +
    "}";

  // – – –
  // End: Build query
  // – – –

  const tracer = x => {
    console.dir(x);
    return x;
  };

  const filterPostsByCategory = posts => {
    let filteredPosts = posts.filter(p => kebabCase(p.category) === category);
    filteredPosts.unshift(introductions.find(p => p.slug === category));
    return filteredPosts;
  };

  const splitRows = posts => {
    if (category.length > 0) {
      return chunk(filterPostsByCategory(posts), 5);
    } else {
      let chunked = chunk(posts, 5);
      let spliced = [];
      chunked.forEach((row, i) => {
        if (i > 0 && i % 3 === 0) spliced.push({ satoshi: true });
        spliced.push(row);
      });
      return spliced;
    }
  };

  // Predicates
  const hasImage = p => p.mainImage;
  const isCategoryIntroduction = p => p.category === "categoryIntroduction";

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

  // >>> RE-USE
  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      introductions = remove(res, isCategoryIntroduction);
      return intertwineCategories(res);
    } catch (err) {
      Sentry.captureException(err);
    }
  }
  // <<< RE-USE

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
    line-height: 0;
    margin-top: $navigation-top-height;
    padding-bottom: $navigation-bottom-height;
  }

  .satoshi-strip {
    height: 2 * $tile-height;
    border-bottom: 2px solid $rfgen-white;
    .satoshi-strip-image {
      width: 80%;
      max-width: 600px;
      height: 100%;
      float: right;
    }
  }
</style>

<Head title={dynamicTitle} />

<div class="tile-view">
  {#await posts then posts}
    {#each splitRows(posts) as row, i (uniqueId('row_'))}
      {#if row.satoshi}
        <div class="satoshi-strip {sample(colorList)}">
          <div class="satoshi-strip-image">
            <Satoshi />
          </div>
        </div>
      {:else}
        <Row {row} />
      {/if}
    {/each}
  {/await}
</div>

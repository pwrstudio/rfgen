<script>
  // # # # # # # # # # # # # #
  //
  //  TileView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { navigate } from "svelte-routing";

  // _lodash
  import shuffle from "lodash/shuffle";
  import chunk from "lodash/chunk";
  import remove from "lodash/remove";
  import sample from "lodash/sample";
  import get from "lodash/get";
  import take from "lodash/take";
  import size from "lodash/size";
  import last from "lodash/last";
  import kebabCase from "lodash/kebabCase";
  import uniqueId from "lodash/uniqueId";
  import sortBy from "lodash/sortBy";
  import reverse from "lodash/reverse";
  import isEmpty from "lodash/isEmpty";

  // _lodash/fp
  import fp from "lodash/fp";

  // *** COMPONENTS
  import MetaData from "../Components/MetaData.svelte";

  import Row from "../Components/Row.svelte";
  import Satoshi from "../Components/Satoshi.svelte";

  // *** STORES
  import {
    activeNavigation,
    navigationColor,
    isTileView,
    isArabic,
    categoryList,
    isEnglish,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, baseProjections, colorList } from "../globals.js";
  import { client } from "../sanity.js";

  let metaObject = {
    title: {}
  };

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
    if (category) window.scrollTo(0, 0);
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
    metaObject.title.english = categoryDisplayName;
    metaObject.title.arabic = categoryDisplayName;
  }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  isTileView.set(true);

  const query =
    '*[_type in [ "project",  "discussion",  "performance",  "workingGroup",  "writing",  "participant",  "categoryIntroduction"]]{en_title, ar_title, "slug": slug.current, mainImage, "category": _type, en_content, ar_content, eventDate, customOrder, "en_title": en_name, "ar_title": ar_name, participants[]->{en_title, ar_title, "slug": slug.current}, link, publisherName}';

  const tracer = x => {
    console.dir(x);
    return x;
  };

  const filterPostsByCategory = posts => {
    if (!$categoryList.find(c => c.categorySlug === category)) {
      navigate("/");
      return;
    }
    let filteredPosts = posts.filter(p => kebabCase(p.category) === category);
    if (category === "discussion") {
      filteredPosts = reverse(sortBy(filteredPosts, p => p.eventDate));
    }
    if (category === "working-group") {
      filteredPosts = sortBy(filteredPosts, p => p.customOrder);
    }
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
      let lastItem = spliced.pop();
      if (size(lastItem) < 5) {
        spliced.push([...lastItem, ...take(spliced[0], 5 - size(lastItem))]);
      } else {
        spliced.push(lastItem);
      }
      return spliced;
    }
  };

  // Predicates
  const isCategoryIntroduction = p => p.category === "categoryIntroduction";

  const intertwineCategories = posts =>
    fp.compose(
      fp.compact, // Remove undefined and null values, introduced when one category has few posts than another
      fp.flatten, // Remove wrapping array
      fp.zipAll, // Intertwine the arrays
      fp.map(fp.shuffle), // Shuffle internal order of post-array
      fp.values, // Get values from grouped object => an aray for each
      fp.groupBy(p => p.category) // Group by category
      // fp.filter(hasImage) // Filter out posts without preview images (for now)
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

  onDestroy(() => isTileView.set(false));
</script>

<style lang="scss">
  @import "../variables.scss";

  .tile-view {
    width: 100vw;
    display: inline-block;
    line-height: 0;
    margin-top: $navigation-top-height;
    padding-bottom: $navigation-bottom-height;
    min-height: calc(100vh - 120px);
  }

  .satoshi-strip {
    height: 2 * $tile-height;
    @include screen-size("small") {
      display: none;
    }

    &.tall {
      height: calc(
        100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
      );
    }
  }
</style>

<MetaData post={metaObject} />

<div class="tile-view">
  {#await posts}
    <div />
  {:then posts}
    {#each splitRows(posts) as row, i (uniqueId('row_'))}
      {#if row.satoshi}
        <div class="satoshi-strip {sample(colorList)}">
          <Satoshi tiled={true} satoshiIndex={(Math.round(i / 3) - 1) % 10} />
        </div>
      {:else}
        <Row {row} />
      {/if}
    {/each}
    {#if isEmpty($activeNavigation)}
      <div class="satoshi-strip {sample(colorList)} tall">
        <Satoshi satoshiIndex={5} />
      </div>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

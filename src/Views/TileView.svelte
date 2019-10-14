<script>
  // # # # # # # # # # # # # #
  //
  //  TileView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";
  import arrayShuffle from "array-shuffle";

  // *** COMPONENTS
  //   import Scroller from "./Scroller.svelte";
  //   import Horz from "./Scroller2.svelte";
  import Tile from "../Components/Tile.svelte";

  // *** STORES
  import { navigationColor } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList, pageList } from "../globals.js";
  import { client, renderBlockText, urlFor } from "../sanity.js";

  // *** PROPS
  export let category = {};
  export let location = {};
  export let slug = "";

  // ** CONSTANTS
  const query =
    '*[_type == "writing" || _type == "participant"  ]{"en_title": en_name, en_title, "ar_title": ar_name, ar_title, "slug": slug.current, mainImage, "category": _type}';

  // ** VARIABLES
  let posts = loadData(query, {});
  let filteredPosts = [];
  let currentCategory = category;

  $: filteredPosts =
    posts && posts.length && category
      ? posts.filter(p => p.category === category)
      : posts;

  navigationColor.set("rfgen-white");

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);
      console.dir(res);
      return arrayShuffle(res.filter(r => r.mainImage));
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    }
  }

  onMount(async () => {
    console.dir(client);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .tile-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: 0;
    padding-bottom: $navigation-bottom-height;
  }
</style>

<div class="tile-view">
  {#await posts then posts}
    {#each posts as post}
      <Tile {post} />
    {/each}
  {/await}
</div>

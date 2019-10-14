<script>
  // # # # # # # # # # # # # #
  //
  //  TileView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";

  // *** COMPONENTS
  //   import Scroller from "./Scroller.svelte";
  //   import Horz from "./Scroller2.svelte";
  import Tile from "../Components/Tile.svelte";

  // *** STORES
  import { navigationColor } from "../stores.js";

  // ** CONSTANTS
  const posts = [
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img1.jpg",
      color: "rfgen-blue"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Working Group",
        arabic: "",
        slug: "xxx"
      },
      image: "img2.jpg",
      color: "rfgen-khaki"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img3.jpg",
      color: "rfgen-red"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img2.jpg",
      color: "rfgen-khaki"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img3.jpg",
      color: "rfgen-red"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img1.jpg",
      color: "rfgen-blue"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img3.jpg",
      color: "rfgen-red"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Working Group",
        arabic: "",
        slug: "xxx"
      },
      image: "img2.jpg",
      color: "rfgen-khaki"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img3.jpg",
      color: "rfgen-red"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img2.jpg",
      color: "rfgen-khaki"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img3.jpg",
      color: "rfgen-red"
    },
    {
      title: {
        english: "Rights of Future Generations: Environment",
        arabic: "",
        slug: "xxx"
      },
      category: {
        english: "Projects",
        arabic: "",
        slug: "xxx"
      },
      image: "img1.jpg",
      color: "rfgen-blue"
    }
  ];

  // *** PROPS
  export let category = {};
  export let location = {};
  export let slug = "";

  // ** CONSTANTS

  // ** VARIABLES

  navigationColor.set("rfgen-white");

  onMount(async () => {});
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
  {#each posts as post}
    <Tile {post} />
  {/each}
</div>

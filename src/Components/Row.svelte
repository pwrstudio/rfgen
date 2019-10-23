<script>
  // # # # # # # # # # # # # #
  //
  //  Row
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import sample from "lodash/sample";
  import shuffle from "lodash/shuffle";

  // *** COMPONENTS
  import Tile from "../Components/Tile.svelte";
  import IntroTile from "../Components/IntroTile.svelte";
  import BreakOff from "../Components/BreakOff.svelte";

  // *** PROPS
  export let row = [];
  export let order = 0;
  export let location = {};

  // *** CONSTANTS
  // const layouts = [
  //   [40, 25, 35],
  //   [33, 33, 33],
  //   [40, 30, 30],
  //   [25, 25, 50],
  //   [30, 35, 35]
  // ];

  const layouts = [
    [30, 30, 20, 20],
    [25, 25, 25, 25],
    [20, 40, 20, 20],
    [25, 30, 20, 25],
    [20, 25, 20, 35]
  ];

  // *** VARIABLES
  let tileWidths = [];

  tileWidths = row.length === 4 ? shuffle(sample(layouts)) : [25, 30, 20, 25];

  // console.dir(row);
</script>

<style lang="scss">
  @import "../variables.scss";
  .row {
    display: inline-block;
    flex-wrap: wrap;
    margin-bottom: 2px;
    width: 100vw;

    @include screen-size("small") {
      scroll-snap-type: y mandatory;
    }
  }
</style>

<div class="row">
  <!-- {#if order % 3 === 0}
    <!-- <BreakOff /> -->
  <!-- {:else} -->

  {#each row as post, i (post.slug)}
    {#if post.category === 'categoryIntroduction'}
      <IntroTile {post} width={tileWidths[i]} order={i} />
    {:else}
      <Tile {post} width={tileWidths[i]} order={i} />
    {/if}
  {/each}
  <!-- {/if} -->

</div>

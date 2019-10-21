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
  const layouts = [
    [40, 25, 35],
    [33, 33, 33],
    [40, 30, 30],
    [25, 25, 50],
    [30, 35, 35]
  ];

  // *** VARIABLES
  let tileWidths = [];

  tileWidths = row.length === 3 ? shuffle(sample(layouts)) : [33, 33, 33];
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
    {#if post.type === 'introduction'}
      <IntroTile {post} width={tileWidths[i]} order={i} />
    {:else}
      <Tile {post} width={tileWidths[i]} order={i} />
    {/if}
  {/each}
  <!-- {/if} -->

</div>

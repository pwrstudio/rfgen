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

  // *** PROPS
  export let row = [];
  export let location = {};

  const layouts = [
    [20, 20, 20, 20, 20],
    [25, 25, 20, 15, 15],
    [30, 20, 20, 15, 15],
    [15, 15, 15, 20, 35]
  ];

  const defaultLayout = layouts[0];

  const tileWidths =
    row.length === 5 ? shuffle(sample(layouts)) : defaultLayout;
</script>

<style lang="scss">
  @import "../variables.scss";
  .row {
    display: inline-block;
    width: 100vw;
  }
</style>

<div class="row">
  {#each row as post, i (post.slug)}
    {#if post.category === 'categoryIntroduction'}
      <IntroTile {post} width={tileWidths[i]} />
    {:else}
      <Tile {post} width={tileWidths[i]} order={i} />
    {/if}
  {/each}
</div>

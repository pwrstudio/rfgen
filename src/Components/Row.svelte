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

  const layouts = [
    [20, 20, 20, 20, 20],
    [25, 25, 20, 15, 15],
    [20, 20, 20, 15, 25],
    [30, 20, 20, 15, 15],
    [15, 15, 15, 20, 35],
    [15, 15, 15, 15, 40]
  ];

  const introRowLayouts = [[15, 15, 20, 20], [15, 15, 15, 25]];

  const hasIntroText = row => {
    return row.find(p => p.category === "categoryIntroduction");
  };

  const defaultLayout = layouts[0];

  const tileWidths =
    row.length === 5 ? shuffle(sample(layouts)) : defaultLayout;

  const introRowTileWidths = shuffle(sample(introRowLayouts));
</script>

<style lang="scss">
  @import "../variables.scss";
  .row {
    display: inline-block;
    width: 100vw;
  }
</style>

<div class="row">
  {#if hasIntroText(row)}
    {#each row as post, i (post.slug)}
      {#if post.category === 'categoryIntroduction'}
        <IntroTile {post} />
      {:else}
        <Tile {post} width={introRowTileWidths[i - 1]} order={i} />
      {/if}
    {/each}
  {:else}
    {#each row as post, i (post.slug)}
      <Tile {post} width={tileWidths[i]} order={i} />
    {/each}
  {/if}
</div>

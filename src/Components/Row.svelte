<script>
  // # # # # # # # # # # # # #
  //
  //  Row
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import random from "lodash/random";
  import shuffle from "lodash/shuffle";

  // *** COMPONENTS
  import Tile from "../Components/Tile.svelte";
  // *** PROPS
  export let row = [];
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

  const pickRandomLayout = () => layouts[random(0, 4)];

  // onMount(async () => {
  tileWidths = row.length === 3 ? shuffle(pickRandomLayout()) : [33, 33, 33];
  // });
</script>

<style lang="scss">
  @import "../variables.scss";

  .row {
    // width: 100vw;
    // display: inline-block;
    // margin-top: $navigation-top-height;
    // line-height: 0;
    // padding-bottom: $navigation-bottom-height;
  }
</style>

<div class="row">
  {#each row as post, i (post.slug)}
    <Tile {post} width={tileWidths[i]} />
  {/each}
</div>

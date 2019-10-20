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

  // onMount(async () => {
  tileWidths = row.length === 3 ? shuffle(sample(layouts)) : [33, 33, 33];
  // });
</script>

<div class="row">
  {#each row as post, i (post.slug)}
    <Tile {post} width={tileWidths[i]} />
  {/each}
</div>

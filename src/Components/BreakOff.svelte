<script>
  // # # # # # # # # # # # # #
  //
  //  Tile
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { Router, Link, links, navigate } from "svelte-routing";
  import imagesLoaded from "imagesloaded";
  import kebabCase from "lodash/kebabCase";

  // *** STORES
  import { isArabic, isEnglish, languagePrefix } from "../stores.js";

  // *** GLOBALS
  import { categoryList } from "../globals.js";
  import { urlFor } from "../sanity.js";

  // *** PROPS
  export let post = {};
  export let width = 20;
  export let order = 1;

  // *** DOM REFERENCES
  let tileEl = {};

  // ** VARIABLES
  let color = "";
  let loaded = false;
  let linkOutActive = false;
</script>

<style lang="scss">
  @import "../variables.scss";

  $tile-height: 400px;
  $tile-bar-height: 40px;

  .break-off {
    background: red;
    width: 100%;
    height: 600px;
    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
</style>

<Router>

  <div class="break-off">
    <img src="/img/sat_101.jpg" />
  </div>

</Router>

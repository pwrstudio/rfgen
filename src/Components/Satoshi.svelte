<script>
  // # # # # # # # # # # # # #
  //
  //  Satoshi Fujiwara composition
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import imagesLoaded from "imagesloaded";
  // _lodash
  import sample from "lodash/sample";

  // *** GLOBALS
  import { loadRandomSatoshi, urlFor } from "../sanity.js";

  // *** DOM REFERENCES
  let satoshiEl = {};

  // *** CONSTANTS
  const query = '*[_type == "satoshi"]{mainImage}';

  // ** VARIABLES
  let loaded = false;
  let post = loadRandomSatoshi(query, {});

  const objectPosition = ["align-top", "align-bottom", "align-center"];

  // *** ON MOUNT
  onMount(async () => {
    imagesLoaded(satoshiEl, instance => {
      loaded = true;
    });
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .satoshi-container {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.5s $easing;

      &.align-top {
        object-position: top;
      }

      &.align-center {
        object-position: center;
      }

      &.align-bottom {
        object-position: bottom;
      }

      &.loaded {
        opacity: 1;
      }
    }
  }
</style>

{#await post then post}
  <div class="satoshi-container" bind:this={satoshiEl}>
    <img
      src={urlFor(post.mainImage)
        .height(1400)
        .quality(90)
        .auto('format')
        .url()}
      class="satoshi-image {sample(objectPosition)}"
      class:loaded
      alt="Satoshi Fujiwara" />
  </div>
{/await}

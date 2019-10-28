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
  let horizontal = false;
  export let tiled = false;

  let orientation = "vertical";
  let imageHeight = "height-100";
  let imageWidth = "width-100";
  let imagePosition = "position-right";

  const orientationsList = ["vertical", "horizontal"];
  const imageHeightsList = ["height-100"];
  const imageWidthsList = ["width-100", "width-75", "width-50", "width-35"];
  const imageHorizontalPositionsList = [
    "position-left",
    "position-right",
    "position-center"
  ];
  const imageVerticalPositionsList = ["position-top", "position-bottom"];

  const randomizeLayout = () => {
    orientation = sample(orientationsList);
    if (orientation === "vertical") {
      imageHeight = "height-100";
      imageWidth = sample(imageWidthsList);
      imagePosition = sample(imageHorizontalPositionsList);
    } else {
      imageWidth = "width-100";
      imageHeight = sample(imageHeightsList);
      imagePosition = sample(imageVerticalPositionsList);
    }
  };

  // *** CONSTANTS
  const query = '*[_type == "satoshi"]{mainImage}';

  // ** VARIABLES
  let loaded = false;
  let post = loadRandomSatoshi(query, {});

  // if (tiled) randomizeLayout();

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

    position: relative;

    // background-image: url("/img/tri.svg");
    // background-size: 26px;
    // background-repeat: repeat;

    img {
      object-fit: cover;
      opacity: 0;
      position: absolute;

      &.width-100 {
        width: 100%;
      }
      &.width-75 {
        width: calc(100% - 156px);
      }
      &.width-50 {
        width: calc(100% - 312px);
      }
      &.width-35 {
        width: calc(100% - 624px);
      }

      &.height-100 {
        height: 100%;
      }
      // &.height-75 {
      //   height: calc(100% - 78px);
      // }
      // &.height-50 {
      //   height: calc(100% - 156px);
      // }

      &.position-right {
        right: 0;
      }

      &.position-left {
        left: 0;
      }

      &.position-top {
        top: 0;
      }

      &.position-bottom {
        bottom: 0;
      }

      &.loaded {
        opacity: 1;
      }
    }

    &.tiled {
      border-bottom: 2px solid $rfgen-white;
    }
  }
</style>

{#await post then post}
  <div class="satoshi-container" class:tiled bind:this={satoshiEl}>
    <img
      src={tiled ? urlFor(post.mainImage)
            .width(1400)
            .height(440)
            .quality(90)
            .auto('format')
            .url() : urlFor(post.mainImage)
            .height(1400)
            .width(1000)
            .quality(90)
            .auto('format')
            .url()}
      class="satoshi-image {imageHeight}
      {imageWidth}
      {imagePosition}"
      class:loaded
      alt="Satoshi Fujiwara" />
  </div>
{/await}

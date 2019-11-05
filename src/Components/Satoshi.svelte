<script>
  // # # # # # # # # # # # # # # #
  //
  //  Satoshi Fujiwara composition
  //
  // # # # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  // _lodash
  import sample from "lodash/sample";
  import get from "lodash/get";

  // *** GLOBALS
  import { urlFor } from "../sanity.js";

  // *** STORES
  import { satoshiList } from "../stores.js";

  // *** DOM REFERENCES
  let satoshiEl = {};

  // *** PROPS
  export let tiled = false;
  export let satoshiIndex = 0;

  let orientation = "vertical";
  let imageHeight = "height-100";
  let imageWidth = "width-100";
  let imagePosition = "position-right";
  let inView = false;

  let imageObject = {};

  $: {
    imageObject = get($satoshiList[satoshiIndex], "mainImage", {});
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          inView = true;
          observer.disconnect();
        }
      });
    },
    { threshold: 0.05 }
  );

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

  // ** VARIABLES
  let loaded = false;

  onMount(async () => {
    observer.observe(satoshiEl);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .satoshi-container {
    width: 100%;
    height: 100%;

    position: relative;

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

<div class="satoshi-container" class:tiled bind:this={satoshiEl}>
  {#if inView}
    <img
      src={tiled ? urlFor(imageObject)
            .width(1400)
            .height(440)
            .quality(90)
            .auto('format')
            .url() : urlFor(imageObject)
            .height(1400)
            .width(1000)
            .quality(90)
            .auto('format')
            .url()}
      on:load={() => (loaded = true)}
      class="satoshi-image {imageHeight}
      {imageWidth}
      {imagePosition}"
      class:loaded
      alt="Satoshi Fujiwara" />
  {/if}

</div>

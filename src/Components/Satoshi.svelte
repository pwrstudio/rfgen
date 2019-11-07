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
  import random from "lodash/random";

  import get from "lodash/get";

  // *** GLOBALS
  import { urlFor } from "../sanity.js";
  import { colorList } from "../globals.js";

  // *** STORES
  import { satoshiList } from "../stores.js";

  // *** DOM REFERENCES
  let satoshiEl = {};

  // *** PROPS
  export let tiled = false;
  export let satoshiIndex = 0;

  // *** CONSTANTS
  const showWatermark = sample([false, true]);
  const showStripe = sample([false, false, true]);

  // *** VARIABLES
  let inView = false;
  let imageObject = {};
  let loaded = false;
  let watermarkLoaded = showWatermark ? false : true;

  $: {
    imageObject = get($satoshiList[satoshiIndex], "mainImage", {});
  }

  const watermark = sample([
    "/img/watermarks/1.png",
    "/img/watermarks/2.png",
    "/img/watermarks/3.png",
    "/img/watermarks/4.png"
  ]);

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

  onMount(async () => {
    observer.observe(satoshiEl);
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .satoshi-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.05);

    position: relative;

    .satoshi-image {
      object-fit: cover;
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      transition: opacity 0.25s ease-out;

      &.loaded {
        opacity: 1;
      }
    }

    .watermark {
      position: absolute;
      z-index: 10;
      height: 1000px;
      mix-blend-mode: multiply;
      opacity: 0;
      transform-origin: center;
      transition: opacity 0.25s ease-out;
      max-width: 100vw;

      &.loaded {
        opacity: 1;
      }
    }

    &.tiled {
      border-bottom: 2px solid $rfgen-white;
    }
  }

  .stripe {
    position: absolute;
    z-index: 9;
    width: 100%;
    opacity: 0;
    left: 0;
    transition: opacity 0.25s ease-out;

    &.loaded {
      opacity: 1;
    }
  }
</style>

<div class="satoshi-container" class:tiled bind:this={satoshiEl}>
  {#if inView}
    {#if !tiled && showStripe}
      <div
        class="stripe {sample(colorList)}"
        style="top:{random(0, 90)}%;height:{random(40, 240)}px;"
        class:loaded={loaded && watermarkLoaded} />
    {/if}
    {#if showWatermark}
      <img
        src={watermark}
        class="watermark"
        alt="Rights of Future Generations"
        style="top:{random(-30, 30)}%;left:{random(-40, 50)}%;max-height:{random(700, 1100)}px;
        transform:rotate({random(-10, 10)}deg);"
        on:load={() => (watermarkLoaded = true)}
        class:loaded={loaded && watermarkLoaded} />
    {/if}
    <img
      src={tiled ? urlFor(imageObject)
            .width(1400)
            .height(440)
            .quality(70)
            .auto('format')
            .url() : urlFor(imageObject)
            .height(1400)
            .width(1000)
            .quality(80)
            .auto('format')
            .url()}
      on:load={() => (loaded = true)}
      class="satoshi-image"
      class:loaded={loaded && watermarkLoaded}
      alt="Satoshi Fujiwara" />
  {/if}

</div>

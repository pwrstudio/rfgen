<script>
  // # # # # # # # # # # # # #
  //
  //  Video
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { urlFor } from "../sanity.js";

  // *** PROPS
  export let url = "";
  export let posterImage = "";

  // *** VARIABLES
  const id = url.match(/([0-9])\w+/g)[0];
  let playing = false;
</script>

<style lang="scss">
  @import "../variables.scss";

  .poster {
    width: 80vw;
    height: 0.5625 * 80vw;
    object-fit: contain;
  }

  iframe {
    max-width: 90%;
    max-height: 90%;
  }

  img {
    width: 1920px;
    height: 1080px;
    max-width: 80%;
    max-height: 90%;
    object-fit: cover;
    cursor: pointer;
  }

  .play {
    position: absolute;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: white;
    pointer-events: none;
  }
</style>

{#if !playing}
  <img
    class="poster"
    src={urlFor(posterImage)
      .quality(80)
      .height(1080)
      .width(1920)
      .auto('format')
      .url()}
    alt=""
    width="1280"
    height="720"
    on:click={() => (playing = true)}
    class:visible={!playing} />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="0.2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-play play">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
{:else}
  <iframe
    class:visible={playing}
    src="https://player.vimeo.com/video/{id}?autoplay=1"
    width="1280"
    height="720"
    title="rfgen"
    frameborder="0"
    byline="false"
    color="#ffffff"
    allow="autoplay; fullscreen"
    allowfullscreen />
{/if}

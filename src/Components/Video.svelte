<script>
  // # # # # # # # # # # # # #
  //
  //  Video
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import Player from "@vimeo/player";
  import { urlFor } from "../sanity.js";

  // import { fade, fly } from "svelte/transition";

  // *** PROPS
  export let url = "";
  export let posterImage = "";

  // *** VARIABLES
  let id = url.match(/([0-9])\w+/g)[0];
  let player = undefined;
  let vimeoData = undefined;
  let playing = false;
  let playerProgress = undefined;

  async function vimeoJson(id) {
    try {
      let uri = `https://vimeo.com/api/v2/video/${id}.json`;
      const res = await fetch(uri);
      const json = await res.json();
      return json[0];
    } catch (err) {
      console.error(err);
    }
  }

  // *** FUNCTIONS
  async function initPlayer() {
    await tick();
    player = new Player(`v${id}`, {
      url: url,
      frameborder: 0,
      color: "#ffffff",
      background: true,
      allow: ["autoplay", "fullscreen"]
    });
  }

  const initVideo = () => {
    // console.log(vimeoData);
    playing = true;

    initPlayer().then(res => {
      player.play();
      player.on("progress", function(data) {
        playerProgress = data;
      });
    });
  };

  const playVideo = () => {
    player.play();
    playing = true;
  };

  const showVideo = () => {};

  const pauseVideo = () => {
    player.pause();
    playing = false;
  };

  const toggleVideo = () => (playing ? pauseVideo() : playVideo());

  const seekPlayer = event => {
    // console.log(event.offsetX, event.target.clientWidth, vimeoData.duration);
    let to = (event.offsetX / event.target.clientWidth) * vimeoData.duration;
    player.setCurrentTime(to);
  };

  onMount(() => {
    // console.log(url);
    // console.log(id);
    // Gets the vimeo ID using a regex on number groups
    // Get the vimeo oEmbed data and initiate
    // vimeoJson(id).then(res => {
    //   console.log(vimeoData);
    //   vimeoData = res;
    //   initPlayer();
    // });
  });
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
      .quality(90)
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
    stroke-width="0.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-play play">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
{:else}
  <!-- <div class="video" id={`v${id}`} class:visible={playing}> -->
  <iframe
    class:visible={playing}
    src="https://player.vimeo.com/video/{id}"
    width="1280"
    height="720"
    title="rfgen"
    frameborder="0"
    byline="false"
    color="#ffffff"
    allow="autoplay; fullscreen"
    allowfullscreen />
  <!-- </div> -->
{/if}

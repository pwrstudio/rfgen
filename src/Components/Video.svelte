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

// import { fade, fly } from "svelte/transition";

// *** PROPS
export let url = undefined;

// *** VARIABLES
let id = undefined;
let thumbnail = undefined;
let vimeoData = undefined;
let playing = false

async function vimeoJson (id) {
  try {
    let uri = `https://vimeo.com/api/v2/video/${id}.json`;
    const res = await fetch(uri);

    const json = await res.json();

    return json[0]

  } catch (err) {
    console.error(err)
  }
}

// *** FUNCTIONS
async function initPlayer() {
  await tick()
  url = new Player(`v${id}`, {
    url: url
  })
}

const playVideo = () => {
  console.log(vimeoData)
  playing = true;

  initPlayer()
}

onMount(() => {
  // Gets the vimeo ID using a regex on number groups
  id = url.match(/([0-9])\w+/g)[0]

  // Get the vimeo oEmbed data and initiate
  vimeoJson(id).then(res => {
    vimeoData = res
  })
})
</script>

<style lang="scss">
  @import "../variables.scss";

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover; /* or contain? */
  }

</style>

{#if vimeoData !== undefined}
  {#if !playing}
    <img src={vimeoData.thumbnail_large} alt={vimeoData.title} class="thumbnail" on:click={playVideo} />
  {:else}
    <div class="video" id={`v${id}`}></div>
  {/if}
{/if}

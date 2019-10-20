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
let player = undefined;
let thumbnail = undefined;
let vimeoData = undefined;
let playing = false;
let playerProgress = undefined;

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
  player = new Player(`v${id}`, {
    url: url,
    frameborder: 0,
    color: '#ffffff',
    background: true,
    allow: ['autoplay', 'fullscreen']
  })
}

const initVideo = () => {
  console.log(vimeoData)
  playing = true;

  initPlayer().then(res => {
      player.play()
      player.on('progress', function(data) {
        playerProgress = data
      })
    })
}

const playVideo = () => {
  player.play();
}

const pauseVideo = () => {
  player.pause();
}

const seekPlayer = (event) => {
  console.log(event.offsetX, event.target.clientWidth, vimeoData.duration)
  let to = (event.offsetX / event.target.clientWidth) * vimeoData.duration
  player.setCurrentTime(to)
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

  .video-controls {
    width: 100%;

    &.progress {
      display: block;
      width: 100%;
      height: 4px;
      background: #000;
    }
  }

  .progress {
    &.inner {
      height: 4px;
      display: block;
      background: #fff;
    }
  }

</style>

{#if vimeoData !== undefined}
  {#if !playing}
    <img src={vimeoData.thumbnail_large} alt={vimeoData.title} class="thumbnail" on:click={initVideo} />
  {:else}
    <div class="video" id={`v${id}`}>
      <div class="video-controls">
        {#if player !== undefined}
          <button on:click={playVideo}>Play</button>
          <button on:click={pauseVideo}>Pause</button>
          {#if playerProgress !== undefined}
            <div class="video-controls progress" on:click={seekPlayer}>
              <div class="progress inner" style={`width:${playerProgress.percent * 100}%;`}></div>
            </div>
            {playerProgress.percent}
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{/if}

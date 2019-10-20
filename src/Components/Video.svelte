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
let aspectRatio = undefined;
let initiated = false;
let playerProgress = undefined;
let playerWidth = undefined;
let playerHeight = undefined;
let playing = false;

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
  // Wait for the DOM to update
  await tick()
  aspectRatio = vimeoData.width / vimeoData.height
  player = new Player(`v${id}`, {
    url: url,
    frameborder: 0,
    background: true,
    responsive: true,
    allow: ['autoplay', 'fullscreen']
  })

  player.ready().then(function() {
    getPlayerDimensions()
  });
}

const getPlayerDimensions = () => {
  playerWidth = player._originalElement.firstChild.clientWidth
  playerHeight = player._originalElement.firstChild.clientHeight
}

const initVideo = () => {
  console.log(vimeoData)
  initiated = true;

  initPlayer().then(res => {
      playVideo()
      player.on('progress', function(data) {
        playerProgress = data;
      })
      player.on('seeking', function(data) {
        console.log('seeking', data);
      })
      player.on('seeked', function(data) {
        console.log('seeked', data);
      });
    })
}

const playVideo = () => {
  player.play();
  playing = true
}

const pauseVideo = () => {
  player.pause();
  playing = false
}

const seekPlayer = (event) => {
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

  .thumbnail-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
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
      transition: width 0.1s ease;
      height: 4px;
      display: block;
      background: #fff;
    }
  }

  .video-overlay {
    position: relative;
    width: 100%;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    .button {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

</style>

{#if !!vimeoData}
  {#if !initiated}
    <img src={vimeoData.thumbnail_large} alt={vimeoData.title} class="thumbnail" />
    <img class="thumbnail-overlay" src="/svg/play.svg" on:click={initVideo} />
  {:else}
    <div class="video" id={`v${id}`}></div>
  {/if}

  {#if !!player}
    <div class="video-overlay" style={`width:${playerWidth}px;height:${playerHeight}px;margin-top:${-playerHeight}px`}>
      {#if playing}
        <img class="button" src="/svg/pause.svg" on:click={pauseVideo} />
      {:else}
        <img class="button" src="/svg/play.svg" on:click={playVideo} />
      {/if}
    </div>
    <div class="video-controls">
      {#if !!playerProgress}
        <div class="video-controls progress" on:click={seekPlayer}>
          <div class="progress inner" style={`width:${playerProgress.percent * 100}%;`}></div>
        </div>
      {/if}
    </div>
  {/if}
{/if}

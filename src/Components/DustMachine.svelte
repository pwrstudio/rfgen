<script>
  // # # # # # # # # # # # # #
  //
  // Dust Machine
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount } from "svelte";
  import throttle from "lodash/throttle";
  import sample from "lodash/sample";
  import poissonProcess from "poisson-process";

  // *** GLOBALS
  import { dustList } from "../globals.js";

  const DELAY = 10;
  const INTERVAL = 2500;

  // *** VARIABLES
  let counter = 0;
  let dustMachineContainer = {};

  const hit = () => {
    let newMote = document.createElement("img");
    newMote.src = "/img/dust/" + sample(dustList);
    newMote.classList = "mote";
    newMote.style.top = Math.floor(Math.random() * window.innerHeight) + "px";
    newMote.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
    dustMachineContainer.appendChild(newMote);
  };

  const pp = poissonProcess.create(INTERVAL, hit);

  const startCountdown = delay =>
    window.setInterval(() => {
      if (counter === delay) {
        pp.start();
      }
      counter += 1;
    }, 1000);

  const handleMouseMove = () => {
    counter = 0;
    dustMachineContainer.innerHTML = "";
    pp.stop();
  };

  onMount(async () => {
    startCountdown(DELAY);
  });
</script>

<style lang="scss">
  .dust-machine-container {
    z-index: 100000;
    display: block;
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>

<svelte:window on:mousemove={throttle(handleMouseMove, 200)} />

<section class="dust-machine-container" bind:this={dustMachineContainer} />

<script>
  // # # # # # # # # # # # # #
  //
  //  PageView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";

  // *** COMPONENTS
  //   import Scroller from "./Scroller.svelte";
  //   import Horz from "./Scroller2.svelte";
  import Tile from "../Components/Tile.svelte";

  // *** STORES
  import { isArabic, isEnglish, navigationColor } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, categoryList, pageList } from "../globals.js";

  // *** PROPS
  export let slug = {};
  export let post = {
    title: "xx",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam nulla porttitor massa id neque. Ullamcorper morbi tincidunt ornare massa. Nunc non blandit massa enim nec dui nunc mattis. Ac tincidunt vitae semper quis. Sit amet est placerat in egestas erat imperdiet sed euismod. Quis enim lobortis scelerisque fermentum dui faucibus in ornare quam. Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat. At quis risus sed vulputate odio ut enim blandit volutpat. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Nunc aliquet bibendum enim facilisis gravida neque convallis a. Vitae turpis massa sed elementum tempus. Senectus et netus et malesuada. Diam in arcu cursus euismod quis viverra nibh cras. Leo duis ut diam quam nulla porttitor. Sit amet nisl purus in mollis nunc. Aenean euismod elementum nisi quis. Felis eget velit aliquet sagittis id consectetur purus ut faucibus. Tristique nulla aliquet enim tortor at. Lectus nulla at volutpat diam ut venenatis tellus in metus. Nibh cras pulvinar mattis nunc sed blandit. Risus ultricies tristique nulla aliquet enim tortor at auctor urna. Eu scelerisque felis imperdiet proin fermentum. Ultrices mi tempus imperdiet nulla malesuada pellentesque. Id diam vel quam elementum pulvinar etiam non.Tincidunt eget nullam non nisi est sit. Tempor commodo ullamcorper a lacus vestibulum sed arcu non. Viverra mauris in aliquam sem fringilla. Viverra vitae congue eu consequat ac felis. Nunc consequat interdum varius sit amet mattis vulputate enim. Nec ultrices dui sapien eget mi proin sed libero. Eget mi proin sed libero enim sed. Viverra ipsum nunc aliquet bibendum enim facilisis. Vel facilisis volutpat est velit egestas dui. Risus feugiat in ante metus.Aliquam id diam maecenas ultricies mi eget mauris pharetra. Pulvinar elementum integer enim neque. Augue ut lectus arcu bibendum at varius. Quis eleifend quam adipiscing vitae. Urna porttitor rhoncus dolor purus non enim praesent. Sed adipiscing diam donec adipiscing tristique risus nec feugiat in. Accumsan tortor posuere ac ut. Egestas pretium aenean pharetra magna ac placerat vestibulum. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Tincidunt dui ut ornare lectus sit amet est placerat in. Ultrices in iaculis nunc sed augue lacus viverra. Quis ipsum suspendisse ultrices gravida dictum fusce ut. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Lectus sit amet est placerat in egestas erat imperdiet sed. Metus dictum at tempor commodo ullamcorper. Volutpat lacus laoreet non curabitur. Elementum tempus egestas sed sed risus pretium quam vulputate dignissim. Amet facilisis magna etiam tempor orci eu lobortis. Risus commodo viverra maecenas accumsan lacus vel.Sapien pellentesque habitant morbi tristique. Faucibus in ornare quam viverra orci. Quam quisque id diam vel quam. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Erat nam at lectus urna duis convallis convallis tellus. Ac tincidunt vitae semper quis lectus nulla. Eu scelerisque felis imperdiet proin fermentum leo vel orci. Sed vulputate odio ut enim blandit volutpat maecenas. Neque egestas congue quisque egestas diam in arcu. Et netus et malesuada fames. Id venenatis a condimentum vitae sapien pellentesque habitant. Tempor commodo ullamcorper a lacus vestibulum sed arcu non. Enim nec dui nunc mattis enim ut tellus elementum. Amet nulla facilisi morbi tempus iaculis. Pellentesque eu tincidunt tortor aliquam nulla facilisi. Non diam phasellus vestibulum lorem sed. Odio facilisis mauris sit amet massa. Orci eu lobortis elementum nibh tellus."
  };
  export let location = {};

  // ** CONSTANTS

  // ** VARIABLES

  //   $isSinglePage.set(true);

  navigationColor.set("rfgen-grey");

  onMount(async () => {
    console.log("pageview loaded");
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .page-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;
  }

  .page-view-text {
    width: 50%;
    padding-left: $rfgen-grid-unit;
    padding-top: 2 * $rfgen-grid-unit;
  }

  .page-view-image {
    width: 50%;
  }
</style>

<svelte:head>
  <title>{post.title} / {siteInfo.title.english}</title>
</svelte:head>

<div class="page-view">

  <div class="page-view-text">
    {slug}
    <br />
    {post.content}
  </div>
  <div class="page-view-image">
    <img src="/img/img1.jpg" />
  </div>
</div>

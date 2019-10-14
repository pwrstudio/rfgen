<script>
  // # # # # # # # # # # # # #
  //
  //  PostView
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
  export let category = {};
  export let post = {
    title: "POST",
    category: "projects",
    content:
      "Netus et malesuada fames ac. Accumsan lacus vel facilisis volutpat est. Mi sit amet mauris commodo quis imperdiet. Arcu cursus vitae congue mauris rhoncus. Rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Tellus id interdum velit laoreet id donec ultrices. Odio tempor orci dapibus ultrices in. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam. Quam lacus suspendisse faucibus interdum posuere lorem ipsum. Cursus metus aliquam eleifend mi. Elementum sagittis vitae et leo duis. Sit amet justo donec enim diam. Tortor at auctor urna nunc id cursus metus aliquam eleifend. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant morbi. Tempus iaculis urna id volutpat lacus. Mollis aliquam ut porttitor leo a. Morbi tristique senectus et netus et malesuada. Dui accumsan sit amet nulla. Leo duis ut diam quam nulla porttitor massa id. Pulvinar mattis nunc sed blandit libero volutpat sed cras ornare. Laoreet id donec ultrices tincidunt arcu non sodales neque. Sed cras ornare arcu dui vivamus. Id velit ut tortor pretium viverra suspendisse potenti. Nibh praesent tristique magna sit amet purus gravida quis blandit. Dui nunc mattis enim ut tellus elementum sagittis vitae. In hac habitasse platea dictumst vestibulum rhoncus. Tristique risus nec feugiat in fermentum posuere urna nec tincidunt. Neque egestas congue quisque egestas diam in arcu cursus euismod. Ut aliquam purus sit amet. Pulvinar neque laoreet suspendisse interdum consectetur libero id. Tincidunt praesent semper feugiat nibh. Commodo sed egestas egestas fringilla. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Pellentesque eu tincidunt tortor aliquam nulla facilisi. Gravida rutrum quisque non tellus. Mattis vulputate enim nulla aliquet porttitor lacus. Bibendum at varius vel pharetra vel. Libero id faucibus nisl tincidunt eget nullam non nisi est. Cursus risus at ultrices mi. Posuere morbi leo urna molestie at elementum. Pharetra magna ac placerat vestibulum lectus. Sagittis eu volutpat odio facilisis mauris sit amet massa. Urna id volutpat lacus laoreet non. Facilisis mauris sit amet massa vitae tortor condimentum lacinia quis."
  };
  export let location = {};

  // ** CONSTANTS

  // ** VARIABLES<

  //   navigationColor.set(category);

  onMount(async () => {
    console.log(slug);
    console.log(category);
    console.log("postview loaded");
  });
</script>

<style lang="scss">
  @import "../variables.scss";

  .post-view {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;
  }

  .post-view-text {
    width: 50%;
    padding-left: $rfgen-grid-unit;
    padding-top: 2 * $rfgen-grid-unit;
  }

  .post-view-image {
    width: 50%;
  }
</style>

<svelte:head>
  <title>{post.title} / {siteInfo.title.english}</title>
</svelte:head>

<div class="post-view">

  <div class="post-view-text">
    {slug} / {category}
    <br />
    {post.content}
  </div>
  <div class="post-view-image">
    <img src="/img/img1.jpg" />
  </div>
</div>

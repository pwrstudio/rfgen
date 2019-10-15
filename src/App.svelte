<script>
  // # # # # # # # # # # # # #
  //
  //  App
  //
  // # # # # # # # # # # # # #

  // *** POLYFILLS
  // import "intersection-observer";
  // import "whatwg-fetch";

  // import "es6-shim";

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, Link, Route } from "svelte-routing";

  // *** COMPONENTS
  import Navigation from "./Components/Navigation.svelte";

  // *** ROUTES
  import TileView from "./Views/TileView.svelte";
  import PageView from "./Views/PageView.svelte";
  import PostView from "./Views/PostView.svelte";
  import Error404 from "./Views/Error404.svelte";

  // *** STORES
  import { language, isArabic, isEnglish } from "./stores.js";

  // ** CONSTANTS

  // ** VARIABLES

  // ** FUNCTIONS

  onMount(async () => {});
</script>

<style lang="scss" global>
  @import "./variables.scss";

  body,
  html {
    background: $rfgen-white;
    color: $rfgen-black;
    font-family: $font-stack;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: $rfgen-font-size-large;
    line-height: 1em;
    margin: 0;
    overflow-x: hidden;
    padding: 0;
    // scroll-behavior: smooth;
    text-align: left;

    &.no-scroll {
      overflow: hidden;
    }

    @include screen-size("small") {
      font-size: $rfgen-font-size-mobile-large;
    }
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  a,
  a:visited,
  a:active {
    text-decoration: none;
    color: currentColor;
  }

  p {
    margin-top: 0;
  }

  ::selection {
    background: #e4e4e4;
  }

  ::-moz-selection {
    background: #e4e4e4;
    /* Gecko Browsers */
  }

  strong {
    font-weight: normal;
  }

  .page-view {
    a {
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .app {
    &.arabic {
      direction: rtl;
      text-align: right;
    }
  }
</style>

<div class="app" class:arabic={$isArabic}>

  <Navigation />

  <Router>
    <Route path="/" component={TileView} />
    <Route path="/:category" component={TileView} />
    <Route path="/:category/:slug" component={PostView} />
    <Route path="/page/:slug" component={PageView} />
    <Route component={Error404} title="404" />
  </Router>

</div>

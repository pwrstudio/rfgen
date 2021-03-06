<script>
  // # # # # # # # # # # # # #
  //
  //  RFGEN.NET
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import "intersection-observer"
  import { Router, Route } from "svelte-routing"
  import shuffle from "lodash/shuffle"

  // *** COMPONENTS
  import Navigation from "./Components/Navigation.svelte"
  import DustMachine from "./Components/DustMachine.svelte"

  // *** ROUTES
  import TileView from "./Views/TileView.svelte"
  import PageView from "./Views/PageView.svelte"
  import PostView from "./Views/PostView.svelte"
  import IntroductionView from "./Views/IntroductionView.svelte"
  import ProgrammeView from "./Views/ProgrammeView.svelte"
  import Error404 from "./Views/Error404.svelte"

  // *** GLOBALS
  import { categoryListDefaults, colorList } from "./globals.js"
  import { loadSatoshis } from "./sanity.js"

  // *** STORES
  import {
    globalLanguage,
    languagePrefix,
    categoryList,
    satoshiList,
    isArabic,
    isEnglish,
  } from "./stores.js"

  $: {
    document.documentElement.lang = $languagePrefix
  }

  const query = '*[_type == "satoshi"]{mainImage}'
  const satoshis = loadSatoshis(query, {})
  satoshis.then(sats => {
    satoshiList.set(shuffle(sats))
  })

  // Randomize category colors on each reload
  const shuffledColors = shuffle(colorList)
  categoryList.set(
    categoryListDefaults.map((c, i) => {
      c.color = shuffledColors[i]
      return c
    })
  )
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
    line-height: $unified-line-height;
    margin: 0;
    overflow-x: hidden;
    // overflow-y: hidden;
    padding: 0;
    text-align: left;
    // scroll-behavior: smooth;

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

  strong {
    font-weight: normal;
  }

  .page-view-text-inner strong {
    font-weight: bold;
  }

  .introduction-view-text-inner strong {
    font-weight: bold;
  }

  p {
    a {
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }

  .embed-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 720px;
    width: 100%;
    margin-bottom: 1em;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  .soundcloud-container {
    // height: 300px;
    width: 100%;
    overflow: hidden;
    max-width: 100%;
    margin-bottom: 1em;

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  figure {
    padding: 0;
    margin: 0;
    margin-bottom: 1em;
  }

  .page-view-text-inner {
    img {
      max-width: 100%;
    }
  }

  .mote {
    max-width: 50px;
    max-height: 60px;
    position: fixed;
  }
</style>

<div class="app" class:arabic={$isArabic}>
  <Navigation />

  <Router>
    <Route path="/" component={TileView} />
    <Route path="/:language" component={TileView} />
    <Route path="/:language/programme" component={ProgrammeView} />
    <Route path="/:language/:category" component={TileView} />
    <Route path="/:language/:category/:slug" component={PostView} />
    <Route path="/:language/introduction/:slug" component={IntroductionView} />
    <Route path="/:language/page/:slug" component={PageView} />
    <Route component={Error404} title="404" />
  </Router>

  <DustMachine />
</div>

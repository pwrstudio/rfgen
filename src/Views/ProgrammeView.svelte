<script>
  // # # # # # # # # # # # # #
  //
  //  PostView
  //
  // # # # # # # # # # # # # #

  // *** IMPORT
  import { onMount, onDestroy } from "svelte";
  import { Router, links } from "svelte-routing";
  import imagesLoaded from "imagesloaded";
  import get from "lodash/get";
  import uniq from "lodash/uniq";
  import flattenDeep from "lodash/flattenDeep";
  import kebabCase from "lodash/kebabCase";
  import { fade } from "svelte/transition";
  import format from "date-fns/format";

  // *** COMPONENTS
  import InternalLink from "../Components/InternalLink.svelte";
  import Video from "../Components/Video.svelte";

  // *** STORES
  import {
    isArabic,
    isEnglish,
    navigationColor,
    activeNavigation,
    categoryList,
    languagePrefix,
    globalLanguage
  } from "../stores.js";

  // *** GLOBALS
  import { siteInfo, baseProjections } from "../globals.js";
  import { client, renderBlockText, urlFor } from "../sanity.js";

  // *** PROPS
  export let slug = "";
  export let category = "";
  export let language = "";
  export let location = {};

  // *** DOM REFERENCES
  let imageEl = {};

  // ** VARIABLES
  let headTitle = {
    english: "",
    arabic: ""
  };
  let loaded = true;

  const allProjections = uniq(
    flattenDeep([...baseProjections, ...$categoryList.map(c => c.projections)])
  );

  // ** CONSTANTS
  const query =
    '*[_type == "event"] | order(performanceDate asc) {performanceDate, _id, en_title, ar_title, en_content, ar_content, mainImage, videoLink,  "category": _type, participants[]->{"en_title": en_name, en_title, "ar_title": ar_name, "slug": slug.current, "category": _type}}';

  // const linksQuery = "*[participants[]._ref == $id]{" + allProjections + "}";

  let events = loadData(query, {});

  // $: {
  //   activeNavigation.set(category ? category : "");
  //   navigationColor.set(
  //     $categoryList.find(c => c.categorySlug == kebabCase($activeNavigation))
  //       .color
  //   );
  // }

  // Set globals
  globalLanguage.set(language === "ar" ? "arabic" : "english");
  // navigationColor.set("rfgen-grey");

  async function loadData(query, params) {
    try {
      const res = await client.fetch(query, params);

      console.dir(res);

      // console.dir(res);
      // if (category === "participant") {
      //   client.fetch(linksQuery, { id: get(res, "_id", "") }).then(linksRes => {
      //     // console.dir(linksRes);
      //     links = linksRes;
      //   });
      // } else {
      //   links = get(res, "participants", []);
      // }

      // let postConstruction = {
      //   title: {
      //     english: "",
      //     arabic: ""
      //   },
      //   content: {
      //     english: [],
      //     arabic: []
      //   },
      //   mainImage: false,
      //   slug: ""
      // };

      // postConstruction.id = get(res, "_id", "");
      // postConstruction.title.english = get(res, "en_title", "");
      // postConstruction.title.arabic = get(res, "ar_title", "");
      // postConstruction.content.english = get(res, "en_content", []);
      // postConstruction.content.arabic = get(res, "ar_content", []);
      // postConstruction.mainImage = get(res, "mainImage", false);
      // // postConstruction.videoLink = get(res, "videoLink", false);
      // // postConstruction.programmeerImage = get(res, "posterImage", false);
      // postConstruction.slug = get(res, "slug", "");
      // // postConstruction.category = get(res, "category", "");

      return res;
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    }
  }

  // async function loadLinks(query, params) {}

  // *** ON MOUNT
  onMount(async () => {
    window.scrollTo(0, 0);
    // imagesLoaded(imageEl, instance => {
    //   loaded = true;
    // });
  });
</script>

<style lang="scss">
  @import "../variables.scss";
  @import "../variables.scss";

  .programme {
    display: inline-block;
    margin-top: $navigation-top-height;
    line-height: $rfgen-font-size-large;
    padding-bottom: $navigation-bottom-height;
  }

  .programme-text {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    left: 0;
    padding-top: 2 * $rfgen-grid-unit;
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );
    @include screen-size("small") {
      position: static;
      float: right;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
    }

    overflow-y: auto;
    @include hide-scroll;

    &.arabic {
      left: unset;
      right: 0;
    }
  }

  .programme-calendar {
    position: fixed;
    width: 50vw;
    top: $navigation-top-height;
    right: 0;
    background: rgba(0, 0, 0, 0.05);
    height: calc(
      100vh - #{$navigation-top-height} - #{$navigation-bottom-height}
    );

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    iframe {
      display: block;
      margin-top: 40px;
      margin-left: auto;
      margin-right: auto;
      width: calc(100% - 10px);
    }

    @include screen-size("small") {
      position: static;
      float: left;
      width: 100vw;
      top: unset;
      left: unset;
      height: unset;
    }

    opacity: 0;
    transition: opacity 0.5s $easing;

    &.loaded {
      opacity: 1;
    }

    &.arabic {
      right: unset;
      left: 0;
    }
  }

  .programme-event {
    margin-bottom: 2px;
    padding: $rfgen-grid-unit;
    padding-bottom: 1em;
  }

  a {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  .programme-category {
    text-transform: capitalize;
    margin-bottom: 1em;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    // font-size: $rfgen-font-size-small;
    // line-height: $rfgen-font-size-small;
  }

  .programme-title {
    margin-bottom: 1em;
    font-weight: bold;
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
  }

  .programme-event-title {
    font-weight: bold;
  }

  .programme-text-inner {
    padding-left: $rfgen-grid-unit;
    padding-right: 4 * $rfgen-grid-unit;
    min-height: calc(70vh - 230px);
  }

  .links-container {
    margin-top: 1em;
  }
</style>

<svelte:head>
  {#if $isEnglish}
    <title>Opening Programme / {siteInfo.title.english}</title>
  {/if}
  {#if $isArabic}
    <title>{siteInfo.title.arabic} / Opening Programme</title>
  {/if}
</svelte:head>

<Router>
  <div class="programme">
    {#await events then events}
      <div class="programme-text" class:arabic={$isArabic} in:fade>
        <div class="programme-title">Opening programme</div>
        <div class="programme-text-inner">More text...</div>
      </div>
      <div
        class="programme-calendar"
        class:loaded
        class:arabic={$isArabic}
        use:links>

        {#each events as event}
          <div
            class="programme-event {$categoryList.find(c => c.categorySlug === 'performance').color}">
            <div class="programme-event-date">
              {format(new Date(event.performanceDate), 'MMMM do kk:mm')}
            </div>
            <div class="programme-event-title">
              {#if $isEnglish}{event.en_title}{/if}
              {#if $isArabic}{event.ar_title}{/if}
            </div>
            <div class="programme-event-text">
              {#if $isEnglish && event.en_content}
                {@html renderBlockText(event.en_content)}
              {/if}
              {#if $isArabic && event.ar_content}
                {@html renderBlockText(event.ar_content)}
              {/if}
            </div>
            <div class="programme-event-text" />
            {#each event.participants as participant}
              <a
                href="/{$languagePrefix}/{participant.category}/{participant.slug}">
                {participant.en_title}
              </a>
            {/each}
          </div>
        {/each}
      </div>

    {/await}
  </div>
</Router>

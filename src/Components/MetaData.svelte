<script>
  // # # # # # # # # # # # # #
  //
  //  MetaData
  //
  // # # # # # # # # # # # # #

  // _lodash
  import get from "lodash/get";
  import has from "lodash/has";
  import isArray from "lodash/isArray";
  import isEmpty from "lodash/isEmpty";
  import truncate from "lodash/truncate";

  // *** STORES
  import { isArabic, isEnglish } from "../stores.js";

  import { siteInfo } from "../globals.js";

  import { toPlainText, urlFor } from "../sanity.js";

  // *** PROPS
  export let post = {};

  const title = {
    english:
      (has(post, "title.english") && !isEmpty(post.title.english)
        ? post.title.english + " / "
        : "") +
      get(siteInfo, "title.english", "") +
      " / " +
      get(siteInfo, "satTitle.english", ""),
    arabic:
      (has(post, "title.arabic") && !isEmpty(post.title.arabic)
        ? post.title.arabic + " / "
        : "") +
      get(siteInfo, "title.arabic", "") +
      " / " +
      get(siteInfo, "satTitle.arabic", "")
  };

  const description = {
    english:
      has(post, "content.english") &&
      isArray(post.content.english) &&
      !isEmpty(post.content.english)
        ? truncate(toPlainText(post.content.english), {
            length: 160,
            separator: /.? +/
          })
        : get(siteInfo, "description.english", ""),
    arabic:
      has(post, "content.arabic") &&
      isArray(post.content.arabic) &&
      !isEmpty(post.content.arabic)
        ? truncate(toPlainText(post.content.arabic), {
            length: 160,
            separator: /.? +/
          })
        : get(siteInfo, "description.arabic", "")
  };

  const image = has(post, "mainImage.asset")
    ? urlFor(post.mainImage)
        .quality(80)
        .height(1200)
        .width(1200)
        .auto("format")
        .url()
    : siteInfo.image;
</script>

<svelte:head>
  {#if $isEnglish}
    <title>{title.english}</title>
    <meta property="og:title" content={title.english} />
    <meta property="twitter:title" content={title.english} />
    <meta property="description" content={description.english} />
    <meta property="og:description" content={description.english} />
    <meta property="twitter:description" content={description.english} />
  {/if}
  {#if $isArabic}
    <title>{title.arabic}</title>
    <meta property="og:title" content={title.arabic} />
    <meta property="twitter:title" content={title.arabic} />
    <meta property="description" content={description.arabic} />
    <meta property="og:description" content={description.arabic} />
    <meta property="twitter:description" content={description.arabic} />
  {/if}
  <meta property="image" content={image} />
  <meta property="og:image" content={image} />
  <meta property="twitter:image" content={image} />
</svelte:head>

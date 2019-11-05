<script>
  // # # # # # # # # # # # # #
  //
  //  ERROR 404
  //
  // # # # # # # # # # # # # #

  // *** COMPONENTS
  import MetaData from "../Components/MetaData.svelte";
</script>

<style lang="scss">
  @import "../variables.scss";

  .error-404 {
    width: 100vw;
    display: inline-block;
    line-height: 0;
    margin-top: $navigation-top-height;
    padding-bottom: $navigation-bottom-height;
    min-height: calc(100vh - 120px);
  }
</style>

<MetaData />

<div class="error-404">
  <div>File Not Found (404)</div>
  <a href="/">Go to landing page</a>
</div>

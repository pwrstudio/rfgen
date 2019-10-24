<script>
  // # # # # # # # # # # # # #
  //
  //  Head
  //
  // # # # # # # # # # # # # #

  export let title;

  $: {
    document.title = title;
  }
</script>

<template>

  <div class="home">
    <section class="section" style="padding: 1rem;">
      <Map height="100px" width="200px" />
    </section>
  </div>
  
</template>

<script>

  import Map from '@/components/Map.vue'

  export default {
    name: 'Home',
    components: {
      Map
    },
    mounted () {

    }
  }

</script>

<style>

</style>

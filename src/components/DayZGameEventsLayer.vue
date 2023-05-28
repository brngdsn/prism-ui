<template>
  <div class="dayz-game-events-layer">

  </div>
</template>

<script>

  export default {
    name: 'DayZGameEventsLayer',
    props: {
      logFile: String
    },
    data () {
      return {

      }
    },
    methods: {

    },
    mounted () {
      console.log('layer', this.logFile)
      this.$emit('layer', this.logFile)
    }
  }
  
</script>

<style scoped lang="scss">

</style>

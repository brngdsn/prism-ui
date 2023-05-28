<template>

  <div class="playground">
    <section class="section" style="padding: 1rem;">

      <NitradoService
        v-for="(service, s) in services"
        :key="s"
        :service="service"
        @select="onSelectService"
        @gameserver="onGameserver"
      />

      <b-collapse :open="debug" aria-id="contentIdForA11y1">
          <template #trigger>
            <b-tag type="is-light" aria-controls="contentIdForA11y1">debug</b-tag>
          </template>
          <div class="notification debug-output">
              <div class="content">
                <pre>busy={{busy}}</pre>
                <pre>services={{services}}</pre>
                <pre>gameserver={{gameserver}}</pre>
              </div>
          </div>
      </b-collapse>

    </section>
  </div>
  
</template>

<script>

  import { mapGetters, mapActions } from 'vuex'
  import NitradoService from '@/components/NitradoService'

  export default {
    name: 'Playground',
    components: {
      NitradoService
    },
    computed: {
      ...mapGetters([
        'selectedService'
      ])
    },
    data () {
      return {
        busy: false,
        services: null,
        gameserver: null,
        debug: false
      }
    },
    methods: {
      ...mapActions([
        'selectService'
      ]),
      onSelectService (service) {
        this.selectService({service})
      },
      onGameserver (gameserver) {
        this.gameserver = gameserver
      }
    },
    async mounted () {
      this.busy = true
      this.services = await this.$nitrado.getServices()
      this.busy = false
    }
  }

</script>

<style>
  .debug-output {
    margin-top: 15px;
  }
</style>

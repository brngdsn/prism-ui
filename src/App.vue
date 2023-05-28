<template>

  <div id="app">

    <b-navbar type="is-light">

      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }" style="background-color: #ffddfe; color: white; font-weight: bold;">
          Prism UI
        </b-navbar-item>
      </template>

      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/dayz-types' }">
          Types
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/dayz-spawn-builder' }">
          Spawn Builder
        </b-navbar-item>
        <b-navbar-item v-if="installed" tag="router-link" :to="{ path: '/playground' }">
          Servers
        </b-navbar-item>
        <b-navbar-item v-if="selectedService" tag="router-link" :to="{ path: '/xml-browser' }">
          XML Browser
        </b-navbar-item>
        <b-navbar-item disabled>
            <b-input size="is-small" v-model="nitradoLLT" placeholder="Nitrado LLT" style="margin-right:10px;"></b-input>
            <b-button size="is-small"
              :type="{
                'is-link': true,
                'is-light': true,
                'is-success': installed
              }"
              @click="onClick" :loading="busy" style="margin-right:10px;"
              >
              install{{installed === true ? 'ed' : ''}}
            </b-button>
            <b-button v-if="selectedService" size="is-small" type="is-warning is-light">
              {{selectedService.details.name}}
            </b-button>
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/about' }" disabled>
          <span style="font-size:10px;color:#ccc;font-weight:bold;">v0.2.0-beta</span>
        </b-navbar-item>
      </template>

    </b-navbar>

    <div class="router-stage">
      <router-view :nitradoLLT="nitradoLLT" />
    </div>

    <footer class="footer" style="padding: 2rem 1.5rem 2rem;">
      <div class="content has-text-centered">
        <p>
          <strong>prism-ui</strong><span style="color:#00d1b2;">#</span><span style="color:#7957d5">v{{ version }}</span> by <a href="https://brngdsn.github.io">brngdsn</a>.
          <br />
          The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          The website content is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
        </p>
      </div>
    </footer>

  </div>

</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import { NitradoRESTClient } from '@/classes/Nitrado'

  export default {
    name: 'app',
    data () {
      return {
        version: `0.2.0-beta`,
        installed: false,
        busy: false,
        nitradoLLT: null
      }
    },
    computed: {
      ...mapGetters([
        'selectedService'
      ])
    },
    methods: {
      async onClick () {
        if (!this.installed) {
          this.busy = true
          this.installed = false
          await new Promise((resolve) => {
            Vue.use({
              install: (Vue, options) => {
                const nitradoRESTClient = new NitradoRESTClient(options.key)
                Vue.prototype.$nitrado = nitradoRESTClient
                resolve()
              }
            }, {
              key: this.nitradoLLT
            })
          })
          this.installed = true
          this.busy = false
        }
      }
    },
    async mounted () {

    }
  }
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
  .router-stage {
    height: calc(100% - 164px);
  }
</style>

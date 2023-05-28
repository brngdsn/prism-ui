<template>

  <div class="nitrado-service">

    <div style="margin-right:15px">
      <Map height="360px" width="400px" :log-files="logFileContents" />
    </div>

    <div>
      <div style="font-size:20px;font-weight:bold;  ">{{service.details.name}}</div>
      <div style="margin-bottom:5px;">
        <b-tag type="is-light">{{service.details.game}}</b-tag>&nbsp;
        <b-tag type="is-light">{{service.details.slots}}  Slots</b-tag>&nbsp;
        <b-tag type="is-light">{{runtime}}</b-tag>&nbsp;
        <b-tag v-if="!selectedService || (selectedService && selectedService.id !== service.id)" type="is-link is-light" class="select-for-mod" @click.native="$emit('select', service)">
          Select for modding
        </b-tag>
        <b-tag v-if="selectedService && selectedService.id === service.id" type="is-link is-light is-warning" class="select-for-mod" @click.native="$emit('select', service)">
          Selected for modding!
        </b-tag>
      </div>
      <div style="margin-bottom:5px;">
        <NitradoSocket :service="service" />
      </div>
      <div>
        <b-tabs v-model="activeTab" :multiline="true" size="is-small">
          <template v-for="logFile in logFiles">
            <b-tab-item
              v-if="logFile.displayed"
              :key="logFile.id"
              :value="logFile.id"
              icon="file-document-outline"
              :label="logFile.label">
              <div class="terminal">
                <div v-if="gameserver && gameserver.game_specific">
                  <NitradoLogFile @log-file-contents="onLogFileContents" :log-file="logFile" :gameserver="gameserver" :service="service" :autofresh="logFile.id === 0" />
                </div>
              </div>
            </b-tab-item>
          </template>
        </b-tabs>
      </div>
    </div>

  </div>
  
</template>

<script>

  import { mapGetters } from 'vuex'
  import Map from '@/components/Map.vue'
  import NitradoSocket from '@/components/NitradoSocket'
  import NitradoLogFile from '@/components/NitradoLogFile'

  export default {
    name: 'NitradoService',
    components: {
      Map,
      NitradoSocket,
      NitradoLogFile
    },
    props: {
      service: Object
    },
    computed: {
      ...mapGetters([
        'selectedService'
      ]),
      logFiles () {
        if (this.gameserver) {
          if (this.gameserver.game_specific) {
            return this.gameserver.game_specific.log_files.map((logFile, i) => {
              const match = logFile.match(/_[0-9]*_[0-9]*_[0-9]*/g)
              const s = match ? match[0] : ``
              return {
                id: `${i}`,
                label: s.split('_').join('/'),
                path: logFile,
                content: `Loading...`,
                displayed: true
              }
            })
          }
        }
        return [{
          id: `-1`,
          label: 'Terminal',
          content: `Loading...`,
          displayed: true
        }]
      },
      runtime () {
        const hoursRemaining = this.service.suspending_in/60/60
        if (hoursRemaining < 24) {
          return `${hoursRemaining.toFixed()} hours`
        } else {
          return `${(hoursRemaining/24).toFixed()} days`
        }
      },
    },
    data () {
      return {
        busy: false,
        gameserver: null,
        debug: false,
        activeTab: 0,
        logFileContents: []
      }
    },
    methods: {
      onLogFileContents (contents) {
        this.logFileContents.push(contents)
        console.log(contents)
      }
    },
    async mounted () {
      this.busy = true
      this.gameserver = await this.$nitrado.getGameserver(this.service.id)
      this.$emit('gameserver', this.gameserver)
      this.busy = false
    }
  }

</script>

<style>
  .nitrado-service {
    border: 1px solid #eee;
    margin: 5px 0px 5px 0px;
    padding: 5px;
    display:flex;
  }
  .nitrado-service > div:nth-child(2) {
    flex-grow: 2;
  }
  .terminal {
    font-family:monospace;
    border: 1px solid #eee;
    height:200px;
    overflow-y:scroll;
    padding: 5px;
    font-size: 12px;
  }
  .select-for-mod {
    cursor:pointer;
  }
  .select-for-mod:hover {
    background-color: #eeebf9 !important;
  }
</style>

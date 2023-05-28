<template>

  <div class="nitrado-socket">

    <div>
      <b-button :loading="init" size="is-small" icon-left="power-socket-us" :type="socketStatus"></b-button>&nbsp;&nbsp;&nbsp;
      <b-button :loading="init" size="is-small" icon-left="run" :type="run"></b-button>&nbsp;&nbsp;&nbsp;
      <b-button :loading="init" size="is-small" type="is-light" style="width:100px;">
        {{recent}}
      </b-button>
    </div>

  </div>
  
</template>

<script>

  export default {
    name: 'NitradoSocket',
    props: {
      service: Object
    },
    computed: {
      run () {
        if (this.gameserverStatus === 'gs_installation') {
          return 'is-dark'
        }
        if (this.gameserverStatus === 'started') {
          return 'is-success is-light'
        }
        if (this.gameserverStatus === 'restarting') {
          return 'is-info is-light'
        }
        if (this.gameserverStatus === 'stopping') {
          return 'is-warning is-light'
        }
        if (this.gamneStatus === 'stopped') {
          return 'is-danger is-light'
        }
        return 'is-light'
      },
      socketStatus () {
        if (this.state === 'logged-in') {
          return 'is-success is-light'
        }
        return 'is-light'
      },
      recent () {
        const recent = this.messages[this.messages.length - 1]
        const type = recent && recent.type ? recent.type : `n/a`
        if (type === 'query') {
          return `${recent.data.player_current}/${recent.data.player_max ? recent.data.player_max : '?'} online`
        }
        return type
      }
    },
    data () {
      return {
        busy: false,
        expand: false,
        init: false,
        messages: [],
        state: null,
        gameserverStatus: null,
        error: null,
        ws: null
      }
    },
    methods: {
      onOpenSocket () {
        this.state = 'opened'
        const pojo = {
          action: 'login',
          data: {
            service_id: this.service.id,
            label: 'ni',
            token: this.service.websocket_token
          }
        }
        const jsonString = JSON.stringify(pojo)
        this.state = 'logging-in'
        this.ws.send(jsonString)
        this.init = false
      },
      onCloseSocket () {
        this.state = 'closed'
        this.init = false
      },
      async onMessageSocket (message) {
        const wsMessage = JSON.parse(message.data)
        this.state = 'logged-in'
        if (wsMessage && wsMessage.type) {
          if (wsMessage.type === 'status') {
            this.gameserverStatus = wsMessage.data
          }
        }
        this.messages.push(wsMessage)
      },
      onErrorSocket (error) {
        this.state = 'error'
        this.error = error
        this.init = false
      },
      initSocket () {

        this.init = true
        this.state = 'creating'

        this.ws = new WebSocket('wss://websocket.nitrado.net/')

        this.ws.addEventListener('open', this.onOpenSocket)

        this.ws.addEventListener('close', this.onCloseSocket)

        this.ws.addEventListener('message', this.onMessageSocket)

        this.ws.addEventListener('error', this.onErrorSocket)

      }
    },
    async mounted () {
      this.busy = true
      this.gameserver = await this.$nitrado.getGameserver(this.service.id)
      this.busy = false
      this.initSocket()
    }
  }

</script>

<style>
  .nitrado-socket {
    display:flex;
  }
</style>

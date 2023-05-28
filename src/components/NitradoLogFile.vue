<template>

  <div class="nitrado-log-file">

    <div v-for="(content, c) in contents" :key="c">
      {{content}}
    </div>

  </div>
  
</template>

<script>

  export default {
    name: 'NitradoLogFile',
    props: {
      logFile: Object,
      gameserver: Object,
      service: Object,
      autofresh: Boolean
    },
    computed: {

    },
    data () {
      return {
        busy: false,
        contents: null
      }
    },
    methods: {
      selectLogFilePath (gameserver, logFile) {
        const split1 = this.selectFilesDownloadPath(gameserver).split('/')
        split1.pop()
        const prefix = split1.join('/')
        const split2 = logFile.split('/')
        split2.reverse()
        split2.pop()
        split2.reverse()
        const appendix = split2.join('/')
        return `${prefix}/${appendix}`
      },
      selectFilesDownloadPath (gameserver) {
        return gameserver.game_specific.path
      },
      async initAutoFresh () {
        // const readableStream = response.body
        // const ts = new TransformStream(new Uint8ArrayToStringsTransformer())
        // const reader = readableStream.pipeThrough(ts).getReader()
        // while (true) {
        //     const { done, value } = await reader.read()
        //     console.log(value)
        //     if (done) break
        // }
      }
    },
    async mounted () {
      this.busy = true
      const logFilePath = this.selectLogFilePath(this.gameserver, this.logFile.path)
      const download = await this.$nitrado.getDownload(this.service.id, logFilePath)
      const { token: { url } } = download
      const file = await this.$nitrado.getFile(url)
      // console.log('FILE:', file)
      if (logFilePath.match(/ADM/g)) {
        this.$emit('log-file-contents', file)
      }
      this.contents = file.split('\n')
      this.contents.reverse()
      this.busy = false
      // if (this.autofresh) {
      //   this.initAutoFresh()
      // }
    }
  }

</script>

<style>

</style>

<template>

  <div class="airlift">

    <!-- SIDE BAR -->
    <section style="overflow-y: scroll;width: 550px;">
      <b-sidebar
        position="static"
        :mobile="mobile"
        :expand-on-hover="expandOnHover"
        :reduce="reduce"
        :delay="expandWithDelay ? 500 : null"
        type="is-light" 
        open
      >
        <div class="p-1">

            <div class="block">
              <img
                  src="../assets/dayz-logo.png"
                  alt="Prism UI for DayZ XML Modding"
              />
            </div>

            <b-menu class="is-custom-mobile" style="padding:10px;">
              
                <b-menu-list label="Files">
                    <b-menu-item icon="information-outline" label="None" v-if="fileList && fileList.length < 1"></b-menu-item>
                    <b-menu-item :class="{'is-busy':file.busy}" v-for="(file, f) in fileList" :key="f" :icon="getIcon(file)" :label="file.name" @click="onPullDir(file)">
                      <div v-if="file.fileList">
                        <b-menu-item :class="{'is-busy':ffile.busy}" v-for="(ffile, ff) in file.fileList" :key="ff" :icon="getIcon(ffile)" :label="ffile.name" @click="(ffile.type === `dir`) && !busy ? onPullDir(ffile) : onClickMenuItem(ffile)">
                          
                          <div v-if="ffile.fileList">
                            <b-menu-item :class="{'is-busy':fffile.busy}" v-for="(fffile, fff) in ffile.fileList" :key="fff" :icon="getIcon(fffile)" :label="fffile.name" @click="(fffile.type === `dir`) && !busy ? onPullDir(fffile) : onClickMenuItem(fffile)">
                              

                              <div v-if="fffile.fileList">
                                <b-menu-item :class="{'is-busy':ffffile.busy}" v-for="(ffffile, ffff) in fffile.fileList" :key="ffff" :icon="getIcon(ffffile)" :label="ffffile.name" @click="(ffffile.type === `dir`) && !busy ? onPullDir(ffffile) : onClickMenuItem(ffffile)">
                                  
                                </b-menu-item>
                              </div>


                            </b-menu-item>
                          </div>

                        </b-menu-item>
                      </div>
                    </b-menu-item>
                </b-menu-list>

                <!-- <b-menu-list>
                    <b-menu-item label="Expo" icon="link"></b-menu-item>
                </b-menu-list> -->

                <b-menu-list label="Actions">
                    <b-menu-item :icon="busy ? 'rotate' : 'cloud-download'" label="Pull" @click="!busy && onPull()" :class="{'is-busy':busy}"></b-menu-item>
                    <b-menu-item :icon="busy ? 'rotate' : 'cloud-upload'" label="Push" :class="{'is-busy':busy}"></b-menu-item>
                    <b-menu-item :icon="busy ? 'rotate' : 'deploy'" label="Deploy" :class="{'is-busy':busy}"></b-menu-item>
                </b-menu-list>

                <br />
                <pre>{{JSON.stringify(markers, null, 2)}}</pre>

            </b-menu>

        </div>
      </b-sidebar>
    </section>

    <!-- MAP -->
    <section style="overflow-y: scroll;width:100%;">
      <Map :height="map_height" :width="map_width" :log-files="log_files" />
    </section>

  </div>
  
</template>

<script>

  import Map from '@/components/Map.vue'

  export default {
    name: 'Airlift',
    components: {
      Map
    },
    data () {
      return {
        busy: false,
        fileList: [],
        expandOnHover: false,
        expandWithDelay: false,
        mobile: "reduce",
        reduce: false,
        window: {
          height: 100,
          width: 200
        },
        markers: [],
        log_files: []
      }
    },
    computed: {
      map_height () {
        return `${this.window.height - 165}px`
      },
      map_width () {
        return `${this.window.width - 550}px`
      }
    },
    mounted () {
      window.addEventListener('resize', this.handle_resize)
      this.handle_resize()
    },
    unmounted () {
      window.removeEventListener('resize', this.handle_resize)
    },
    methods: {
      async onPull () {
        const url = [
          `https://api.brn.fyi`,
          `/v3/dayz/airlift/players/markers/`,
          this.$route.params.hash,
        ].join('')
        const markers_response = await fetch(url)
        const { markers } = await markers_response.json()
        this.markers = markers
        const log_file = markers.join('\n')
        this.log_files.push(log_file)
      },
      handle_resize () {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
      }
    }
  }

</script>

<style lang="scss">
  div.airlift {
    display: flex;
    height: 100%;
  }
  .p-1 {
    padding: 1em;
  }
  .sidebar-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    // min-height: 100vh;
    .sidebar-layout {
        display: flex;
        flex-direction: row;
        min-height: 100%;
        // min-height: 100vh;
    }
  }
  @media screen and (max-width: 1023px) {
      .b-sidebar {
          .sidebar-content {
              &.is-mini-mobile {
                  &:not(.is-mini-expand),
                  &.is-mini-expand:not(:hover):not(.is-mini-delayed) {
                      .menu-list {
                          li {
                              a {
                                  span:nth-child(2) {
                                      display: none;
                                  }
                              }
                              ul {
                                  padding-left: 0;
                                  li {
                                      a {
                                          display: inline-block;
                                      }
                                  }
                              }
                          }
                      }
                      .menu-label:not(:last-child) {
                          margin-bottom: 0;
                      }
                  }
              }
          }
      }
  }
  @media screen and (min-width: 1024px) {
      .b-sidebar {
          .sidebar-content {
              &.is-mini {
                  &:not(.is-mini-expand),
                  &.is-mini-expand:not(:hover):not(.is-mini-delayed) {
                      .menu-list {
                          li {
                              a {
                                  span:nth-child(2) {
                                      display: none;
                                  }
                              }
                              ul {
                                  padding-left: 0;
                                  li {
                                      a {
                                          display: inline-block;
                                      }
                                  }
                              }
                          }
                      }
                      .menu-label:not(:last-child) {
                          margin-bottom: 0;
                      }
                  }
              }
          }
      }
  }
  .is-mini-expand {
      .menu-list a {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
  }
  div.b-sidebar {
    min-height: calc(100%);
    > div.sidebar-content.is-static {
      height: 100%;
      box-shadow: none;
    }
    > div.sidebar-content {
      width:100%;
    }
  }
  .menu-list li.is-busy > a {
    background-color: #fffaeb;
    color: #946c00;
  }
</style>

<template>
  <div class="xml-browser" style="display:flex;">

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
                    <b-menu-item :icon="busy ? 'rotate' : 'deploy'" label="Soft Deploy" :class="{'is-busy':busy}"></b-menu-item>
                    <b-menu-item :icon="busy ? 'rotate' : 'deploy'" label="Hard Deploy" :class="{'is-busy':busy}"></b-menu-item>
                </b-menu-list>

                <br />
                <pre>{{JSON.stringify(fileList, null, 2)}}</pre>

            </b-menu>

        </div>
      </b-sidebar>
    </section>

    <!-- GRID -->
    <section style="padding:25px;overflow-y: scroll;width:100%;">

      <b-tabs v-model="active_tab">
        <b-tab-item label="Visual" :visible="(xmlJsonTransform && (spawnable_types || types_xml)) ? true : false">
          <!-- FOR SPAWNABLE TYPES -->
          <div :style="{'display': (xmlJsonTransform && spawnable_types) ? `inherit` : `none`}">
            <!-- <div v-for="(type, t) in xmlJsonTransform.spawnabletypes.type" :key="t">
              {{type}}
            </div> -->
            <b-table
                checkable
                striped
                :debounce-search="1000"
                :current-page.sync="currentPage"
                :pagination-simple="false"
                :pagination-position="'bottom'"
                :default-sort-direction="defaultSortDirection"
                :pagination-rounded="false"
                :sort-icon="sortIcon"
                :sort-icon-size="sortIconSize"
                :data="table_data"
                ref="table"
                paginated
                per-page="15"
                detailed
                :opened-detailed="defaultOpenedDetails"
                :show-detail-icon="true"
                aria-next-label="Next page"
                aria-previous-label="Previous page"
                aria-page-label="Page"
                aria-current-label="Current page">

                <b-table-column field="Imagesrc" label="Img" width="50" sortable v-slot="props" style="word-break:break-all;">
                  <div :style="{
                    'height': '35px',
                    'width': '35px',
                    'background-position': 'center',
                    'background-size': 'contain',
                    'background-repeat': 'no-repeat',
                    'background-image': `url(${getImageDataSrc(props.row.Imagesrc)})`
                  }"></div>
                </b-table-column>

                <b-table-column field="$.name" label="ClassName" searchable sortable v-slot="props" style="word-break:break-all;">
                    {{ props.row.$.name }}
                    <button>click</button>
                </b-table-column>

                <b-table-column field="cargo" label="Cargo" width="50" searchable sortable v-slot="props" style="word-break:break-all;">
                    {{ props.row.cargo ? props.row.cargo.length : 0 }}
                </b-table-column>

                <b-table-column field="attachments" label="Attachments" width="50" searchable sortable v-slot="props" style="word-break:break-all;">
                    {{ props.row.attachments ? props.row.attachments.length : 0 }}
                </b-table-column>

                <b-table-column field="hoarder" label="Hoarder" width="50" searchable sortable v-slot="props">
                    {{ props.row.hoarder ? `true` : `false` }}
                </b-table-column>

                <template #detail="props">
                  <dayz-spawn-builder :name="props.row.$.name" :attachments="props.row.attachments || []" :cargo="props.row.cargo || []" />
                </template>
            </b-table>
          </div>
          <!-- FOR TYPES XML -->
          <div :style="{'display': (xmlJsonTransform && types_xml) ? `inherit` : `none`}">
            <VGrid
              class="list my-grid-class"
              theme="compact"
              resize="true"
              :autosize="true"
              :filter="true"
              :source="rows"
              :columns="columns"
            />
            <!-- <vue-editable-grid
              class="my-grid-class"
              ref="grid"
              id="mygrid"
              :column-defs="columnDefs"
              :row-data="rows"
              row-data-key='name'
              @cell-updated="cellUpdated"
              @row-selected="rowSelected"
              @link-clicked="linkClicked"
            >
              <template v-slot:header>
                types.xml
              </template>
              <template v-slot:header-r>
                total types: {{ rows.length }}
              </template>
            </vue-editable-grid> -->
          </div>
        </b-tab-item>
        <b-tab-item label="Code" :visible="selectedFileText ? true : false">
          <codemirror v-model="selectedFileText" :options="cmOptions"></codemirror>
        </b-tab-item>
        <b-tab-item label="Transform" :visible="xmlJsonTransform ? true : false">
          <pre>{{xmlJsonTransform}}</pre>
        </b-tab-item>
        <b-tab-item label="Raw" :visible="selectedFileText ? true : false">
          <pre>{{selectedFileText}}</pre>
        </b-tab-item>
        <b-tab-item label="Files" :visible="fileList ? true : false">
          <pre>{{fileList}}</pre>
        </b-tab-item>
        <b-tab-item label="Service" :visible="selectedService ? true : false">
          <pre>{{selectedService}}</pre>
        </b-tab-item>
      </b-tabs>

    </section>

  </div>
</template>

<script>

  const {
    VUE_APP_PRISM_API_HOST
  } = process.env

  // TODO: remove
  // import VueEditableGrid from 'vue-editable-grid'
  // import 'vue-editable-grid/dist/VueEditableGrid.css'

  import VGrid from '@revolist/vue-datagrid'

  import { mapGetters } from 'vuex'
  import xml2js from 'xml2js'
  import DayzSpawnBuilder from '@/views/DayzSpawnBuilder'
  import DayzLootMetaJSON from '@/assets/dayz-loot-meta'

  export default {
    name: 'XMLBrowser',
    props: {

    },
    components: {
      VGrid,
      // VueEditableGrid,
      DayzSpawnBuilder
    },
    data () {
      return {
        DayzLootMetaJSON,
        defaultOpenedDetails: [0],
        active_tab: 5,
        cmOptions: {
          tabSize: 2,
          mode: {
            ext: 'xml'
          },
          theme: 'base16-dark',
          lineNumbers: true,
          line: true
        },
        xmlJsonTransform: null,
        types_xml: null,
        selectedFileText: null,
        busy: false,
        fileList: null,
        expandOnHover: false,
        expandWithDelay: false,
        mobile: "reduce",
        reduce: false,
        currentPage: 1,
        defaultSortDirection: 'asc',
        sortIcon: 'arrow-up',
        sortIconSize: 'is-small',
        spawnable_types: false,
        columns: [
          { prop: 'Imagesrc', name: 'img', cellTemplate: (createElement, props) => {
            const img_src = props.model[props.prop]
            return createElement('img', { style: {}, class: { 'inner-cell': true }, src: this.getImageDataSrc(img_src) }, ``)
          } },
          { prop: 'name', name: 'class-name' },
          { prop: 'nominal', name: 'nominal' },
          { prop: 'lifetime', name: 'lifetime' },
          { prop: 'restock', name: 'restock' },
          { prop: 'min', name: 'min' },
          { prop: 'quantmin', name: 'quantmin' },
          { prop: 'quantmax', name: 'quantmax' },
          { prop: 'cost', name: 'cost' },
          { prop: 'flags', name: 'flags' },
          { prop: 'category', name: 'category', cellTemplate: (createElement, props) => {
            const categorys = props.model[props.prop]
            if (categorys) {
              const content = categorys
                .map((category) => {
                  const { $: { name } } = category
                  return name
                })
                .join(', ')
              return createElement('div', { style: {}, class: { 'inner-cell': true } }, content)
            } else {
              return createElement('div', { style: {}, class: { 'inner-cell': true } }, `none`)
            }
          } },
          { prop: 'usage', name: 'usage', cellTemplate: (createElement, props) => {
            const usages = props.model[props.prop]
            if (usages) {
              const content = usages
                .map((usage) => {
                  const { $: { name } } = usage
                  return name
                })
                // .map((name) => `<b-tag type="is-light">${name}</b-tag>`)
                .join(', ')
              return createElement('div', { style: {}, class: { 'inner-cell': true } }, content)
            } else {
              return createElement('div', { style: {}, class: { 'inner-cell': true } }, `none`)
            }
          } },
        ]
      }
    },
    computed: {
      ...mapGetters([
        'selectedService'
      ]),
      rows () {
        if (this.xmlJsonTransform && this.xmlJsonTransform.types) {
          return this.xmlJsonTransform.types.type.map((type) => {
            const [loot] = DayzLootMetaJSON.filter((loot) => loot.ClassName === type.$.name)
            return { ...type, Imagesrc: loot ? loot.Imagesrc : `` }
          })
          .map((type) => {
            const {
              $: {
                name
              },
              restock: [restock],
              nominal: [nominal],
              lifetime: [lifetime],
              ...rest
            } = type
            return {
              ...rest,
              restock,
              lifetime,
              nominal,
              name
            }
          })
        } else {
          return []
        }
      },
      table_data () {
        if (this.xmlJsonTransform && this.xmlJsonTransform.spawnabletypes) {
          return this.xmlJsonTransform.spawnabletypes.type.map((type) => {
            const [loot] = DayzLootMetaJSON.filter((loot) => loot.ClassName === type.$.name)
            return { ...type, Imagesrc: loot ? loot.Imagesrc : `` }
          })
        } else {
          return []
        }
      }
    },
    methods: {
      cellUpdated () {},
      rowSelected () {},
      linkClicked () {},
      getImageDataSrc (imgSrcSuffix) {
        return `${VUE_APP_PRISM_API_HOST}${imgSrcSuffix}`
      },
      async onClickMenuItem (file) {
        this.types_xml = false
        this.spawnable_types = false
        file.busy = true
        this.busy = true
        this.$forceUpdate()
        const download = await this.$nitrado.getDownload(this.selectedService.id, file.path)
        const fileText = await this.$nitrado.getFile(download.token.url)
        if (file.name.match(/\.xml/g)) {
          if (file.name.match(/spawnabletypes/g)) {
            this.spawnable_types = true
          }
          if (file.name === `types.xml`) {
            this.types_xml = true
          }
          this.xmlJsonTransform = await new Promise((resolve, reject) => {
            xml2js.parseString(fileText.replaceAll(/<!--[\s\-aA0-zZ9]*-->/g, ''), (error, result) => {
              if (error) reject(error)
              else resolve(result)
            })
          })
          console.log(this.xmlJsonTransform)
        }
        if (file.name.match(/\.json/g)) {
          this.xmlJsonTransform = JSON.parse(fileText)
        }
        this.selectedFileText = fileText
        this.busy = false
        file.busy = false
        this.$forceUpdate()
      },
      getIcon (file) {
        if (file.busy === true) {
          return 'restore'
        }
        if (file.type === 'dir') {
          return 'folder'
        }
        if (file.type === 'file') {
          if (file.name.match(/\.log/g)) return 'sine-wave'
          if (file.name.match(/\.json/g)) return 'code-json'
          if (file.name.match(/\.xml/g)) return 'xml'
        }
        return 'information-outline'
      },
      async onPullDir (file) {
        this.spawnable_types = false
        this.types_xml = false
        file.busy = true
        this.busy = true
        this.$forceUpdate()
        const fileList = await this.$nitrado.getFileList(this.selectedService.id, file.path)
        file.fileList = fileList
        this.busy = false
        file.busy = false
        this.$forceUpdate()
      },
      async onPull () {
        this.busy = true
        this.types_xml = false
        const fileList = await this.$nitrado.getFileList(this.selectedService.id)
        console.log(fileList)
        this.fileList = fileList
        this.busy = false
      }
    },
    mounted () {

    }
  }
  
</script>

<style lang="scss">
  .xml-browser {
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
  .my-grid-class {
    height: 400px;
  }
  div.vue-codemirror {
    border: 1px solid #ccc;
  }
  div.CodeMirror {
    height: 100%;
  }
</style>

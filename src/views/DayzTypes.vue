<template>

  <div class="dayz-types">
    <section class="section" style="padding: 1rem;">
      <b-tabs v-model="activeTab">
          <b-tab-item label="All">
            <b-table
              :data="data"
              :paginated="isPaginated"
              :per-page="perPage"
              :current-page.sync="currentPage"
              :pagination-simple="isPaginationSimple"
              :pagination-position="paginationPosition"
              :default-sort-direction="defaultSortDirection"
              :pagination-rounded="isPaginationRounded"
              :sort-icon="sortIcon"
              :sort-icon-size="sortIconSize"
              :debounce-search="1000"
              detailed
              checkable
              :checked-rows.sync="checkedRows"
              :checkbox-position="checkboxPosition"
              :checkbox-type="checkboxType"
              :show-detail-icon="showDetailIcon"
              default-sort="Label"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page"
              >

              <b-table-column field="Imagesrc" label="Img" width="50" sortable numeric v-slot="props">
                <div :style="{
                  'height': '35px',
                  'width': '35px',
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                  'background-image': `url(${getImageDataSrc(props.row.Imagesrc)})`
                }"></div>
              </b-table-column>

              <b-table-column field="Label" label="Label" searchable sortable v-slot="props">
                {{ props.row.Label }}
              </b-table-column>

              <b-table-column field="ClassName" label="Class Name" searchable sortable v-slot="props">
                {{ props.row.ClassName }}
              </b-table-column>

              <b-table-column field="Size" label="Slots" searchable sortable centered v-slot="props">
                {{ props.row.Size }}
              </b-table-column>

              <b-table-column field="Capacity" label="Capacity" searchable sortable centered v-slot="props">
                {{ props.row.Capacity }}
              </b-table-column>

              <b-table-column field="Type" label="Type" searchable sortable centered v-slot="props">
                {{ props.row.Type }}
              </b-table-column>

              <b-table-column field="Category" label="Category" searchable sortable centered v-slot="props">
                {{ props.row.Category }}
              </b-table-column>

              <template slot="detail" slot-scope="props">
                <DayzSpawnableType :data="props.row" size="large" />
              </template>

            </b-table>
          </b-tab-item>

          <b-tab-item label="Selected">
            <b-table
              :data="checkedRows"
              :paginated="isPaginated"
              :per-page="perPage"
              :current-page.sync="currentPage"
              :pagination-simple="isPaginationSimple"
              :pagination-position="paginationPosition"
              :default-sort-direction="defaultSortDirection"
              :pagination-rounded="isPaginationRounded"
              :sort-icon="sortIcon"
              :sort-icon-size="sortIconSize"
              :debounce-search="1000"
              detailed
              disabled
              :show-detail-icon="showDetailIcon"
              default-sort="Label"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page"
              >

              <b-table-column field="Imagesrc" label="Img" width="50" sortable numeric v-slot="props">
                <div :style="{
                  'height': '35px',
                  'width': '35px',
                  'background-position': 'center',
                  'background-size': 'contain',
                  'background-repeat': 'no-repeat',
                  'background-image': `url(${getImageDataSrc(props.row.Imagesrc)})`
                }"></div>
              </b-table-column>

              <b-table-column field="Label" label="Label" searchable sortable v-slot="props">
                {{ props.row.Label }}
              </b-table-column>

              <b-table-column field="ClassName" label="Class Name" searchable sortable v-slot="props">
                {{ props.row.ClassName }}
              </b-table-column>

              <b-table-column field="Size" label="Slots" searchable sortable centered v-slot="props">
                {{ props.row.Size }}
              </b-table-column>

              <b-table-column field="Capacity" label="Capacity" searchable sortable centered v-slot="props">
                {{ props.row.Capacity }}
              </b-table-column>

              <b-table-column field="Type" label="Type" searchable sortable centered v-slot="props">
                {{ props.row.Type }}
              </b-table-column>

              <template slot="detail" slot-scope="props">
                <DayzSpawnableType :data="props.row" size="large" />
              </template>

            </b-table>
          </b-tab-item>

          <b-tab-item label="Export">
            <b-tabs v-model="activeSubTab"
              :position="'is-left'"
              vertical
              :expanded="false"
              >
                <b-tab-item label="JSON Object Spawn">
                  <b-navbar>
                      <template #brand>
                          <b-navbar-item>
                            <b-button type="is-warning is-light">Download</b-button>
                          </b-navbar-item>
                      </template>
                      <template #start>
                          <b-navbar-item href="#">
                            <b-button type="is-info is-light" @click="set_explode_pos()">Explode pos</b-button>
                            <b-button type="is-info is-light" @click="set_spread_pos()" style="margin-left:5px;">Spread pos</b-button>
                            <b-numberinput style="margin-left:15px;width:100px;" v-model="spread_pos_number" :controls="false"></b-numberinput>
                            <b-radio v-model="spread_pos" style="margin-left:15px;"
                                name="pos"
                                native-value="x">
                                x
                            </b-radio>
                            <b-radio v-model="spread_pos"
                                name="pos"
                                native-value="y">
                                y
                            </b-radio>
                            <b-radio v-model="spread_pos"
                                name="pos"
                                native-value="z">
                                z
                            </b-radio>
                          </b-navbar-item>
                          <b-navbar-item href="#">
                            <b-button type="is-info is-light" @click="set_spread_ypr()">Spread ypr</b-button>
                            <b-numberinput style="margin-left:15px;width:100px;" v-model="spread_ypr_number" :controls="false"></b-numberinput>
                            <b-radio v-model="spread_ypr" style="margin-left:15px;"
                                name="ypr"
                                native-value="y">
                                y
                            </b-radio>
                            <b-radio v-model="spread_ypr"
                                name="ypr"
                                native-value="p">
                                p
                            </b-radio>
                            <b-radio v-model="spread_ypr"
                                name="ypr"
                                native-value="r">
                                r
                            </b-radio>
                          </b-navbar-item>
                      </template>
                  </b-navbar>
                  <pre style="font-family:monospace;margin-top: 15px; background-color: #eee; padding: 15px;">{{output_json_object_spawn}}</pre>
                </b-tab-item>
                <b-tab-item label="XML Event Spawn">
                  <b-button type="is-info is-light">Download</b-button>
                </b-tab-item>
            </b-tabs>
          </b-tab-item>
      </b-tabs>
      <br />
      <!-- <pre>{{DayzLootMetaJSON}}</pre> -->
    </section>
  </div>
  
</template>

<script>

  const {
    VUE_APP_PRISM_API_HOST
  } = process.env

  import DayzLootMetaJSON from '@/assets/dayz-loot-meta'
  import DayzSpawnableType from '@/components/DayzSpawnableType'

  export default {
    name: 'dayz-types',
    components: {
      DayzSpawnableType
    },
    data () {
      return {
        DayzLootMetaJSON,
        data: DayzLootMetaJSON,
        isPaginated: true,
        isPaginationSimple: false,
        isPaginationRounded: false,
        paginationPosition: 'bottom',
        defaultSortDirection: 'asc',
        sortIcon: 'arrow-up',
        sortIconSize: 'is-small',
        currentPage: 1,
        perPage: 10,
        showDetailIcon: true,
        checkboxPosition: 'left',
        checkboxType: 'is-primary',
        checkedRows: [],
        activeTabe: 0,
        activeSubTab: 0,
        spread_pos: 'x',
        spread_ypr: 'y',
        spread_pos_number: 0,
        spread_ypr_number: 0,
        explode_pos: {x: 0.0, y: 0.0, z: 0.0,},
        pos: {x: 0.0, y: 0.0, z: 0.0,},
        ypr: {y: 0.0, p: 0.0, r: 0.0,},
      }
    },
    mounted () {

    },
    computed: {
      output_json_object_spawn () {
        const map = this.checkedRows
          .map((loot, i) => {
            const {
              ClassName: name,
            } = loot
            const pos = [
              this.pos.x + (this.explode_pos.x * (i + 1)),
              this.pos.y + (this.explode_pos.y * (i + 1)),
              this.pos.z + (this.explode_pos.z * (i + 1)),
            ]
            const ypr = [this.ypr.y,this.ypr.p,this.ypr.r,]
            return {
              name, pos, ypr
            }
          })
        return JSON.stringify({ Objects: map }, null, 2)
      }
    },
    methods: {
      set_explode_pos () {
        this.explode_pos[this.spread_pos] = this.spread_pos_number
      },
      set_spread_pos () {
        this.pos[this.spread_pos] = this.spread_pos_number
      },
      set_spread_ypr () {
        this.ypr[this.spread_ypr] = this.spread_ypr_number
      },
      getImageDataSrc (imgSrcSuffix) {
        return `${VUE_APP_PRISM_API_HOST}${imgSrcSuffix}`
      }
    }
  }

</script>

<style>

</style>

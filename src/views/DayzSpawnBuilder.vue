<template>

  <div class="dayz-spawn-builder">
    <section class="section" style="padding: 1rem;">

          <b-field label="Spawnable Type">
            <b-taginput
              v-model="tags"
              maxtags="1"
              :data="filteredTags"
              autocomplete
              ref="taginput"
              icon="label"
              placeholder="Choose a type"
              @typing="getFilteredTags">
              <template slot-scope="props">
                <strong>{{props.option.Label}}</strong>: {{props.option.ClassName}}
              </template>
              <template slot="empty">
                There are no types
              </template>
              <template slot="selected" slot-scope="props">
                <b-tag
                  v-for="(tag, index) in props.tags"
                  :key="index"
                  :type="getType(tag)"
                  rounded
                  :tabstop="false"
                  ellipsis
                  closable
                  @close="$refs.taginput.removeTag(index, $event)">
                  {{tag.Label}}
                </b-tag>
              </template>
            </b-taginput>
          </b-field>

          <b-field label="Attachments">
            <b-taginput
              v-model="tags1"
              allow-duplicates
              :data="filteredTags"
              autocomplete
              ref="taginput1"
              icon="label"
              placeholder="Choose a type"
              @typing="getFilteredTags">
              <template slot-scope="props">
                <strong>{{props.option.Label}}</strong>: {{props.option.ClassName}}
              </template>
              <template slot="empty">
                There are no types
              </template>
              <template slot="selected" slot-scope="props">
                <b-tag
                  v-for="(tag, index) in props.tags"
                  :key="index"
                  :type="getType(tag)"
                  rounded
                  :tabstop="false"
                  ellipsis
                  closable
                  @close="$refs.taginput1.removeTag(index, $event)">
                  {{tag.Label}}
                </b-tag>
              </template>
            </b-taginput>
          </b-field>

          <b-field label="Cargo">
            <b-taginput
              v-model="tags2"
              allow-duplicates
              :data="filteredTags"
              autocomplete
              ref="taginput2"
              icon="label"
              placeholder="Choose a type"
              @typing="getFilteredTags">
              <template slot-scope="props">
                <strong>{{props.option.Label}}</strong>: {{props.option.ClassName}}
              </template>
              <template slot="empty">
                There are no types
              </template>
              <template slot="selected" slot-scope="props">
                <b-tag
                  v-for="(tag, index) in props.tags"
                  :key="index"
                  :type="getType(tag)"
                  rounded
                  :tabstop="false"
                  ellipsis
                  closable
                  @close="$refs.taginput2.removeTag(index, $event)">
                  {{tag.Label}}
                </b-tag>
              </template>
            </b-taginput>
          </b-field>

          <div style="display:flex;">
            <div style="padding:15px;flex:50%;">
              <DayzSpawnableType v-if="tags[0]" :data="tags[0]" size="slim" :attachments="tags1" />
              <pre v-if="tags.length" style="font-family:monospace;margin-top: 15px; background-color: #eee; padding: 15px;">{{output}}</pre>
            </div>
            <div style="padding:15px;flex:50%;flex: 1 1 50%; display: flex; flex-wrap: wrap;height:100px;">
              <div style="margin-bottom:15px;height: 121px;" v-for="(t, ti) in tags1" :key="ti">
                <DayzSpawnableType :data="t" size="tiny" />
              </div>
              <div style="margin-bottom:15px;height: 121px;" v-for="(t, ti) in tags2" :key="ti">
                <DayzSpawnableType :data="t" size="tiny" />
              </div>
            </div>
          </div>

    </section>
  </div>
  
</template>

<script>

  import DayzLootMetaJSON from '@/assets/dayz-loot-meta'
  import DayzSpawnableType from '@/components/DayzSpawnableType'

  export default {
    name: 'dayz-spawn-builder',
    components: {
      DayzSpawnableType
    },
    props: {
      name: String,
      cargo: Array,
      attachments: Array,
    },
    data () {
      return {
        DayzLootMetaJSON,
        filteredTags: DayzLootMetaJSON,
        tags: [],
        tags1: [],
        tags2: [],
      }
    },
    computed: {
      output () {
        const [type] = this.tags
        const { ClassName } = type
        const attachments = this.tags1
          .map(tag => {
            const { ClassName } = tag
            const item = `\n    <item name="${ClassName}" chance="1.00" />\n`
            return `\n  <attachments chance="1.00">${item}  </attachments>`
          })
          .reduce((a,c) => `${a}${c}`, ``)
        const cargo = this.tags2
          .map(tag => {
            const { ClassName } = tag
            const item = `\n    <item name="${ClassName}" chance="1.00" />\n`
            return `\n  <cargo chance="1.00">${item}  </cargo>`
          })
          .reduce((a,c) => `${a}${c}`, ``)
        const output = `<type name="${ClassName}">${attachments.length > 0 ? `${attachments}\n` : ``}${cargo.length > 0 ? `${cargo}\n` : ``}</type>`
        return output
      }
    },
    mounted () {
      if (this.name) {
        const [tag] = DayzLootMetaJSON.filter((option) => {
          return `${option.ClassName}`
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        })
        this.tags.push(tag)
      }
      if (this.attachments && this.attachments.length > 0) {
        this.attachments.forEach(attachment => {
          const [tag] = DayzLootMetaJSON.filter((option) => {
            return `${option.ClassName}`
              .toString()
              .toLowerCase()
              .indexOf(attachment.item[0].$.name.toLowerCase()) >= 0
          })
          this.tags1.push(...[tag].filter(t => t))
        })
      }
      if (this.cargo && this.cargo.length > 0) {
        this.cargo.forEach(cargo => {
          const [tag] = DayzLootMetaJSON.filter((option) => {
            return `${option.ClassName}`
              .toString()
              .toLowerCase()
              .indexOf(cargo.item[0].$.name.toLowerCase()) >= 0
          })
          this.tags2.push(...[tag].filter(t => t))
        })
      }
    },
    methods: {
      getFilteredTags (text) {
        this.filteredTags = DayzLootMetaJSON.filter((option) => {
          return `${option.Label}${option.ClassName}`
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        })
      },
      getType (tag) {
        if (tag.Category.match(/Storage/g)) {
          return 'is-primary'
        } else if (tag.Category.match(/Weapon/g)) {
          return 'is-danger'
        } else if (tag.Category.match(/Clothing/g)) {
          return 'is-warning'
        } else if (tag.Category.match(/Food/g)) {
          return 'is-success'
        } else if (tag.Category.match(/Vehicle/g)) {
          return 'is-info'
        } else {
          return 'is-light'
        }
      }
    }
  }

</script>

<style>

</style>

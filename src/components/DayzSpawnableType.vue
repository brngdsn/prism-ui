<template>
  <div class="dayz-spawnable-type">

    <div v-if="size === 'large'" style="display:flex;">
      <div>
        <div style="
          padding: 10px;
          border: 1px solid #ccc; border-radius: 2px;
          margin-right: 25px;
          background-color: white;
          background-origin: content-box, content-box;
        " :style="{
          'height': '200px',
          'width': '200px',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
          'background-image': `url(${getImageDataSrc(data.Imagesrc)})`
        }"></div>
      </div>
      <div>
        <div style="font-size:5rem;line-height: 5rem;">{{ data.Label }}</div>
        <div style="font-size:2.5rem;line-height:2.5rem;color:#ccc;">{{ data.ClassName }}</div>
        <br />
        <div style="font-size:1rem;color:#333;font-family: monospace;">v{{ data.Version ? data.Version : `?.?` }} - {{ data.Category }} ({{ data.Type ? data.Type : `unknown` }})</div>
        <br />
        <div>
          <div style="white-space: pre-wrap; background-color:inherit;padding:0px;">{{ getRowView(data) }}</div>
        </div>
      </div>
    </div>

    <div v-if="size === 'slim'">
      <div style="display:flex;">
        <div>
          <div style="
            padding: 10px;
            border: 1px solid #ccc; border-radius: 2px;
            margin-right: 25px;
            background-color: white;
            background-origin: content-box, content-box;
          " :style="{
            'height': '200px',
            'width': '200px',
            'background-position': 'center',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-image': `url(${getImageDataSrc(data.Imagesrc)})`
          }"></div>
        </div>
        <div>
          <div style="font-size:2.5rem;line-height: 2.5rem;">{{ data.Label }}</div>
          <div style="font-size:1.5rem;line-height:1.5rem;color:#ccc;">{{ data.ClassName }}</div>
          <br />
          <div style="font-size:.75rem;color:#333;font-family: monospace;">
            <b-tag type="is-primary is-light">v{{ data.Version ? data.Version : `?.?` }}</b-tag>
            {{ data.Category }} ({{ data.Type ? data.Type : `unknown` }})
          </div>
          <div style="font-size:5rem;color:#333;font-family: monospace;">{{getSlots()}}/{{getCapacity(data.Capacity) === 0 ? this.spaceOverride : getCapacity(data.Capacity)}}</div>
        </div>
      </div>
      <div>
        <div style="background-color:inherit;padding:15px;">
          <div v-for="(row, i) in getRowAs(data)" :key="i">
            <span style="text-decoration:underline;">{{row.label}}:</span>&nbsp;<span>{{row.value}}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="size === 'small'">
      <div style="display:flex;">
        <div>
          <div style="
            padding: 10px;
            border: 1px solid #ccc; border-radius: 2px;
            margin-right: 25px;
            background-color: white;
            background-origin: content-box, content-box;
          " :style="{
            'height': '127px',
            'width': '127px',
            'background-position': 'center',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-image': `url(${getImageDataSrc(data.Imagesrc)})`
          }"></div>
        </div>
        <div>
          <div style="font-size:2.5rem;line-height: 2.5rem;">{{ data.Label }}</div>
          <div style="font-size:1.5rem;line-height:1.5rem;color:#ccc;">{{ data.ClassName }}</div>
          <div style="font-size:.75rem;color:#333;font-family: monospace;margin-top:10px;">
            <b-tag type="is-primary is-light">v{{ data.Version ? data.Version : `?.?` }}</b-tag>
            {{ data.Category }} ({{ data.Type ? data.Type : `unknown` }})
          </div>
          <div style="font-size:1rem;line-height:1rem;color:#333;font-family: monospace;margin-top:10px;">{{data.Size ? data.Size : `Unknown`}}</div>
        </div>
      </div>
    </div>

    <div v-if="size === 'tiny'">
      <div style="display:flex;">
        <div>
          <div style="
            padding: 10px;
            border: 1px solid #ccc; border-radius: 2px;
            margin-right: 25px;
            background-color: white;
            background-origin: content-box, content-box;
          " :style="{
            'height': '127px',
            'width': '127px',
            'background-position': 'center',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-image': `url(${getImageDataSrc(data.Imagesrc)})`
          }"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  const {
    VUE_APP_PRISM_API_HOST
  } = process.env
  export default {
    name: 'dayz-spawnable-type',
    props: {
      attachments: Array,
      spaceOverride: String,
      size: String,
      // is the selected spawnable type, from parent tags[0]
      data: Object
    },
    methods: {
      getImageDataSrc (imgSrcSuffix) {
        return `${VUE_APP_PRISM_API_HOST}${imgSrcSuffix}`
      },
      getSlots () {
        // here
        const spawnableTypeKind = this.data.Category
        if (spawnableTypeKind.indexOf('Vehicles') >= 0) {
          const nonWearables = this.attachments.filter(attachment => !attachment['Vehicle(s)'])
          const wearables = this.attachments.filter(attachment => attachment['Vehicle(s)'] && attachment['Vehicle(s)'].indexOf(spawnableTypeKind.Label) >= 0)
          this.spaceOverride = wearables.reduce((a, c) => {
            const n = this.getCapacity(c.Capacity)
            return a + n
          }, 0)
          return !this.attachments ? 0 : nonWearables.reduce((a,c) => a + this.getCapacity(c.Size), 0)
        } else if (spawnableTypeKind.indexOf('NPCs') >= 0) {
          const nonWearables = this.attachments.filter(attachment => attachment.Category.indexOf('Clothing') === -1)
          const wearables = this.attachments.filter(attachment => attachment.Category.indexOf('Clothing') >= 0)
          this.spaceOverride = wearables.reduce((a, c) => {
            const n = this.getCapacity(c.Capacity)
            return a + n
          }, 0)
          return !this.attachments ? 0 : nonWearables.reduce((a,c) => a + this.getCapacity(c.Size), 0)
        } else {
          const nonWearables = this.attachments
          const wearables = []
          this.spaceOverride = wearables.reduce((a, c) => {
            const n = this.getCapacity(c.Capacity)
            return a + n
          }, 0)
          return !this.attachments ? 0 : nonWearables.reduce((a,c) => a + this.getCapacity(c.Size), 0)
        }
      },
      getCapacity (sizeString = ``) {
        const match = sizeString.match(/[0-9]*\sSlot/g)
        const [size] = !match ? [0] : match.map(x => x.split(' Slots').join('')).map(x => parseInt(x))
        return size
      },
      getRowAs (row) {
        const keys = Object.keys(row)
        return keys.map(k => ({ label: k, value: row[k] })).filter(x => x.label !== 'Imagesrc')
      },
      getRowView (row) {
        return Object.keys(row).reduce((a, c) => (`${a}${c}: ${row[c]}\n`), ``)
      }
    }
  }
</script>

<style scoped lang="scss">

</style>

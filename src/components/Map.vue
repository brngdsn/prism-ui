<template>
  <div class="map">
    <div :id="mapId" class="dayz-map" :style="{ height: height, width: width }"></div>
    <div v-for="(log_file, l) in logFiles" :key="l">
      <DayZGameEventsLayer :log-file="log_file" @layer="onLayer" />
    </div>
  </div>
</template>

<script>

  import 'leaflet/dist/leaflet.css'
  import 'leaflet'
  import DayZGameEventsLayer from '@/components/DayZGameEventsLayer'

  class DayZGameEvents {

    static async create (lines) {
      const lines_map = lines.map(DayZGameEvents.transform)
      const game_events = await Promise.resolve(lines_map)
      return new this(game_events)
    }

    static transform (line) {
      const time = line.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g)
      const playersMatch = line.match(/Player\s[\"|\'][a0-z9\s\/\-\_]*[\"|\']/g)
      const players = playersMatch ? playersMatch.map(player => {
        const split = player.split('\"')[1]
        return `${split}`
      }) : []
      const killed = line.match(/\skilled\s/g) ? true : false
      const hit = line.match(/\shit\s/g) ? true : false
      const pveMatch = line.match(/by[\s]{1,2}[a0-z9\/\-\_\s]*/g)
      const isPve = (pveMatch && players.length < 2)
      const pve = isPve ? (
        pveMatch[0].match(/by\s\swith\s/g) ? pveMatch[0].split('by  with ').join('') : (
          pveMatch[0].match(/\sinto\s/g) ? pveMatch[0].split(' into ').join('').split('by ').join('') : (
            pveMatch[0].match(/explosion/g) ? line.split('explosion').pop().trim().split(/[(|)]/g).join('') : pveMatch[0].split('by ').join('')
          )
        )
      ) : false
      const item = [line.match(/\)\swith\s[a0-z9\-\s]*/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .map(match => match.split(') with ').join(''))
        .map(string => string.split(' from ')[0])
        .reduce((a,c) => c, false)
      const melee = [line.match(/\(Melee[a0-z9\_]*\)/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .map(match => match.split(/[(|)]/g).join(''))
        .reduce((a,c) => c, false)
      const headshot = [line.match(/Head\([0-9]*\)/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .reduce((a,c) => true, false)
      const brainshot = [line.match(/Brain\([0-9]*\)/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .reduce((a,c) => true, false)
      const meters = [line.match(/from\s[0-9]*\.[0-9]*\smeters/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .map(meters => meters.split(' meters').join('').split('from ').join(''))
        .reduce((a,c) => c, 0)
      const coords = [line.match(/pos=<[0-9]*.[0-9]*,\s[0-9]*.[0-9]*,\s[0-9]*.[0-9]*>/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .map(match => {
          const coords = match.split('pos=<').join('').split('>').join('').split(', ')
          return coords
        })
        .reduce((a,c) => c, [])
      const damage = [line.match(/for\s[0-9]*\sdamage/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .map(damage => damage.split(' damage').join('').split('for ').join(''))
        .reduce((a,c) => c, 0)
      const dead = [line.match(/\(DEAD\)/g)]
        .filter(x => x !== null)
        .reduce((a,c) => c, [])
        .reduce((a,c) => true, false)
      const suicide = line.match(/suicide/g) ? true : false
      const placed = line.match(/\)\splaced\s/g) ? true : false
      const unconscious = line.match(/unconscious/g) ? true : false
      const reconscious = line.match(/\sconscious/g) ? true : false
      const connected = line.match(/is\sconnected/g) ? true : false
      const disconnected = line.match(/has\sbeen\sdisconnected/g) ? true : false
      return {
        dead,
        damage,
        disconnected,
        connected,
        reconscious,
        unconscious,
        suicide,
        placed,
        coords,
        melee,
        brainshot,
        headshot,
        meters,
        item,
        pve,
        killed,
        hit,
        players,
        time,
        original: line
      }
    }

    constructor (game_events) {
      return game_events
    }

  }

  class LeafletConfig {
    constructor () {
      return {
        kx: 0.00039746552365541434,
        ky: 0.00039747543741573465,
        dx: 7961.677966525134,
        dy: 7961.958744725942,
        switchedCoords: false
      }
    }
  }

  export default {
    name: 'Map',
    props: {
      height: String,
      width: String,
      logFiles: Array
    },
    components: {
      DayZGameEventsLayer
    },
    data () {
      return {
        state_update_key: 0,
        map: null,
        layer_control: null,
        online_players_hash: {},
        mapId: `dayz-map-${(Math.random() * 1000000).toFixed()}`
      }
    },
    methods: {
      get_color ({ killed, hit, players, suicide, connected, disconnected, placed }) {
        if (placed) return 'yellow'
        if (killed) return 'red'
        if (hit) return 'orange'
        if (suicide) return 'black'
        if (connected) return 'lime'
        if (disconnected) return 'grey'
        if (players.length === 1) return 'cyan'
      },
      get_kind ({ killed, hit, players, suicide, connected, disconnected, placed }) {
        if (placed) return 'placed'
        if (killed) return 'killed'
        if (hit) return 'hit'
        if (suicide) return 'suicide'
        if (connected) return 'connected'
        if (disconnected) return 'disconnected'
        if (players.length === 1) return 'location'
      },
      async onLayer (layer) {
        console.log('onLayer')

        const lines = layer.split(`\n`)
        const event_objects = await DayZGameEvents.create(lines)

        const other_markers = event_objects
          .filter(({ coords }) => coords.length > 2)
          .map((event_object) => {
            const {
              dead,
              damage,
              disconnected,
              connected,
              reconscious,
              unconscious,
              suicide,
              placed,
              coords,
              melee,
              brainshot,
              headshot,
              meters,
              item,
              pve,
              killed,
              hit,
              players,
              time,
              original: line
            } = event_object

            const [player1, player2] = players
            if (connected) {
              this.online_players_hash[player1] = { ...event_object }
            } else if (disconnected) {
              delete this.online_players_hash[player1]
            }

            if (this.online_players_hash[player1]) {
              this.online_players_hash[player1] = { ...event_object }
            }

            const L = window.L
            const map = this.map
            const [loc1, loc2] = coords
            const config = new LeafletConfig()
            const latlng = L.LocUtil.locToCoords({ loc1, loc2, }, config)

            const color = this.get_color(event_object)

            const marker = L
              .circleMarker([latlng.lat, latlng.lng], {
                weight: 1,
                color: 'black',
                fillColor: color,
                fillOpacity: 0.33,
                radius: 4
              })

            const kind = this.get_kind(event_object)
            const [x, z, y] = coords
            const players_pretty = [
              player1 ? player1 : ``,
              player2 ? player2 : ``,
            ].join(`/`)
            const content_params = [
              players_pretty,
              kind,
              `${x}/${y}`,
            ]
            const content = content_params.join(` `)

            marker.on('mouseover', (e) => {
              L.popup()
                .setLatLng(e.latlng)
                .setContent(content)
                .openOn(map)
            })

            if (kind !== `location`) {
              // marker.addTo(map)
              return marker
            } else {
              return null
            }
          })
          .filter(m => m)

        const player_location_markers = Object.keys(this.online_players_hash)
          .map((key) => {
            const {
              dead,
              damage,
              disconnected,
              connected,
              reconscious,
              unconscious,
              suicide,
              placed,
              coords,
              melee,
              brainshot,
              headshot,
              meters,
              item,
              pve,
              killed,
              hit,
              players,
              time,
              original: line
            } = this.online_players_hash[key]
            const L = window.L
            const map = this.map
            const [loc1, loc2] = coords
            const config = new LeafletConfig()
            const latlng = L.LocUtil.locToCoords({ loc1, loc2, }, config)

            const marker = L
              .circleMarker([latlng.lat, latlng.lng], {
                weight: 1,
                color: 'black',
                fillColor: 'cyan',
                fillOpacity: 0.5,
                radius: 4
              })

            const [x, z, y] = coords
            const content_params = [
              key,
              `${x}/${y}`,
            ]
            const content = content_params.join(` `)

            marker.on('mouseover', (e) => {
              L.popup()
                .setLatLng(e.latlng)
                .setContent(content)
                .openOn(map)
            })

            // marker.addTo(map)
            return marker
          })
        
        const L = window.L
        const other_overlay = L.layerGroup(other_markers)
        const player_location_overlay = L.layerGroup(player_location_markers)
        this.layer_control.addOverlay(other_overlay, 'Default')
        this.layer_control.addOverlay(player_location_overlay, 'Location')
        // this.$forceUpdate()
      }
    },
    mounted () {
      const L = window.L
      L.LocUtil = {
        locToCoords: (t, e) => {
            var i = L.Projection.SphericalMercator,
                n = t.loc1,
                o = t.loc2;
            e.switchedCoords && (o = [n, n = o][0]);
            var r = {
                x: (n - e.dx) / e.kx,
                y: (o - e.dy) / e.ky
            };
            return i.unproject(r)
        }
      }
      const satellite_layer = L
        .tileLayer('https://maps.izurvive.com/maps/CH-Top/1.18.0/tiles/{z}/{x}/{y}.png', {
          tms: !0,
          minZoom: 1,
          maxZoom: 10,
          noWrap: !0,
          bounds: L.latLngBounds([-85, -180], [85, 180])
        })
      const map = L
        .map(`${this.mapId}`, {
          layers: [satellite_layer]
        })
        .setView([0, 0], 1.5)
      // map.zoomControl.remove()
      const layer_control = L.control.layers({
        'Satellite': satellite_layer,
      }, {}).addTo(map)
      this.map = map
      this.layer_control = layer_control
    }
  }
  
</script>

<style scoped lang="scss">

</style>

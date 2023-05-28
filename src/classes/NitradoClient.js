
export class NitradoClient {

  constructor (apiKey) {
    this.apiKey = apiKey
  }

  selectLogFilesPathMap (gameserverDto, logFilesDto) {
    return logFilesDto.map(logFileDto => {
      const split1 = this.selectFilesDownloadPath(gameserverDto).split('/')
      split1.pop()
      const prefix = split1.join('/')
      const split2 = logFileDto.split('/')
      split2.reverse()
      split2.pop()
      split2.reverse()
      const appendix = split2.join('/')
      return `${prefix}/${appendix}`
    })
  }

  selectFilesDownloadPath (gameserverDto) {
    return gameserverDto.data.gameserver.game_specific.path
  }

  selectLogFilesDto (gameserverDto) {
    return gameserverDto.data.gameserver.game_specific.log_files
  }

  getFilesDownloadDto (serviceDto, fileDto) {

    return this.request(`/services/${serviceDto.id}/gameservers/file_server/download?file=${fileDto}`)

  }

  getGameserverDto (serviceDto) {
    return this.request(`/services/${serviceDto.id}/gameservers`)
  }

  getServicesDto () {
    return this.request(`/services`)
  }

  request (resource) {
  
    const options = {
      hostname: 'api.nitrado.net',
      port: 443,
      path: resource,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    }

    console.log(`#= REQUESTING: ${resource}`)

    return fetch(`https://${options.hostname}${options.path}`, options)

  }

  // async requestFile (url) {
  //   return new Promise((resolve, reject) => {

  //   const transformStream = new stream.Transform({ objectMode: true })
  //   let transformed = []

  //   transformStream._transform = function (chunk, encoding, done) {
  //     let stringData = chunk.toString()
  //     if (this._invalidLine) {
  //       stringData = `${this._invalidLine}${stringData}`
  //     }
  //     const objectLines = stringData.split('\n')
  //     this._invalidLine = objectLines.splice(objectLines.length - 1, 1)[0]
  //     this.push(objectLines.map(objectLine => {
  //       const time = objectLine.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g)
  //       const playersMatch = objectLine.match(/Player\s[\"|\'][a0-z9\s\/\-\_]*[\"|\']/g)
  //       const players = playersMatch ? playersMatch.map(player => {
  //         const split = player.split('\"')[1]
  //         return `${split}`
  //       }) : []
  //       const killed = objectLine.match(/\skilled\s/g) ? true : false
  //       const hit = objectLine.match(/\shit\s/g) ? true : false
  //       const pveMatch = objectLine.match(/by[\s]{1,2}[a0-z9\/\-\_\s]*/g)
  //       const isPve = (pveMatch && players.length < 2)
  //       const pve = isPve ? (
  //         pveMatch[0].match(/by\s\swith\s/g) ? pveMatch[0].split('by  with ').join('') : (
  //          pveMatch[0].match(/\sinto\s/g) ? pveMatch[0].split(' into ').join('').split('by ').join('') : (
  //            pveMatch[0].match(/explosion/g) ? objectLine.split('explosion').pop().trim().split(/[(|)]/g).join('') : pveMatch[0].split('by ').join('')
  //          )
  //         )
  //       ) : false
  //       const item = [objectLine.match(/\)\swith\s[a0-z9\-\s]*/g)]
  //         .filter(x => x !== null)
  //         .reduce((a,c) => c, [])
  //         .map(match => match.split(') with ').join(''))
  //         .map(string => string.split(' from ')[0])
  //         .reduce((a,c) => c, false)
  //       const melee = [objectLine.match(/\(Melee[a0-z9\_]*\)/g)]
  //         .filter(x => x !== null)
  //         .reduce((a,c) => c, [])
  //         .map(match => match.split(/[(|)]/g).join(''))
  //         .reduce((a,c) => c, false)
  //       const headshot = [objectLine.match(/Head\([0-9]*\)/g)]
  //         .filter(x => x !== null)
  //         .reduce((a,c) => c, [])
  //         .reduce((a,c) => true, false)
  //       const brainshot = [objectLine.match(/Brain\([0-9]*\)/g)]
  //         .filter(x => x !== null)
  //         .reduce((a,c) => c, [])
  //         .reduce((a,c) => true, false)
  //       const meters = [objectLine.match(/from\s[0-9]*\.[0-9]*\smeters/g)]
  //         .filter(x => x !== null)
  //         .reduce((a,c) => c, [])
  //         .map(meters => meters.split(' meters').join('').split('from ').join(''))
  //       const coords = [objectLine.match(/pos=<[0-9]*.[0-9]*,\s[0-9]*.[0-9]*,\s/g)]
  //         .filter(x => x !== null)
  //         .reduce((a,c) => c, [])
  //         .map(match => {
  //           const coords = match.split('pos=<').join('').split(', ')
  //           coords.pop()
  //           return coords
  //         })
  //         .reduce((a,c) => c, [])
  //       const suicide = objectLine.match(/suicide/g) ? true : false
  //       const unconscious = objectLine.match(/unconscious/g) ? true : false
  //       const reconscious = objectLine.match(/\sconscious/g) ? true : false
  //       const connected = objectLine.match(/is\sconnected/g) ? true : false
  //       const disconnected = objectLine.match(/has\sbeen\sdisconnected/g) ? true : false
  //       return {
  //         disconnected,
  //         connected,
  //         reconscious,
  //         unconscious,
  //         suicide,
  //         coords,
  //         melee,
  //         brainshot,
  //         headshot,
  //         meters,
  //         item,
  //         pve,
  //         killed,
  //         hit,
  //         players,
  //         time,
  //         original: objectLine
  //       }
  //     }))
  //     done()
  //   }

  //   transformStream._flush = function (done) {
  //     if (this._invalidLine) {
  //       this.push([this._invalidLine])
  //     }
  //     this._invalidLine = null
  //     done()
  //   }

  //   transformStream.on('readable', () => {
  //     let lines = null
  //     while (lines = transformStream.read()) {

  //       transformed = [
  //         ...transformed,
  //         ...lines
  //       ]
  //     }
  //   })

  //   const resource = url.split('https://').join('').split('fileserver.nitrado.net').join('')
    
  //   const options = {
  //     hostname: 'fileserver.nitrado.net',
  //     port: 443,
  //     path: resource,
  //     method: 'GET'
  //   }

  //   console.log(`#= REQUESTING: ${resource}`)

  //   const req = https.request(options, (res) => {
  //     let stringified = ``
  //     res.setEncoding('utf8')
  //     res.on('data', (chunk) => {
  //       // console.log('** DATA **')
  //       // console.log(chunk)
  //       stringified = `${stringified}${chunk}`
  //     })
  //     res.on('end', () => {
  //       resolve(transformed)
  //     })
  //     res.pipe(transformStream)
  //   })

  //   req.on('error', (e) => {
  //     reject(e)
  //   })

  //   req.end()

  //   })
  // }

}

// export class NitradoDayZGameserver extends NitradoClient {

//   constructor (apiKey, serviceId) {
//     super(apiKey)
//     this.serviceId = serviceId
//   }

//   async initFeed () {
//     return new Promise((resolve, reject) => {
//     const servicesDto = await this.getServicesDto()
//     const serviceDto = servicesDto.data.services
//       .filter(service => service.id == this.serviceId)
//       .reduce((a,c) => c, null)
//     const gameserverDto = await this.getGameserverDto(serviceDto)
//     const logFilesDto = this.selectLogFilesDto(gameserverDto)
//     const logFilesPathMap = this.selectLogFilesPathMap(gameserverDto, logFilesDto)
//     logFilesPathMap.reverse()
//     let events = []
//     const l = logFilesPathMap.length
//     for (let i = 0; i < l; i++) {
//       const filesDownloadDto = await this.getFilesDownloadDto(serviceDto, logFilesPathMap[i])
//       const logFile = await this.requestFile(filesDownloadDto.data.token.url)
//       events = [
//         ...events,
//         ...logFile
//       ]
//     }
//     resolve(events)
//     })
//   }

// }
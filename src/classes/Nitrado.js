
export class Uint8ArrayToStringsTransformer {

  constructor() {
    this.decoder = new TextDecoder()
    this.lastString = ''
  }

  /**
   * Receives the next Uint8Array chunk from `fetch` and transforms it.
   *
   * @param {Uint8Array} chunk The next binary data chunk.
   * @param {TransformStreamDefaultController} controller The controller to enqueue the transformed chunks to.
   */
  transform(chunk, controller) {
    // console.log('Received chunk %o with %d bytes.', chunk, chunk.byteLength)

    // Decode the current chunk to string and prepend the last string
    const string = `${this.lastString}${this.decoder.decode(chunk)}`

    // Extract lines from chunk
    const lines = string.split(/\r\n|[\r\n]/g)

    // Save last line, as it might be incomplete
    this.lastString = lines.pop() || ''

    // Enqueue each line in the next chunk
    for (const line of lines) {
      controller.enqueue(line)
    }
  }

  /**
   * Is called when `fetch` has finished writing to this transform stream.
   *
   * @param {TransformStreamDefaultController} controller The controller to enqueue the transformed chunks to.
   */
  flush(controller) {
    // Is there still a line left? Enqueue it
    if (this.lastString) {
      controller.enqueue(this.lastString)
    }
  }
  
}

export class NitradoRESTClient {

  constructor (apiKey) {
    this.apiKey = apiKey
  }

  async getServices () {
    const response = await this.request('GET', '/services')
    const servicesDto = await response.json()
    const { services } = servicesDto.data
    return services
  }

  async getGameserver (serviceId) {
    const response = await this.request('GET', `/services/${serviceId}/gameservers`)
    const gameserverDto = await response.json()
    const { gameserver } = gameserverDto.data
    return gameserver
  }

  async getDownload (serviceId, file) {
    const response = await this.request('GET', `/services/${serviceId}/gameservers/file_server/download?file=${file}`)
    const downloadDto = await response.json()
    const download = downloadDto.data
    return download
  }

  async getFile (url) {
    const response = await this.requestFile(url)
    const file = await response.text()
    return file
  }

  async getFileList (serviceId, dir) {
    const response = await this.request('GET', `/services/${serviceId}/gameservers/file_server/list${dir ? `?dir=${dir}` : ``}`)
    const fileListDto = await response.json()
    const { entries } = fileListDto.data
    return entries
  }

  async request (method, path) {
    const options = {
      hostname: 'api.nitrado.net',
      port: 443,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    }
    const response = await fetch(`https://${options.hostname}${options.path}`, options)
    return response
  }

  async requestFile (url) {
    const path = url.split('https://').join('').split('fileserver.nitrado.net').join('')
    const options = {
      hostname: 'fileserver.nitrado.net',
      port: 443,
      path,
      method: 'GET'
    }
    const response = await fetch(url, options)
    return response
  }

}

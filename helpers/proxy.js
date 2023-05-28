const http = require('http')
const https = require('https')
const url = require('url')

const proxy = http.createServer((req, res) => {

    const request = url.parse(req.url)

    const options = {
        host:    'static.wikia.nocookie.net',
        port:    443,
        path:    request.path,
        method:  req.method,
        headers: {},
    }

    console.log(`${options.method} https://${options.host}${options.path}`)

    const backend_req = https.request(options, (backend_res) => {

        res.writeHead(backend_res.statusCode, backend_res.headers)

        backend_res.on('data', (chunk) => {
            res.write(chunk)
        })

        backend_res.on('end', () => {
            res.end()
        })

    })

    req.on('data', (chunk) => {
        backend_req.write(chunk)
    })

    req.on('end', () => {
        backend_req.end()
    })

})

proxy.listen(process.env.PORT, () => console.log(`listening ${process.env.PORT}`))
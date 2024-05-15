const hls = require('hls-server')
const fs = require('fs')
const server = require('./server')

const HLSServer = new hls(server,{
    
})
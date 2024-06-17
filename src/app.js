const cluster = require('cluster')
const os = require('os')
const express = require('express')
const expressApp = require('./hls_server/server')
const path = require('path')

const cpus = os.cpus();

if (cpus.length > 0) {
    
}

expressApp.use(express.static(path.join(__dirname,'template')))
expressApp.use(express.static(path.join(__dirname,'utils')))
expressApp.use(express.static(path.join(__dirname,'uploads')))

const PORT = 3000

expressApp.listen(PORT,()=>{
    console.log("listening on port",PORT)
})
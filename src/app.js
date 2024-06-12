const cluster = require('cluster')
const os = require('os')
const expressApp = require('./hls_server/server')

const cpus = os.cpus();

if (cpus.length > 0) {
    
}

const PORT = 3000

expressApp.listen(PORT,()=>{
    console.log("listening on port",PORT)
})
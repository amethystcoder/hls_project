const sourcer = require('./getSourceName')

function parseSourceAndStatus(data) {
    for (let index = 0; index < data.length; index++) {
        data[index].status = "red"
        if (data[index].status == "active")  data[index].source = "green"
        if (data[index].status == "paused") data[index].source = "darkgray"
        data[index].source = sourcer(data[index].main_link) 
    }
    return data
}

module.exports = parseSourceAndStatus
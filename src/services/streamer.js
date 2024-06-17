const fs = require('fs')
const fsPromises = fs.promises

const streamVideoFile = (fileId,type,start)=>{
    //parse the start argument if not done already
    const chunkSize = 1024 * 1000 * 1000 //Take 1mb from the videofile
    const videoSize = fs.statSync(``).size
    //start and end: ranges of the video file to cut out
    const end = Math.min(start + chunkSize, videoSize) 

    let videoStream = fs.createReadStream(``,{
        start:start,end:end
    })

    const contentLength = end-start
    const headers = {
        "Accept-Ranges":"bytes",
        "Content-Type":"video/mp4",
        "Content-Length":`${contentLength}`,
        "Content-Range":`bytes ${start}-${end}/${videoSize}`
    } 
    return {headers,videoStream}
}

const getHlsDataFile = async (id)=>{
    //write code to get file name.
    let fileName;

    //check if the file exists
    
    //read contents of the m3u8 file and return
    let fileContents = await fsPromises.readFile(`../utils/split_vid/videos/${id}`)
    fileContents = fileContents.toString("utf-8")
    return fileContents
}

module.exports = {
    streamVideoFile,getHlsDataFile
}
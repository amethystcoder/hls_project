const fluentFfmpeg = require('fluent-ffmpeg')
const Ffmpeg = require('@ffmpeg-installer/ffmpeg')

fluentFfmpeg.setFfmpegPath(Ffmpeg.path)

let fileName = 'Alan_Walker_-_Faded' //variable data...

fluentFfmpeg(`../hls_files/${fileName}.mp4`, {timeout: 43200}).addOptions([
    '-profile:v baseline',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 10',
    '-hls_list_size 0',
    '-f hls'
]).output(`videos/${fileName}.m3u8`)
.on('error', (err) => {
    console.log('an error occured processing the file.\n err:',err)
}).on('progress', (progress) => {
    console.log(`progress: ${progress.frames } frames`)
}).on('end', () => {
    console.log('processing completed')
}).run()
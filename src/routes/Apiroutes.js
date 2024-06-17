let express = require('express')
const router = express.Router()
const HlsConverter = require("../utils/split_vid/ffmpeg")
const sources = require("../sources/sources")
const getSourceName = require("../utils/getSourceName")
const DB = require('../db/DBs')
const generateUniqueId = require('../utils/generateUniqueId')
const Streamer = require('../services/streamer')

router.get("/health",(req,res)=>{
    try {
        res.json({data:"ok"})
    } catch (error) {
        res.json({error})
    }
})

router.post("/convert/hls",(req,res)=>{
    try {
        let link = req.body.link
        let linkSource = getSourceName(link)
        if (!linkSource || linkSource == '') throw EvalError("Incorrect link provided. Check that the link is either a GDrive, Yandex, Box, OkRu or Direct link")
        const convert = HlsConverter.createHlsFiles(link)
        let result = DB.hlsLinksDB.createNewHlsLink()//generateHlsLinkData
        res.status(202).send({message:"successful"})
    } catch (error) {
        res.json({error})
    }
})

router.post("/link/create",(req,res)=>{
    try {
        const mainLink = req.body.mainLink
        let linkSource = getSourceName(mainLink)
        req.body.type = linkSource
        req.body.slug = generateUniqueId(50)
        if (!linkSource || linkSource == '') throw EvalError("Incorrect link provided. Check that the link is either a GDrive, Yandex, Box, OkRu or Direct link")
        DB.linksDB.createNewLink(req.body)
    } catch (error) {
        res.json({error})
    }
})

router.get("/login", async (req,res)=>{
    try {
        //const username = req.body.username
        //const password = req.body.password
        let users = await DB.usersDB.getAllusers()
        for (let index = 0; index < users.length; index++) {

        }
        console.log(users)
        res.json({users:users})
    } catch (error) {
        res.json({error})
    }
})

router.get("/stream/:videoid",async (req,res)=>{
    try {
        //write code to get this data from the db
        let range = req.headers.range
        const videoId = req.params.videoid
        if (!range) res.status(400).send("Cannot Stream. Range not included in headers")
        range = Number(range.replace(/\D/g,""));
        let streamingData = Streamer.streamVideoFile(req,res,videoId,"",range)//we need to be able to determine the kind of source
        res.writeHead(206,streamingData.headers)
        streamingData.videoStream.pipe(res)
    } catch (error) {
        res.json({error})
    }
})

router.get("/hls/:videoid",async (req,res)=>{
    try {
        let hlsStreamData = await Streamer.getHlsDataFile(req.params.videoid)
        res.status(200).send(hlsStreamData)
    } catch (error) {
        res.json({error})
    }
})

router.post("/server/create",(req,res)=>{
    try {
        
    } catch (error) {
        res.json({error})
    }
})

router.post("/p2pstats/create",(req,res)=>{
    try {
        
    } catch (error) {
        res.json({error})
    }
})

router.post("/video/upload",(req,res)=>{
    try {
        
    } catch (error) {
        res.json({error})
    }
})

router.post("/hls/bulkconvert",(req,res)=>{
    try {
        
    } catch (error) {
        res.json({error})
    }
})

router.post("/ads/create",(req,res)=>{
    try {
        
    } catch (error) {
        res.json({error})
    }
})


module.exports = router;
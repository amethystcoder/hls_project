let express = require('express')
const router = express.Router()
const multer = require('multer')
const HlsConverter = require("../utils/split_vid/ffmpeg")
const sources = require("../sources/sources")
const getSourceName = require("../utils/getSourceName")
const DB = require('../db/DBs')
const generateUniqueId = require('../utils/generateUniqueId')
const Streamer = require('../services/streamer')
//const bcrypt = require('bcrypt')

const upload = multer({dest: "../uploads/"})

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

router.post("/link/create",upload.fields([
    {name:'subtitles',maxCount:1},{name:'preview_img',maxCount:1}]),async (req,res)=>{
    try {
        const {title,main_link,alt_link,subtitles,preview_img} = req.body
        console.log(req.files)
        console.log(req.body)
        let linkSource = getSourceName(main_link)
        req.body.type = linkSource
        req.body.slug = generateUniqueId(50)
        if (!linkSource || linkSource == '') throw EvalError("Incorrect link provided. Check that the link is either a GDrive, Yandex, Box, OkRu or Direct link")
        let newLinkCreate = await DB.linksDB.createNewLink(req.body)
        res.status(201).json({success:true,message:newLinkCreate})
    } catch (error) {
        res.json({error})
    }
})

router.get("/login", async (req,res)=>{
    try {
        const username = req.body.username
        const password = req.body.password
        let users = await DB.usersDB.getAllusers()
        for (let index = 0; index < users.length; index++) {
            if (users[index].username == username) {
                
            }
        }
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
        let videoid = req.params.videoid
        let splitVid = videoid.split(".")
        let vidExt = splitVid[splitVid.length - 1]
        let hlsStreamData;
        if (vidExt && vidExt == "ts") {
            hlsStreamData = await Streamer.getHlsDataFile(videoid,true)
        }
        else{
            hlsStreamData = await Streamer.getHlsDataFile(videoid)
        }
        res.status(200).send(hlsStreamData)
    } catch (error) {
        res.json({error})
    }
})

router.post("/server/create",async (req,res)=>{
    try {
        const {name, domain, type} = req.body
        let createServer = await DB.serversDB.createNewServer({name,domain,type})
        res.status(201).json({success:true,message:createServer})
    } catch (error) {
        res.json({error})
    }
})

router.put("/server/edit/:id",async (req,res)=>{
    try {
        const id = req.params.id
        const {name, domain, type} = req.body
        let updateServer = await DB.serversDB.updateUsingId(id,["name","domain","type"],[name,domain,type])
        res.status(201).json({success:true})
    } catch (error) {
        res.json({error})
    }
})

router.post("/p2pstats/create",(req,res)=>{
    try {
        const {upload,download,peers} = req.body
        const ipAddress = (req.ip 
        || req.socket.remoteAddress // incase `trust proxy did not work for some reason` 
        || req.headers['x-forwarded-for']);
        const country = "";//get from client
        const device = "";//get from client
        const date = new Date().toUTCString();
        DB.p2pStatsDB.createNewP2PData({upload,download,peers,country,date,device,ipAddress})
    } catch (error) {
        res.json({error})
    }
})

router.post("/video/upload",async (req,res)=>{
    try {
        
    } catch (error) {
        res.json({error})
    }
})

router.post("/hls/bulkconvert",async (req,res)=>{
    try {
        //Attempt to finish up later
        let servers = req.body.serverIds.split(',')
        let links = req.body.links.split(',')
        let availableServers = await DB.serversDB.getServerUsingType("hls")
        availableServers
        for (let index = 0; index < servers.length; index++) {
            let linkSource = getSourceName(link)
            if (!linkSource || linkSource == '') throw EvalError("Incorrect link provided. Check that the link is either a GDrive, Yandex, Box, OkRu or Direct link")
            const convert = HlsConverter.createHlsFiles(link)
            let result = DB.hlsLinksDB.createNewHlsLink()//generateHlsLinkData
        }
        res.status(202).send({message:"successful"})
    } catch (error) {
        res.json({error})
    }
})

router.post("/ads/create",async (req,res)=>{
    try {
        const {title,type} = req.body
        await DB.adsDB.createNewAd({title,type})
    } catch (error) {
        res.json({error})
    }
})

router.put("/ads/edit/:id",async (req,res)=>{
    try {
        const id = req.params.id
        const {title,type} = req.body
        await DB.adsDB.updateUsingId(id,["title","type"],[title,type])
    } catch (error) {
        res.json({error})
    }
})

router.post("/vast_ads/create",async (req,res)=>{
    try {
        /* const {title,type} = req.body
        DB.adsDB.createNewAd({title,type}) */
    } catch (error) {
        res.json({error})
    }
})

router.post("/bulk",async (req,res)=>{
    try {
        const {links,email} = req.body
        console.log(req.body)
    } catch (error) {
        res.json({error})
    }
})


module.exports = router;
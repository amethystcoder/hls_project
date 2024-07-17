let express = require('express')
const router = express.Router()
const multer = require('multer')
const HlsConverter = require("../utils/split_vid/ffmpeg")
const sources = require("../sources/sources")
const getSourceName = require("../utils/getSourceName")
const DB = require('../db/DBs')
const generateUniqueId = require('../utils/generateUniqueId')
const Streamer = require('../services/streamer')
const bcrypt = require('bcryptjs')

const upload = multer({dest: "/uploads/"})

router.get("/health",(req,res)=>{
    try {
        res.json({data:"ok"})
    } catch (error) {
        res.json({error})
    }
})

router.post("/convert/hls",(req,res)=>{
    try {
        if (req.session.username) {
            let link = req.body.link
            let linkSource = getSourceName(link)
            if (!linkSource || linkSource == '') throw EvalError("Incorrect link provided. Check that the link is either a GDrive, Yandex, Box, OkRu or Direct link")
            const convert = HlsConverter.createHlsFiles(link)
            let result = DB.hlsLinksDB.createNewHlsLink()//generateHlsLinkData
            res.status(202).send({success:true,message:"successful"})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/link/create",upload.fields([
    {name:'subtitles',maxCount:1},{name:'preview_img',maxCount:1}]),async (req,res)=>{
    try {
        if (req.session.username) {
            const {title,main_link,alt_link} = req.body
            const subtitles = req.files.subtitles ? req.files.subtitles[0].path : ""
            const preview_img = req.files.preview_img ? req.files.preview_img[0].path : ""
            //Write code to save files to upload folder and to also take care of the undefined error problem
            let linkSource = getSourceName(main_link)
            let type = linkSource
            let slug = generateUniqueId(50)
            let data = {title,main_link,alt_link,subtitles:subtitles,preview_img:preview_img,type,slug}
            if (!linkSource || linkSource == '') throw EvalError("Incorrect link provided. Check that the link is either a GDrive, Yandex, Box, OkRu or Direct link")
            let newLinkCreate = await DB.linksDB.createNewLink(data)
            res.status(201).json({success:true,message:newLinkCreate})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/login", async (req,res)=>{
    try {
        const username = req.body.username.toLowerCase()
        const password = req.body.password
        let loggedIn = false
        let userExists = false
        let users = await DB.usersDB.getAllusers()
        for (let index = 0; index < users.length; index++) {
            if (users[index].username == username) {
                userExists = true
                loggedIn = await bcrypt.compare(password,users[index].password)
                if (loggedIn){
                    req.session.username = users[index].username
                    req.session.id = users[index].id
                    req.session.requestsMade = 0
                    req.session.loginTime = Date.now()
                    break;
                }
            }
        }
        res.json({success:true,userExists:userExists,loggedIn:loggedIn})
    } catch (error) {
        res.json({error})
    }
})

router.get("/logout",async (req,res)=>{
    try {
        req.session.destroy()
        res.status(200).send("successfully logged out")
    } catch (error) {
        res.json({error})
    }
})

router.get("/stream/:videoid",async (req,res)=>{
    try {
        if (req.session.username) {
            //get all required data from headers and check if they are correct
            let range = req.headers.range
            const videoId = req.params.videoid
            if (!range) res.status(400).send("Cannot Stream. Range not included in headers")

            //get link for streaming using id
            const linkData = await DB.linksDB.getLinkUsingId(videoId)
            let source = getSourceName(linkData[0].main_link)
            
            //set headers
            range = Number(range.replace(/\D/g,""));

            let streamingData = Streamer.streamVideoFile(req,res,videoId,source,range)//we need to be able to determine the kind of source
            res.writeHead(206,streamingData.headers)
            streamingData.videoStream.pipe(res)
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.get("/hls/:videoid",async (req,res)=>{
    try {
        if (req.session.username) {
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
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/server/create",async (req,res)=>{
    try {
        if (req.session.username) {
            const {name, domain, type} = req.body
            let createServer = await DB.serversDB.createNewServer({name,domain,type})
            res.status(201).json({success:true,message:createServer})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.put("/server/edit/:id",async (req,res)=>{
    try {
        if (req.session.username) {
            const id = req.params.id
            const {name, domain, type} = req.body
            let updateServer = await DB.serversDB.updateUsingId(id,["name","domain","type"],[name,domain,type])
            res.status(201).json({success:true})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/p2pstats/create",(req,res)=>{
    try {
        if (req.session.username) {
            const {upload,download,peers} = req.body
            const ipAddress = (req.ip 
            || req.socket.remoteAddress // incase `trust proxy did not work for some reason` 
            || req.headers['x-forwarded-for']);
            const country = "";//get from client
            const device = "";//get from client
            const date = new Date().toUTCString();
            DB.p2pStatsDB.createNewP2PData({upload,download,peers,country,date,device,ipAddress})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
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
        if (req.session.username) {
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
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/ads/create",async (req,res)=>{
    try {
        if (req.session.username) {
            const {title,type} = req.body
            let createAd = await DB.adsDB.createNewAd({title,type})
            res.status(201).send({message:"successful"})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.put("/ads/edit/:id",async (req,res)=>{
    try {
        if (req.session.username) {
            const id = req.params.id
            const {title,type} = req.body
            let EditAd = await DB.adsDB.updateUsingId(id,["title","type"],[title,type])
            res.status(201).send({message:"successful"})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.delete("/ads/:id",async (req,res)=>{
    try {
        if (req.session.username) {
            const id = req.params.id
            let deleteAd = await DB.adsDB.deleteUsingId(id);
            res.status(201).send({message:"successful"})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/vast_ads/create",async (req,res)=>{
    try {
        if (req.session.username) {
            const {title,type,xml_file,start_offset} = req.body
            DB.adsDB.createNewAd({title,type,xml_file,start_offset})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/bulk",async (req,res)=>{
    try {
        if (req.session.username) {
            const {links,email} = req.body
            let results = []
            console.log(req.body)
            for (let index = 0; index < links.length; index++) {
                data = {
                    main_link:links[index],
                    title:"untitled"+Date.now(),
                    slug:generateUniqueId(50),
                    type:getSourceName(links[index])
                }
                results.push(await DB.linksDB.createNewLink(data)) 
            }
            res.status(202).send({success:true,message:results})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/proxies/create",async (req,res)=>{
    try {
        if (req.session.username) {
            let results = await DB.proxyStore.AddProxies(req.body.proxies)
            res.status(202).send({success:true,message:results})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.delete("/proxies/delete",async (req,res)=>{
    try {
        if (req.session.username) {
            let results = await DB.proxyStore.removeProxies(req.body.proxy)
            res.status(202).send({success:true,message:results})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.post("/brokenproxies/create",async (req,res)=>{
    try {
        if (req.session.username) {
            let results = await DB.proxyStore.AddBrokenProxies(req.body.proxies)
            res.status(202).send({success:true,message:results})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})

router.delete("/brokenproxies/delete",async (req,res)=>{
    try {
        if (req.session.username) {
            let results = await DB.proxyStore.removeBrokenProxies(req.body.proxy)
            res.status(202).send({success:true,message:results})
        } else {
            res.status(401).send({success:false,message:"unauthorized"})
        }
    } catch (error) {
        res.json({error})
    }
})


module.exports = router;
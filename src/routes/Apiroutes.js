let express = require('express')
const router = express.Router()
const HlsConverter = require("../utils/split_vid/ffmpeg")
const sources = require("../sources/sources")
const getSourceName = require("../utils/getSourceName")
const DB = require('../db/DBs')
const generateUniqueId = require('../utils/generateUniqueId')

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
        let users = DB.usersDB.getAllusers()
        console.log(users)
        for (let index = 0; index < users.length; index++) {

        }
        res.json({users})
    } catch (error) {
        res.json({error})
    }
})

router.post("/server/create",(req,res)=>{

})

router.post("/p2pstats/create",(req,res)=>{
    
})

router.post("/video/upload",(req,res)=>{
    
})

router.post("/hls/bulkconvert",(req,res)=>{
    
})

router.post("/ads/create",(req,res)=>{
    
})


module.exports = router;

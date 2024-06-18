/**
 * This module deals with the routes that describe the client side 
 * and the templates to display
 */

const expressapp = require('express')
const router = expressapp.Router({mergeParams:true,strict:false,caseSensitive:true})
const DBs = require('../db/DBs')

router.get('/login',(req,res)=>{
    try {
        res.render('../template/login')
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/dashboard',(req,res)=>{
    try {
        res.render('../template/dashboard')
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/settings',(req,res)=>{
    try {
        res.render('../template/settings')
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/settings/:section',(req,res)=>{
    try {
        let section = req.params.section
        switch (section) {
            case "video":
                res.render('../template/settings/video')
                break;
            case "general":
                res.render('../template/settings/general')
                break;
            case "proxy":
                res.render('../template/settings/proxy')
                break;
            case "gdriveAuth":
            res.render('../template/settings/gdriveAuth')
            break;
            default:
                res.render('../template/settings')
                break;
        }
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})


//video player
router.get('/video',async (req,res)=>{
    try {
        let routeData = {}
        let player = await DBs.settingsDB.getConfig("player")
        let slug = req.params.slug
        console.log(player[0].var)
        res.render('../template/players/plyr') //create code to determine the kind of player to use based on config
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/links/:type',(req,res)=>{
    try {
        res.render('../template/links',{
            type:req.params.type
        })
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/link/new',(req,res)=>{
    try {
        let title = "New Link"
        res.render('../template/linkcreate',{
            title:title
        })
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/link/edit/:linkid',async (req,res)=>{
    try {
        const linkId = req.params.linkid
        const linkData = DBs.linksDB.getLinkUsingId(linkId)
        let title = `Edit link ${linkId}`
        res.render('../template/linkcreate',{
            title:title,
            data:linkData[0]
        })
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/servers',(req,res)=>{
    try {
        res.render('../template/servers')
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/ads',(req,res)=>{
    try {
        res.render('../template/ads')
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/hls/:type',(req,res)=>{
    try {
        res.render('../template/hls',{
            type:req.params.type
        })
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/bulk',(req,res)=>{
    try {
        res.render('../template/bulk')
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})



module.exports = router
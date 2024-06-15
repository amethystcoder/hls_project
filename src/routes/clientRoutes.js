/**
 * This module deals with the routes that describe the client side 
 * and the templates to display
 */

const expressapp = require('express')
const router = expressapp.Router({mergeParams:true,strict:false,caseSensitive:true})
const AppSettings = require('../db/settingsDB')

router.get('/login',(req,res)=>{
    try {
        res.render('../template/login')
    } catch (error) {
        res.render('../template/error')
    }
})

router.get('/dashboard',(req,res)=>{
    try {
        res.render('../template/dashboard')
    } catch (error) {
        res.render('../template/error')
    }
})

router.get('/settings',(req,res)=>{
    try {
        res.render('../template/settings')
    } catch (error) {
        res.render('../template/error')
    }
})

router.get('/settings/:section',(req,res)=>{
    try {
        let section = req.params.section
        switch (section) {
            case "video":
                res.render('../template/sections/settings/video')
                break;
            case "general":
                res.render('../template/sections/settings/general')
                break;
            case "proxy":
                res.render('../template/sections/settings/proxy')
                break;
            default:
                res.render('../template/settings')
                break;
        }
        res.render('../template/dashboard')
    } catch (error) {
        res.render('../template/error')
    }
})


//video player
router.get('/video/:slug',(req,res)=>{
    try {
        let routeData = {}
        let player = AppSettings.getConfig("player")
        let slug = req.params.slug
        res.render('../template/players/videojs') //create code to determine the kind of player to use based on config
    } catch (error) {
        res.render('../template/error')
    }
})



module.exports = router
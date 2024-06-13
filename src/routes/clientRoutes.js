/**
 * This module deals with the routes that describe the client side 
 * and the templates to display
 */

const expressapp = require('express')
const router = expressapp.Router({mergeParams:true,strict:true,caseSensitive:true})
const AppSettings = require('../db/settingsDB')

router.get('/login',(req,res)=>{
    try {
        res.render('../template/login')
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
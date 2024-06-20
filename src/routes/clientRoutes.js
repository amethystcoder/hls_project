/**
 * This module deals with the routes that describe the client side 
 * and the templates to display
 */

const expressapp = require('express')
const router = expressapp.Router({mergeParams:true,strict:false,caseSensitive:true})
const DBs = require('../db/DBs')
const parseSourceAndStatus = require('../utils/sourceStatusParser')

router.get('/login',(req,res)=>{
    try {
        res.render('../template/login')
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/dashboard',async (req,res)=>{
    try {
        let totalLinks = await DBs.linksDB.getAllLinks(true)
        let totalServers = await DBs.serversDB.getAllservers(true)
        let totalDriveAccounts = await DBs.driveAuthDB.getAlldrive_auth(true)
        let analytics = {
            totalLinks: totalLinks[0]["COUNT(*)"],
            totalServers: totalServers[0]["COUNT(*)"],
            totalDriveAccounts: totalDriveAccounts[0]["COUNT(*)"]
        }
        let links = parseSourceAndStatus(await DBs.linksDB.getActiveLinks())
        let totalViews = 0
        for (let index = 0; index < links.length; index++) {
            totalViews += links[index].views
        }
        analytics.totalViews = totalViews
        res.render('../template/dashboard',{
            analytics:analytics,
            links:links
        })
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

router.get('/settings/:section',async (req,res)=>{
    try {
        let section = req.params.section
        let acquiredSettings = await DBs.settingsDB.getAllsettings()
        let settings = {}
        for (let index = 0; index < acquiredSettings.length; index++) {
            settings[acquiredSettings[index].config] = acquiredSettings[index].var
        }
        switch (section) {
            case "video":
                res.render('../template/settings/video',{
                    settings
                })
                break;
            case "general":
                res.render('../template/settings/general',{
                    settings
                })
                break;
            case "proxy":
                res.render('../template/settings/proxy',{
                    settings
                })
                break;
            case "gdriveAuth":
            res.render('../template/settings/gdriveAuth',{
                settings
            })
            break;
            default:
                res.render('../template/settings',{
                    settings
                })
                break;
        }
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})


//video player
router.get('/video/:slug',async (req,res)=>{
    try {
        let routeData = {}
        let player = await DBs.settingsDB.getConfig("player")
        let slug = req.params.slug
        res.render(`../template/players/${player[0].var}`,{
            slug:slug
        }) //determine the kind of player to use based on config
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/links/:type',async (req,res)=>{
    try {
        let type = req.params.type
        let linkData = []
        if (type == "all") linkData = parseSourceAndStatus(await DBs.linksDB.getAllLinks())
        if (type == "active") linkData = parseSourceAndStatus(await DBs.linksDB.getActiveLinks())
        if (type == "paused") linkData = parseSourceAndStatus(await DBs.linksDB.getPausedLinks())
        if (type == "broken") linkData = parseSourceAndStatus(await DBs.linksDB.getBrokenLinks())
        res.render('../template/links',{
            type:type,linkData:linkData
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

router.get('/servers',async (req,res)=>{
    try {
        let serverData = await DBs.serversDB.getAllservers()
        res.render('../template/servers',{
            servers:serverData
        })
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

router.get('/hls/:type',async (req,res)=>{
    try {
        let hlsData = [];
        let type = req.params.type
        if (type == "all") hlsData = await DBs.hlsLinksDB.getAllhls_links(false,true)
        if (type == "bulk") {
            let links = await DBs.linksDB.getAllLinks()
            let hlsLinks = await DBs.hlsLinksDB.getAllhls_links()
            let linkIds = hlsLinks.map(hlsLink => hlsLink.link_id)
            hlsData = links.filter(link=>!linkIds.includes(link.id))
        }
        if (type == "failed") hlsData = await DBs.hlsLinksDB.getFailedhls_links(false,true)
        if (type == "broken") {
            let links = await DBs.linksDB.getBrokenLinks()
            let hlsLinks = await DBs.hlsLinksDB.getAllhls_links()
            let linkIds = hlsLinks.map(hlsLink => hlsLink.link_id)
            hlsData = links.filter(link=>linkIds.includes(link.id))
        }
        res.render('../template/hls',{
            type,hlsData
        })
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})

router.get('/bulk',async (req,res)=>{
    try {
        //get the emails of all active auths
        let driveEmails = await DBs.driveAuthDB.getDistinct("email","status=true")
        res.render('../template/bulk',{
            driveEmails
        })
    } catch (error) {
        res.render('../template/error',{
            error
        })
    }
})


module.exports = router
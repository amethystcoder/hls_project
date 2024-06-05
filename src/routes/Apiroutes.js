let express = require('express')
const router = express.Router()

router.get("/health",(req,res)=>{
    try {
        res.json({data:"ok"})
    } catch (error) {
        res.json({error})
    }
})

router.post("convert/hls",(req,res)=>{})

module.exports = router;

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
//We need to also add rate limiting to this app

//set a middleware to redirect on new configuration
/* app.use((req,res,next)=>{
    if (rate.isExceeded) {
        
    }
    //we need to get a way to know if there is a new configuration
}) */

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.set('view engine','ejs')
app.set('trust proxy', true)

const apiRoutes = require('../routes/Apiroutes');
app.use('/api',apiRoutes);

const clientRoutes = require('../routes/clientRoutes')
app.use('/',clientRoutes)


module.exports = app
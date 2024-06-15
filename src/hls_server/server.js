const express = require('express')
const app = express()
require('dotenv').config()
//We need to also add rate limiting to this app

//set a middleware to redirect on new configuration
/* app.use((req,res,next)=>{
    if (rate.isExceeded) {
        
    }
    //we need to get a way to know if there is a new configuration
}) */

app.set('view engine','ejs')

const apiRoutes = require('../routes/Apiroutes');
app.use('/api',apiRoutes);

const clientRoutes = require('../routes/clientRoutes')
app.use('/',clientRoutes)


module.exports = app
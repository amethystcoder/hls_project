const googleApis = require('googleapis')
const axios = require('axios')
const env = require('dotenv').config()
const fs = require('fs')

const email = "";
const clientId = "";
const clientSecret = "";
const redirectUri = "";//Where google would redirect back to after authenticating you

const OauthClient = new googleApis.google.auth.OAuth2(clientId,clientSecret,redirectUri)

let drive = googleApis.google.drive({
    version:"v2",
    auth:OauthClient
})

const generateGoogleAuthUrl = ()=>{
    return OauthClient.generateAuthUrl({
        scope:["https://googleapis.com/auth/drive"],
        access_type:"offline",
        include_granted_scopes:true
    })
}

/**
 * 
 * @param {string} id 
 */
const getFileData = async (id) =>{
    let fileData = await drive.files.get({fileId:id})
    return fileData
}

/**
 * 
 * @param {string} fileId 
 */
const downloadFile = async (fileId) =>{
    let destination = fs.createWriteStream('../upload')
    return new Promise((resolve,reject)=>{
        drive.files.get({fileId:id,alt:"media"},{responseType:'stream'},(err,res)=>{
            res.data.on('end',()=>{
                console.log("done")
                resolve(res)
            }).on('error',(err)=>{
                console.log(err)
                reject(err)
            }).pipe(destination)
        })
    })
}

/**
 * 
 * @param {string} fileId 
 */
const downloadStreamFile = async (fileId,res) =>{
    //let destination = fs.createWriteStream('../upload')
    return new Promise((resolve,reject)=>{
        drive.files.get({fileId:id,alt:"media"},{responseType:'stream'},(err,response)=>{
            response.data.on('end',()=>{
                console.log("done")
                resolve(response)
            }).on('error',(err)=>{
                console.log(err)
                reject(err)
            }).pipe(res)
        })
    })
}

/**
 * gets the source of the 
 */
const getSource = async (url,id) =>{
    const res = await axios({
        method: 'get',
        url: ''
    })
}

module.exports = {
    getSource,downloadFile,getFileData,generateGoogleAuthUrl,downloadStreamFile
}
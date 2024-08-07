const googleApis = require('googleapis')
const axios = require('axios')
const env = require('dotenv').config()
const fs = require('fs')

const email = "";
const clientId = "";
const clientSecret = "";
const redirectUri = "";//Where google would redirect back to after authenticating you

const generateOauth = (clientId,clientSecret,redirectUri)=>{
    return new googleApis.google.auth.OAuth2(clientId,clientSecret,redirectUri)
}

/**
 * 
 * @param {googleApis.Common.OAuth2Client} authclient the client generated by calling `generateOauth`
 */
const initiateDrive = (authclient)=>{
    return googleApis.google.drive({
        version:"v2",
        auth:authclient
    })
}

/**
 * 
 * @param {googleApis.Common.OAuth2Client} authclient the client generated by calling `generateOauth`
 */
const generateGoogleAuthUrl = (authclient)=>{
    return authclient.generateAuthUrl({
        scope:["https://googleapis.com/auth/drive"],
        access_type:"offline",
        include_granted_scopes:true
    })
}

/**
 * @param {googleApis.drive_v2.Drive} driveInstance instance of GDrive generated by calling `initiateDrive`
 * @param {string} id 
 */
const getFileData = async (driveInstance,id) =>{
    let fileData = await driveInstance.files.get({fileId:id})
    return fileData
}

/**
 * @param {googleApis.drive_v2.Drive} driveInstance instance of GDrive generated by calling `initiateDrive`
 * @param {string} fileId 
 */
const downloadFile = async (driveInstance,fileId) =>{
    let destination = fs.createWriteStream('../upload')
    return new Promise((resolve,reject)=>{
        driveInstance.files.get({fileId,alt:"media"},{responseType:'stream'},(err,res)=>{
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
 * @param {googleApis.drive_v2.Drive} driveInstance instance of GDrive generated by calling `initiateDrive`
 * @param {string} fileId 
 */
const downloadStreamFile = async (driveInstance,fileId,res) =>{
    //let destination = fs.createWriteStream('../upload')
    return new Promise((resolve,reject)=>{
        driveInstance.files.get({fileId:id,alt:"media"},{responseType:'stream'},(err,response)=>{
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
    getSource,downloadFile,getFileData,generateGoogleAuthUrl,downloadStreamFile,initiateDrive,generateOauth
}
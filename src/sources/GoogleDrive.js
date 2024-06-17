const googleApis = require('googleapis')
const axios = require('axios')
const env = require('dotenv').config()

const email = "";
const clientId = "";
const clientSecret = "";
const redirectUri = "";//Where google would redirect back to after authenticating you

const OauthClient = new googleApis.google.auth.OAuth2(clientId,clientSecret,redirectUri)

let drive = googleApis.google.drive({
    version:"v2",
    auth:OauthClient
})

drive.files

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
 * gets the source of the 
 */
const getSource = async (url,id) =>{
    const res = await axios({
        method: 'get',
        url: ''
    })
}
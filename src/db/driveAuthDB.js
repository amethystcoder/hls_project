const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the drive_auth database
//Feel free to include more as needed

const table = "drive_auth";

const tableColumnNames = 'id,client_id,client_secret,refresh_token,access_token,email,status,updated_at,created_at';

/**
 * gets the number of items in the table
 * @argument {string} restOfQuery are the other conditions in the query to look for 
 */
let getCount = (restOfQuery)=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let result;
    dbInstance.query(`SELECT COUNT(*) FROM ${table} ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

/**
 * gets the items in the table
 * @argument {string} restOfQuery are the other conditions in the query to look for 
 */
let get = (restOfQuery)=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let result;
    dbInstance.query(`SELECT * FROM ${table} ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

let deletion = (restOfQuery)=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let result;
    dbInstance.query(`DELETE FROM ${table} ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

let update = (set,restOfQuery)=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let result;
    dbInstance.query(`UPDATE ${table} ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

/**
 * gets all available drive_auth
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAlldrive_auth = (number=false)=>{
    if (number) return getCount()
    return get()
}

//
/**
 * gets all active drive_auth
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActivedrive_auth = (number=false)=>{
    if (number) return getCount("status = true")
    return get("status = true")
}



/**
 * @argument {string} id
 */
let getAuthUsingId = (drive_authId)=>{
    return get(`id = '${dbInstance.escape(drive_authId)}'`)
}

/**
 * @argument {string} Email
 */
let getAuthUsingEmail = (Email)=>{
    return get(`email = '${dbInstance.escape(Email)}'`)
}

/**
 * create a new drive_auth in the database
 * @argument {Object} drive_authData object containing drive_auth data to be stored... properties include
 * client_id,client_secret,refresh_token,access_token,email,status
 */
let createNewAuth = (drive_authData)=>{
    let result;
    if (typeof drive_authData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    drive_authData.updated_at = new Date().toUTCString()
    drive_authData.created_at = new Date().toUTCString()
    drive_authData.status = true
    dbInstance.query(`INSERT INTO ${table}`, drive_authData,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

/**
 * @argument {string} id 
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let updateUsingId = (id,column,value)=>{
    let updateColumnBlacklists = ["id","created_at","updated_at"];//coulumns that cannot be updated
    let queryConditional = `id = '${id}'`
    let set = 'SET '
    if (Array.isArray(column) && Array.isArray(value)) {
        for (let index = 0; index < column.length; index++) {
            if (!updateColumnBlacklists.includes(column[index])) {
                set += `${column[index]} = '${value[index]}',`
            }
        }
        set = set.substring(0,set.length - 1)
        return update(set,queryConditional)
    }
    if (typeof column == 'string' && typeof value == 'string'){
        if (!updateColumnBlacklists.includes(column)) {
            set += `${column} = '${value}'`;
            return update(set,queryConditional)   
        }
    }
    throw TypeError("arguments are not of the right type "+ typeof column + typeof value)
}

/**
 * deletes a drive_auth using its ID
 */
let deleteUsingId = (id)=>{
    return deletion(`id = '${id}'`);
}

/**
 * deletes a drive_auth using its Email
 */
let deleteUsingEmail = (Email)=>{
    return deletion(`email = '${Email}'`);
}

/**
 * performs a custom delete on the db based on a number of conditions
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let customDelete = (column,value)=>{
    let queryConditions = ""
    if (Array.isArray(column) && Array.isArray(value)) {
        queryConditions = `'${column[0]}' = '${value[0]}'`;
        for (let index = 1; index < column.length; index++) {
            queryConditions += `AND ${column[index]} = '${value[index]}'`;
        }
        return deletion(queryConditions)
    }
    if (typeof column == 'string' && typeof value == 'string') {
        queryConditions = `${column} = '${value}'`;
        return deletion(queryConditions)
    }
    throw TypeError("arguments are not of the right type "+ typeof column + typeof value)
}

module.exports = {
    getActivedrive_auth,
    getAlldrive_auth,
    getAuthUsingId,
    getAuthUsingEmail,
    deleteUsingEmail,
    createNewAuth,
    updateUsingId,
    deleteUsingId,
    customDelete,
}
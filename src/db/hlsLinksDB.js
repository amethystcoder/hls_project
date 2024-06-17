const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the hls_links database
//Feel free to include more as needed

const table = "hls_links";

const tableColumnNames = 'id,link_id,server_id,file_id,file_size,status';

/**
 * gets the number of items in the table
 * @argument {string} restOfQuery are the other conditions in the query to look for 
 */
let getCount = async (restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`SELECT COUNT(*) FROM ${table} ${where} ${restOfQuery}`)
    return result;
}

/**
 * gets the items in the table
 * @argument {string} restOfQuery are the other conditions in the query to look for 
 */
let get = async (restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`SELECT * FROM ${table} ${where} ${restOfQuery}`)
    return result;
}

let deletion = (restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let result;
    dbInstance.query(`DELETE FROM ${table} ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

let update = (set = '',restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let result;
    dbInstance.query(`UPDATE ${table} ${set} ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

/**
 * gets all available hls_links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllhls_links = (number=false)=>{
    if (number) return getCount()
    return get()
}

//
/**
 * gets all active hls_links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActivehls_links = (number=false)=>{
    if (number) return getCount("status = true")
    return get("status = true")
}



/**
 * @argument {string} id
 */
let getHlsLinkUsingId = (Id)=>{
    return get(`id = '${dbInstance.escape(Id)}'`)
}

/**
 * @argument {string} linkId
 */
let getHlsLinkUsinglinkId = (linkId)=>{
    return get(`link_id = '${dbInstance.escape(linkId)}'`)
}

/**
 * @argument {string} linkId
 */
let getHlsLinkUsingServerId = (serverId)=>{
    return get(`server_id = '${dbInstance.escape(serverId)}'`)
}


/**
 * create a new hls_links in the database
 * @argument {Object} hls_linksData object containing hls_links data to be stored... properties include
 * link_id,server_id,file_id,file_size,status
 */
let createNewHlsLink = (hls_linkData)=>{
    let result;
    if (typeof hls_linksData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    hls_linkData.updated_at = new Date().toUTCString()
    hls_linkData.created_at = new Date().toUTCString()
    hls_linkData.status = true
    dbInstance.query(`INSERT INTO ${table}`, hls_linkData,(error,results,fields)=>{
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
    let updateColumnBlacklists = ["id"];//coulumns that cannot be updated
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
 * deletes a hls_links using its ID
 */
let deleteUsingId = (id)=>{
    return deletion(`id = '${id}'`);
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
    getActivehls_links,
    getAllhls_links,
    createNewHlsLink,
    getHlsLinkUsingServerId,
    getHlsLinkUsingId,
    getHlsLinkUsinglinkId,
    updateUsingId,
    deleteUsingId,
    customDelete,
}
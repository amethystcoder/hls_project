const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the links database
//Feel free to add more as needed

const table = "links";

const tableColumnNames = 'acc_id,title,main_link,alt_link,preview_img,data,type,subtitles,views,downloads,is_alt,slug,status,updated_at,created_at,deleted';

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

let update = (set,restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let result;
    dbInstance.query(`UPDATE ${table} ${set}  ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

/**
 * gets all available links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllLinks = (number=false)=>{
    if (number) return getCount()
    return get()
}

//
/**
 * gets all active links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActiveLinks = (number=false)=>{
    if (number) return getCount("status = 'active'")
    return get("status = 'active'")
}

//
/**
 * gets all broken links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getBrokenLinks = (number=false)=>{
    if (number) return getCount("status = 'broken'")
    return get("status = 'broken'")
}

/**
 * @argument {string} id
 */
let getLinkUsingId = (linkId)=>{
    return get(`id = ${dbInstance.escape(linkId)}`)
}

/**
 * create a new link in the database
 * @argument {Object} linkData object containing link data to be stored... properties include
 * id,acc_id,title,main_link,alt_link,preview_img,data,type,subtitles,views,downloads,is_alt,slug
 */
let createNewLink = (linkData)=>{
    let result;
    if (typeof linkData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    linkData.status = "active"
    linkData.updated_at = new Date().toUTCString()
    linkData.created_at = new Date().toUTCString()
    linkData.deleted = false
    dbInstance.query(`INSERT INTO ${table}`, linkData,(error,results,fields)=>{
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
    let updateColumnBlacklists = ["id","acc_id","created_at","updated_at","slug"];//coulumns that cannot be updated
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
 * deletes a link using its ID
 */
let deleteUsingId = (id)=>{
    return deletion(`id = '${id}'`);
}


/**
 * deletes all broken links
 */
let deleteBrokenLinks = ()=>{
    return deletion('status = "broken"')
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
    getActiveLinks,
    getAllLinks,
    getLinkUsingId,
    createNewLink,
    updateUsingId,
    deleteBrokenLinks,
    deleteUsingId,
    customDelete,
    getBrokenLinks
}
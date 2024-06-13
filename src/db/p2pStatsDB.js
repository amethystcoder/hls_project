const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the p2p_stats database
//Feel free to include more as needed

const table = "p2p_stats";

const tableColumnNames = 'id,upload,download,peers,ipAddress,country,device,date';

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
 * gets all available p2p_stats
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllp2p_stats = (number=false)=>{
    if (number) return getCount()
    return get()
}

//
/**
 * gets p2p_stats by country
 * @argument {boolean} number determines whether to just send the number of items in storage 
 * @argument {string} country 
 */
let getp2p_statsByCountry = (number=false,country)=>{
    if (number) return getCount(`country = '${country}'`)
    return get(`country = '${country}'`)
}


//
/**
 * gets p2p_stats by device
 * @argument {boolean} number determines whether to just send the number of items in storage
 * @argument {string} deviceName  
 */
let getp2p_statsByDevice = (number=false,deviceName)=>{
    if (number) return getCount(`device = '${deviceName}'`)
    return get(`device = '${deviceName}'`)
}


/**
 * create a new p2p_stats in the database
 * @argument {Object} P2PData object containing p2p_stats data to be stored... properties include
 * upload,download,peers,ipAddress,country,device
 */
let createNewP2PData = (P2PData)=>{
    let result;
    if (typeof P2PData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    P2PData.date = new Date().toUTCString()
    dbInstance.query(`INSERT INTO ${table}`, P2PData,(error,results,fields)=>{
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
 * deletes a p2p_stats using its ID
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
    getp2p_statsByCountry,
    createNewP2PData,
    getp2p_statsByDevice,
    getAllp2p_stats,
    updateUsingId,
    deleteUsingId,
    customDelete,
}
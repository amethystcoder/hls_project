const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the ads database
//Feel free to add more as needed

const table = "ads";

const tableColumnNames = 'id,title,type,code';

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
 * gets all available ads
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllads = (number=false)=>{
    if (number) return getCount()
    return get()
}

//
/**
 * gets all active ads
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActiveads = (number=false)=>{
    if (number) return getCount("status = 'active'")
    return get("status = 'active'")
}

//
/**
 * gets all pop ads
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getpopads = (number=false)=>{
    if (number) return getCount("type = 'popad'")
    return get("type = 'popad'")
}

/**
 * @argument {string} id
 */
let getadUsingId = (adsId)=>{
    return get(`id = '${dbInstance.escape(adsId)}'`)
}

/**
 * create a new ads in the database
 * @argument {Object} adsData object containing ads data to be stored... properties include
 * title,type,code
 */
let createNewAd = (adsData)=>{
    let result;
    if (typeof adsData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    dbInstance.query(`INSERT INTO ${table}`, adsData,(error,results,fields)=>{
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
 * deletes a ads using its ID
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
    getActiveads,
    getAllads,
    getadUsingId,
    getpopads,
    createNewAd,
    updateUsingId,
    deleteUsingId,
    customDelete,
}
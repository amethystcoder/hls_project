const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the settings database
//Feel free to add more as needed

const table = "settings";

const tableColumnNames = 'config,var';

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
    dbInstance.query(`UPDATE ${table} ${set}  ${where} ${restOfQuery}`,(error,results,fields)=>{
        if (error) throw error
        result = results;
    })
    return result;
}

/**
 * gets all available settings
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllsettings = (number=false)=>{
    if (number) return getCount()
    return get()
}

/**
 * gets a particular configuation or setting
 * @argument {string} setting The configuration to look for 
 */
let getConfig = (setting)=>{
    return get(`config='${setting}'`)
}

/**
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let updateSettings = (column,value)=>{
    let queryConditional = ``
    let set = 'SET '
    if (Array.isArray(column) && Array.isArray(value)) {
        for (let index = 0; index < column.length; index++) {
            set += `var = '${value[index]}'`
            queryConditional = `config = '${column[index]}'`
            update(set,queryConditional)
        }
    }
    if (typeof column == 'string' && typeof value == 'string'){
        set += `var = '${value}'`;
        queryConditional = `config = '${column}'`
        return update(set,queryConditional)   
    }
    throw TypeError("arguments are not of the right type "+ typeof column + typeof value)
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
    getAllsettings,
    updateSettings,
    getConfig,
    customDelete
}
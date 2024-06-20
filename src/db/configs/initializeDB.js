const fs = require('fs')
const DBPool = require('./dbConfig')

//adds all required tables and configuration data to a new database

const initializeDatabase = async ()=>{
    try {
        //create tables
        fs.readFile('./db.sql',async (err,data)=>{
            if(err) return err
            let file = data.toString('utf-8')
            let SQLcommand = ''
            for (let index = 0; index < file.length; index++) {
                SQLcommand += file[index];
                if (file[index] === ";") {
                    await DBPool.query(SQLcommand)
                    SQLcommand = ''
                }
            }  
        })
        //create default values for config
        fs.readFile('./def_values.sql',async (err,data)=>{
            if(err) return err
            let file = data.toString('utf-8')
            let SQLcommand = ''
            for (let index = 0; index < file.length; index++) {
                SQLcommand += file[index];
                if (file[index] === ";") {
                    await DBPool.query(SQLcommand)
                    SQLcommand = ''
                }
            }  
        })
        return {success:true}
    } catch (error) {
        return error
    }
}

module.exports = initializeDatabase
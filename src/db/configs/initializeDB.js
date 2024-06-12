const fs = require('fs')
const DBPool = require('./dbConfig')

const initializeDatabase = async ()=>{
    try {
        //create tables
        fs.readFile('./db.sql',(err,data)=>{
            if(err) return err
            let file = data.toString('utf-8')
            let SQLcommand = ''
            for (let index = 0; index < file.length; index++) {
                SQLcommand += file[index];
                if (file[index] === ";") {
                    SQLcommand += 
                    DBPool.query(SQLcommand,(error,results,fields)=>{
                        if (error) console.log(error)
                        console.log(results) 
                    })
                    SQLcommand = ''
                }
            }  
        })
        //create default values for config
        fs.readFile('./def_values.sql',(err,data)=>{
            if(err) return err
            let file = data.toString('utf-8')
            let SQLcommand = ''
            for (let index = 0; index < file.length; index++) {
                SQLcommand += file[index];
                if (file[index] === ";") {
                    SQLcommand += 
                    DBPool.query(SQLcommand,(error,results,fields)=>{
                        if (error) console.log(error)
                        console.log(results) 
                    })
                    SQLcommand = ''
                }
            }  
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = initializeDatabase
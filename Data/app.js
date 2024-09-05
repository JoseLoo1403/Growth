let sql;
const sqlite3 = require('sqlite3').verbose();

function ConnectDatabase()
{
    let db = new sqlite3.Database('./Data/GrowthData.db',sqlite3.OPEN_READWRITE,(err) => {
        if(err)
        {
            console.log('Error connect to database');
            return console.error(err.message);
        }
    
        console.log('Database connnected');
    });

    return db;
}

function DisconnectDatabase(dataBase)
{
    dataBase.close();
    console.log("Database connection closed");
}

module.exports = {ConnectDatabase,DisconnectDatabase};
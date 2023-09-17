const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    password: "20060727a",
    database: "notes"
}).promise()

async function createTask([id,subject,description,due,status]) {
    const user = "admin"
    const sql = "INSERT INTO tasks (taskid,subject,description,due,status,user) VALUES (?)";
    pool.query(sql,[[id,subject,description,due,status,user]],(err,result) => {
        if(err) throw err;
        console.log("task created")
    })
}

async function editTask([id,subject,description,due,status]) {
    const user = "admin"
    const sql = `UPDATE tasks SET subject=${subject},description = ${description},due=${due},status=${status} WHERE taskid=${id}`;
    pool.query(sql,(err,result) => {
        if(err) throw err;
        console.log("task edited")
    })
}

module.exports = [createTask,editTask]
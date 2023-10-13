const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '20060727a',
    database: 'notes'
}).promise()

async function createTask([id, subject, description, due, status]) {
    const user = "admin";
    const sql = "INSERT INTO tasks (taskid, subject, description, due, status, user) VALUES (?, ?, ?, ?, ?, ?)";
    
    try {
        const [result] = await pool.query(sql, [id, subject, description, due, status, user]);
        console.log("task created");
    } catch (err) {
        console.error("Error creating task:", err);
    }
}

async function editTask([id, subject, description, due, status]) {
    const user = "admin";
    const sql = "UPDATE tasks SET subject=?,description=?,due=?,status=? WHERE taskid= ?";
    
    try {
        const [result] = await pool.query(sql, [subject, description, due, status, id]);
        console.log("task created");
    } catch (err) {
        console.error("Error creating task:", err);
    }
}

async function deleteTask(id) {
    const user = "admin";
    const sql = "DELETE FROM tasks WHERE taskid = ?";
    
    try {
        const [result] = await pool.query(sql,id);
        console.log("deleted");
    } catch (err) {
        console.error("Error creating task:", err);
    }
}

module.exports = {
    createTask,
    editTask,
    deleteTask
};

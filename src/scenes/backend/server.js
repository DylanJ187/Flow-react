const express = require('express')
const bodyParser = require('body-parser')
const {createTask,editTask,deleteTask} = require('./database')
const app = express()

var cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.post('/api/createTask',(req,res) => {
    var data = req.body;
    const [id,subject,description,due,status] = [data.id,data.subject,data.description,new Date(Date.parse(data.due)),data.status,]
    createTask([id,subject,description,due,status]);
    res.status(200).send('done')
})

app.put('/api/editTask',(req,res) => {
    var data = req.body;
    const [id,subject,description,due,status] = [data.id,data.subject,data.description,new Date(Date.parse(data.due)),data.status,]
    editTask([id,subject,description,due,status])
    res.status(200).send('done')
})

app.delete('/api/deleteTask/:id', (req,res) => {
    const id = req.params.id;
    console.log("task deleting")
    deleteTask(id);
    res.status(200).send('done')
})

app.listen(5000,() => {
    console.log('app is listening on port 5000')
})


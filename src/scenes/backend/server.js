const express = require('express')
const bodyParser = require('body-parser')
const [createTask,editTask] = require('./database')
const app = express()

var cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/api/createTask',(req,res) => {
    var data = req.body
    console.log(data)
    res.status(200).send('done')
})

app.post('/api/createTask',(req,res) => {
    var data = req.body;
    const [id,subject,description,due,status] = [data.id,data.subject,data.description,new Date(Date.parse(data.due)),data.status,]
    // console.log([id,subject,description,due,status] )
    // console.log(typeof due)
    // console.log(due,typeof due)
    createTask([id,subject,description,due,status])
    res.status(200).send('done')
})

app.post('/api/editTask',(req,res) => {
    var data = req.body;
    const [id,subject,description,due,status] = [data.id,data.subject,data.description,new Date(Date.parse(data.due)),data.status,]
    editTask([id,subject,description,due,status])
    res.status(200).send('done')
})


app.listen(5000,() => {
    console.log('app is listening on port 5000')
})


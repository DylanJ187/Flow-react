const express = require('express')
const bodyParser = require('body-parser')
const {createTask,getTask,deleteTask} = require('./database')
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

app.get('/api/getTask/:user', async (req, res) => {
    try {
        const user = req.params.user;
        
        // If getTask is asynchronous:
        const data = await getTask(user);
        
        // Ensure data exists and is in the correct format:
        if (!Array.isArray(data)) {
            return res.status(400).json({ message: 'Data is not in the expected format.' });
        }
        
        console.log(data);
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




app.delete('/api/deleteTask/:id', (req,res) => {
    const id = req.params.id;
    console.log("task deleting")
    console.log(id)
    deleteTask(id);
    res.status(200).send('done')
})

app.listen(5000,() => {
    console.log('app is listening on port 5000')
})

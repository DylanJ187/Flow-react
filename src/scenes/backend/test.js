const axios = require("axios")


async function SendPost(data) {
    // Simple POST request with a JSON body using fetch
    const response = await axios({
        method: "POST",
        url: 'http://localhost:5000/api/createTask',
        data: data
    })
  }

SendPost({
    name: "nick"
})
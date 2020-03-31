const express = require('express')
const app = express()

const server = app.listen(443, () => {
  console.log(`Port: ${server.address().port}`);
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
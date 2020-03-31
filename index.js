const express = require("express")
const app = express()

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Port: ${server.address().port}`);
})

app.set("view engine", "pug")

app.get("/", (req, res) => {
  res.render("index", {
    first: "test"
  })
})
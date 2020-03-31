const data = require("./data.js")
const express = require("express")
const app = express()

const port = process.env.PORT || 3000

app.use("/node_modules", express.static(__dirname + "/../node_modules"));
app.use("/src", express.static(__dirname + "/../src"));

const server = app.listen(port, () => {
  console.log(`Port: ${server.address().port}`);
})

app.set("view engine", "pug")

app.get("/", (req, res) => {
    data.states(states => {
        data.dates(dates => {
            res.render("index", {
                states: states,
                dates: [dates]
            })
        })
    })
})
const data = require("./data.js")
const express = require("express")
const app = express()

const port = process.env.PORT || 3000

app.use("/node_modules", express.static(__dirname + "/../node_modules"));
app.use("/resources", express.static(__dirname + "/../resources"));

const server = app.listen(port, () => {
  console.log(`Port: ${server.address().port}`);
})

app.set("view engine", "pug")

app.get("/", (req, res) => {
    const statePromise = new Promise(resolve => data.states(states => {
        templateData.states = states
        console.log(`states: ${dates.length}`)
        resolve(states)
    }))
    const countyPromise = new Promise(resolve => {
        data.countiesByState(countiesByState => {
            templateData.countiesByState = countiesByState
            resolve()
        })
    })
    const datePromise = new Promise(resolve => data.allStateData(allStateData => {
        templateData.dates = Object.keys(allStateData)
        templateData.allStateData = allStateData
        console.log(`dates: ${dates.length}`)
        resolve()
    }))
    Promise.all([statePromise, countyPromise, datePromise]).then(() => {
        res.render("index", templateData)
    })
})
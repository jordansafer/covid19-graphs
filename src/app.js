const data = require("./data.js")
const express = require("express")
const app = express()

const port = process.env.PORT || 3000

app.use("/resources", express.static(__dirname + "/../resources"));

const server = app.listen(port, () => {
    console.log(`Port: ${server.address().port}`);
})

app.set("view engine", "pug")

app.get("/", (req, res) => {
    renderWithData(res, "index")
})

app.get("/state_vs_state", (req, res) => {
    renderWithData(res, "svs")
})

// save template data for 5 minutes
var cachedTemplate = null
const cacheTimeout = 5 * 60 * 1000

function renderWithData (res, templateName) {
    if (cachedTemplate) {
        res.render(templateName, cachedTemplate)
        return
    }

    const templateData = {}
    const statePromise = new Promise(resolve => data.states(states => {
        templateData.states = states.sort()
        console.log(`states: ${states.length}`)
        resolve(states)
    }))
    const countyPromise = new Promise(resolve => {
        data.countiesByState(countiesByState => {
            templateData.countiesByState = countiesByState
            console.log(`states with counties: ${Object.keys(countiesByState).length}`)
            resolve()
        })
    })
    const datePromise = new Promise(resolve => data.allStateData(allStateData => {
        templateData.dates = Object.keys(allStateData)
        templateData.allStateData = allStateData
        console.log(`dates: ${templateData.dates.length}`)
        resolve()
    }))
    Promise.all([statePromise, countyPromise, datePromise]).then(() => {
        // cachedTemplate = templateData
        setTimeout(clearCachedTemplate, cacheTimeout)
        res.render(templateName, templateData)
    })
}

function clearCachedTemplate () {
    cachedTemplate = null
}
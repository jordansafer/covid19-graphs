const covid = require("covid-usa")

module.exports = {
    allStateData: covid.stateData,

    states: covid.allStates,

    counties: covid.allCounties,

    countiesByState: covid.countiesByState
}

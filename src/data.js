const covid = require("covid-usa")
const _ = require("lodash")

module.exports = {
    allStateData: covid.stateData,

    states: covid.allStates,

    counties: covid.allCounties,

    countiesByState: covid.countiesByState,

    singleStateData: function(state) {
        return _.mapValues(allStateData, dataForDate => dataForDate[state] || {})
    },

    countyCases: function(state, stateData, callback) {
        covid.allCounties(state, counties => {
            const datasets = _.map(counties, county => {
                const data = _.map(dates, date => {
                    const countyData = stateData[date][county] || {}
                    const cases = countyData.cases || 0
                    return cases
                })
                return {
                    label: county,
                    data: data
                }
            })
            callback(datasets)
        })
    }
}

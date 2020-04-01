
var charts = {}

function init(dates, countiesByState, allStateData) {
    Chart.platform.disableCSSInjection = true
    $("#chooseState").on("change", () => {
        const state = $( "#chooseState option:selected" ).val()
        if (state === "") {
            return // No change if default chosen
        }
        refreshChart(state, allStateData, countiesByState, dates, "cases")
        refreshChart(state, allStateData, countiesByState, dates, "deaths")
    })
}

function singleStateData(state, allStateData) {
    const stateData = {}
    Object.keys(allStateData).forEach(date => {
        const dataForDate = allStateData[date]
        stateData[date] = dataForDate[state] || {}
    })
    return stateData
}

function countyStats(counties, dates, stateData, statType) {
    const datasets = []
    for (const county of counties) {
        const data = []
        for (const date of dates) {
            const countyData = stateData[date][county] || {}
            const stat = countyData[statType] || 0
            data.push(stat)
        }
        const color = getRandomColor()
        datasets.push({
            label: county,
            data: data,
            backgroundColor: color,
            borderColor: color,
            fill: false
        })
    }
    return datasets
}

// https://stackoverflow.com/questions/25594478/different-color-for-each-bar-in-a-bar-chart-chartjs
function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function refreshChart(state, allStateData, countiesByState, dates, statType) {
    const ctx = document.getElementById(statType)
    if (charts[statType]) {
        charts[statType].destroy()
        charts[statType] = null
    }
    const stateData = singleStateData(state, allStateData)
    const counties = countiesByState[state].sort()
    const datasets = countyStats(counties, dates, stateData, statType)
    charts[statType] = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: datasets
        },
        options: {
            title: {
                display: true,
                text: `Covid19 ${statType} by county in ${state}`
            },
            tooltips: {
                mode: "point",
                intersect: false,
            },
            hover: {
                mode: "nearest",
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Date"
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: statType
                    }
                }]
            }
        }
    })
}

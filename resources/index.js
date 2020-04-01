
var chart = null

function singleStateData(state, allStateData) {
    const stateData = {}
    Object.keys(allStateData).forEach(date => {
        const dataForDate = allStateData[date]
        stateData[date] = dataForDate[state] || {}
    })
    return stateData
}

function countyCases(counties, dates, stateData) {
    const datasets = []
    for (const county of counties) {
        const data = []
        for (const date of dates) {
            const countyData = stateData[date][county] || {}
            const cases = countyData.cases || 0
            data.push(cases)
        }
        datasets.push({
            label: county,
            data: data,
            backgroundColor: getRandomColor(),
            borderColor: getRandomColor(),
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

function init(dates, countiesByState, allStateData) {
    Chart.platform.disableCSSInjection = true
    var ctx = document.getElementById("myChart")
    $("#chooseState").on("change", () => {
        const state = $( "#chooseState option:selected" ).val()
        if (state === "") {
            return // No change if default chosen
        }
        if (chart) {
            chart.destroy()
            chart = null
        }
        const stateData = singleStateData(state, allStateData)
        const counties = countiesByState[state].sort()
        const datasets = countyCases(counties, dates, stateData)
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: dates,
                datasets: datasets
            },
            options: {
                responsive: false,
                title: {
                    display: true,
                    text: `Covid19 Cases by County in ${state}`
                },
                tooltips: {
                    mode: "index",
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
                            labelString: "Cases"
                        }
                    }]
                }
            }
        })
    })
}

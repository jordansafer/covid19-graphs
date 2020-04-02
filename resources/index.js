
var charts = {}


function initializeCovidGraphs(dates, countiesByState, allStateData) {
    Chart.platform.disableCSSInjection = true

    $("#chooseState").on("change", () => {
        $( "#isCumulative" ).prop( "checked", true )
        $( "#isStacked" ).prop( "checked", false )
        const state = $( "#chooseState option:selected" ).val()
        if (state === "") {
            return // No change if default chosen
        }
        const counties = countiesByState[state].sort()
        const colors = Array(counties.length).fill().map(getRandomColor)
        refreshChart(state, allStateData, counties, dates, "cases", colors)
        refreshChart(state, allStateData, counties, dates, "deaths", colors)
    })

    $("#isStacked").on("change", () => {
        Object.values(charts).forEach(chart => {
            chart.options.scales.yAxes[0].stacked = $("#isStacked").is(":checked")
            chart.update()
        })
    })

    function hideDatasets (hidden) {
        Object.values(charts).forEach(chart => {
            chart.data.datasets.forEach(ds => {
                ds.hidden = hidden
            })
            chart.update()
        })
    }

    $("#selectAll").click(() => hideDatasets(false))
    $("#unselectAll").click(() => hideDatasets(true))

    function toggleAggregation (cumulative) {
        Object.values(charts).forEach(chart => {
            chart.data.datasets.forEach(ds => {
                const oldData = ds.data.slice()
                for (var i = 1; i < oldData.length; i++) {
                    if (cumulative) {
                        ds.data[i] = oldData[i] + ds.data[i - 1]
                    } else {
                        ds.data[i] = oldData[i] - oldData[i - 1]
                    }
                }
            })
            chart.update()
        })
    }

    $("#isCumulative").on("change", () => {
        toggleAggregation($("#isCumulative").is(":checked"))
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

function countyStats(counties, dates, stateData, statType, colors) {
    const datasets = []
    for (var i = 0; i < counties.length; i++) {
        const county = counties[i]
        const data = []
        for (const date of dates) {
            const countyData = stateData[date][county] || {}
            const stat = countyData[statType] || 0
            data.push(stat)
        }
        datasets.push({
            label: county,
            data: data,
            backgroundColor: colors[i],
            borderColor: colors[i],
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

function refreshChart(state, allStateData, counties, dates, statType, colors) {
    const ctx = statType
    if (charts[statType]) {
        charts[statType].destroy()
        charts[statType] = null
    }
    const stateData = singleStateData(state, allStateData)
    const datasets = countyStats(counties, dates, stateData, statType, colors)
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

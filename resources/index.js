
var charts = {}

function showError(text) {
    $("#error").text(text)
    $("#error").show()
}

function initializeCovidGraphs(dates, countiesByState, allStateData, states) {
    Chart.platform.disableCSSInjection = true

    if (!states.length) {
        showError("No states loaded, try refreshing page")
    }

    // Create state vs state charts for SVS view
    if ( $( "#svs" ).length ) {
        $( "#isCumulative" ).prop( "checked", true )
        $( "#isLogarithmic" ).prop( "checked", false )
        const colors = Array(states.length).fill().map(getRandomColor)
        refreshStateChart(allStateData, states, dates, "cases", colors)
        refreshStateChart(allStateData, states, dates, "deaths", colors)
        $(".chart").show()
    }

    $("#chooseState").on("change", () => {
        $( "#isCumulative" ).prop( "checked", true )
        const state = $( "#chooseState option:selected" ).val()
        if (state === "") {
            return // No change if default chosen
        }
        const counties = (countiesByState[state] || []).sort()
        if (!counties.length) {
            showError(`No counties loaded for ${state}`)
        }
        const colors = Array(counties.length).fill().map(getRandomColor)
        refreshCountyChart(state, allStateData, counties, dates, "cases", colors)
        refreshCountyChart(state, allStateData, counties, dates, "deaths", colors)
        $(".chart").show()
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

    function toggleLogarithmic (isLogarithmic) {
        Object.values(charts).forEach(chart => {
            const chartType = isLogarithmic ? "logarithmic" : "linear"
            chart.options.scales.yAxes[0].type = chartType
            chart.update()
        })
    }

    $("#isLogarithmic").on("change", () => {
        toggleLogarithmic($("#isLogarithmic").is(":checked"))
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

function regionStats(regions, dates, regionData, statType, colors) {
    const datasets = []
    for (var i = 0; i < regions.length; i++) {
        const region = regions[i]
        const data = []
        for (const date of dates) {
            const dayData = regionData[date][region] || {}
            const stat = Number(dayData[statType]) || 0
            data.push(stat)
        }
        datasets.push({
            label: region,
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

function refreshCountyChart(state, allStateData, counties, dates, statType, colors) {
    cleanUpCharts(statType)
    const stateData =  singleStateData(state, allStateData)
    const datasets = regionStats(counties, dates, stateData, statType, colors)
    drawChart(statType, dates, datasets, `Covid19 ${statType} by county in ${state}`)
}

function refreshStateChart(allStateData, states, dates, statType, colors) {
    cleanUpCharts(statType)
    const datasets = regionStats(states, dates, allStateData, statType, colors)
    drawChart(statType, dates, datasets, `State vs State Covid19 ${statType}`)
}

function cleanUpCharts(statType) {
    if (charts[statType]) {
        charts[statType].destroy()
        charts[statType] = null
    }
}

function drawChart(statType, dates, datasets, title) {
    const ctx = statType
    charts[statType] = new Chart(ctx, {
        maintainAspectRatio: false,
        type: "line",
        data: {
            labels: dates,
            datasets: datasets
        },
        options: {
            title: {
                display: true,
                text: title
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

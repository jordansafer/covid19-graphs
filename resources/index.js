

function singleStateData(state, allStateData) {
    const stateData = {}
    Object.keys(allStateData).forEach(date => {
        dataForDate = allStateData[date]
        stateData[date] = dataForDate[state] || {}
    })
    return stateData
}

function countyCases(counties, dates, stateData) {
    const datasets = []
    counties.forEach(county => {
        const data = []
        dates.forEach(date => {
            const countyData = stateData[date][county] || {}
            const cases = countyData.cases || 0
            dataset.push(cases)
        })
        datasets.push({
            label: county,
            data: data
        })
    })
    return datasets
}

function init(dates, countiesByState, allStateData) {
    Chart.platform.disableCSSInjection = true;
    var ctx = document.getElementById('myChart');
    $('select').on('change', () => {
        const state = this.value
        if (state === "") {
            return // No change if default chosen
        }
        const stateData = singleStateData(state)
        const counties = countiesByState[state]
        const datasets = countyCases(counties, dates, stateData)
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [dates],
                datasets: datasets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    })
    var myChart = new Chart(ctx, { // TODO delete this chart
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}

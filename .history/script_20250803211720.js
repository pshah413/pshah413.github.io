document.addEventListener('DOMContentLoaded', init);

async function init() {
    const scenes = ['#scene-1', '#scene-2', '#scene-3'];
    let currentScene = 0;

    const globalData = await d3.csv("global_internet.csv", d => ({
        Year: +d.Year,
        InternetPenetration: +d.InternetPenetration
    }));

    const regionData = await d3.csv("region_internet.csv", d => ({
        Region: d.Region,
        InternetPenetration: +d.InternetPenetration
    }));

    const countryData = await d3.csv("country_internet.csv", d => ({
        Country: d.Country,
        Year: +d.Year,
        InternetPenetration: +d.InternetPenetration
    }));

    // Populate the dropdown menu with country options
    const countries = Array.from(new Set(countryData.map(d => d.Country)));
    const countrySelect = d3.select("#country-select");
    countrySelect.selectAll("option")
        .data(countries)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    // Button listeners
    document.getElementById('next').addEventListener('click', () => {
        if (currentScene < scenes.length - 1) {
            d3.select(scenes[currentScene]).classed('active', false);
            currentScene++;
            d3.select(scenes[currentScene]).classed('active', true);
            updateChartForScene(currentScene);
        }
    });

    document.getElementById('previous').addEventListener('click', () => {
        if (currentScene > 0) {
            d3.select(scenes[currentScene]).classed('active', false);
            currentScene--;
            d3.select(scenes[currentScene]).classed('active', true);
            updateChartForScene(currentScene);
        }
    });

    d3.select("#country-select").on("change", function () {
        const selected = d3.select(this).property("value");
        updateCountryChart(selected);
    });

    function updateChartForScene(sceneIndex) {
        if (sceneIndex === 0) {
            createLineChart(globalData);
        } else if (sceneIndex === 1) {
            createRegionChart(regionData);
        } else if (sceneIndex === 2) {
            updateCountryChart("Afghanistan");
        }
    }

    function createLineChart(data) {
        d3.select("#line-chart").selectAll("*").remove();

        const svg = d3.select("#line-chart").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const margin = { top: 20, right: 30, bottom: 60, left: 50 };
        const width = svg.attr("width") - margin.left - margin.right;
        const height = svg.attr("height") - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.Year, 0, 1)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.InternetPenetration)])
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(new Date(d.Year, 0, 1)))
            .y(d => y(d.InternetPenetration));

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

        g.append("g").call(d3.axisLeft(y));

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "teal")
            .attr("stroke-width", 2)
            .attr("d", line);

        
        const tmpData = data.find(d => d.Year === 2020);
        if (tmpData) {
            g.append("line")
                .attr("x1", x(new Date(2020, 0, 1)))
                .attr("x2", x(new Date(2020, 0, 1)))
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "red")
                .attr("stroke-dasharray", "4");
        }
    }

    function createRegionChart(data) {
        d3.select("#region-chart").selectAll("*").remove();

        const svg = d3.select("#region-chart").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const margin = { top: 20, right: 30, bottom: 100, left: 50 };
        const width = svg.attr("width") - margin.left - margin.right;
        const height = svg.attr("height") - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(data.map(d => d.Region))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.InternetPenetration)])
            .range([height, 0]);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-40)")
            .style("text-anchor", "end");

        g.append("g").call(d3.axisLeft(y));

        g.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.Region))
            .attr("y", d => y(d.InternetPenetration))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.InternetPenetration))
            .attr("fill", "steelblue");
    }

    function updateCountryChart(selectedCountry) {
        const filtered = countryData.filter(d => d.Country === selectedCountry);
        createCountryChart(filtered);
    }

    function createCountryChart(data) {
        d3.select("#country-chart").selectAll("*").remove();

        const svg = d3.select("#country-chart").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const margin = { top: 20, right: 30, bottom: 60, left: 50 };
        const width = svg.attr("width") - margin.left - margin.right;
        const height = svg.attr("height") - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.Year, 0, 1)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.InternetPenetration)])
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(new Date(d.Year, 0, 1)))
            .y(d => y(d.InternetPenetration));

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

        g.append("g").call(d3.axisLeft(y));

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "darkorange")
            .attr("stroke-width", 2)
            .attr("d", line);
    }

    // Initial scene render
    updateChartForScene(currentScene);
}

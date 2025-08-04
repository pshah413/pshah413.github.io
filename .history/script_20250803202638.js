document.addEventListener('DOMContentLoaded', init);

async function init() {
    const scenes = ['#scene-1', '#scene-2', '#scene-3'];
    let currentScene = 0;

    // --- Load and parse global_internet.csv with metadata rows ---
    const globalRawText = await d3.text("global_internet.csv");

    // Parse CSV rows manually to handle metadata
    const globalRows = d3.csvParseRows(globalRawText);

    // Headers are at index 2, data starts at index 3
    const globalHeaders = globalRows[2];
    const globalDataRows = globalRows.slice(3);

    // Find the row for "World"
    const worldRow = globalDataRows.find(row => row[0] === "World");

    // Create object mapping header -> value for the "World" row
    const worldObj = Object.fromEntries(globalHeaders.map((h, i) => [h, worldRow[i]]));

    // Extract year columns and convert to structured data
    const globalData = Object.entries(worldObj)
        .filter(([key]) => /^\d{4}$/.test(key))
        .map(([year, value]) => ({
            Year: +year,
            InternetPenetration: parseFloat(value) || 0
        }));

    // --- Load other CSV data normally (assuming no metadata rows here) ---
    const regionData = await d3.csv("region_internet.csv", d => ({
        Region: d.Region,
        InternetPenetration: +d.InternetPenetration
    }));

    const countryData = await d3.csv("country_internet.csv", d => ({
        Country: d.Country,
        Year: +d.Year,
        InternetPenetration: +d.InternetPenetration
    }));

    // Populate country dropdown
    const countries = Array.from(new Set(countryData.map(d => d.Country)));
    const countrySelect = d3.select("#country-select");
    countrySelect.selectAll("option")
        .data(countries)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    // Scene navigation buttons
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

    // Update charts based on scene
    function updateChartForScene(sceneIndex) {
        if (sceneIndex === 0) {
            createLineChart(globalData);
        } else if (sceneIndex === 1) {
            createRegionChart(regionData);
        } else if (sceneIndex === 2) {
            updateCountryChart("United States");
        }
    }

    // Chart for global internet penetration over time
    function createLineChart(data) {
        d3.select("#line-chart").selectAll("*").remove();

        const svg = d3.select("#line-chart").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const margin = { top: 20, right: 30, bottom: 60, left: 50 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;

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

        // Optional COVID-19 annotation line at 2020
        const covidData = data.find(d => d.Year === 2020);
        if (covidData) {
            g.append("line")
                .attr("x1", x(new Date(2020, 0, 1)))
                .attr("x2", x(new Date(2020, 0, 1)))
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "red")
                .attr("stroke-dasharray", "4");
        }
    }

    // Chart for region internet penetration (bar chart)
    function createRegionChart(data) {
        d3.select("#region-chart").selectAll("*").remove();

        const svg = d3.select("#region-chart").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const margin = { top: 20, right: 30, bottom: 100, left: 50 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;

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

    // Update country chart based on selected country
    function updateCountryChart(selectedCountry) {
        const filtered = countryData.filter(d => d.Country === selectedCountry);
        createCountryChart(filtered);
    }

    // Line chart for internet penetration by country over time
    function createCountryChart(data) {
        d3.select("#country-chart").selectAll("*").remove();

        const svg = d3.select("#country-chart").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const margin = { top: 20, right: 30, bottom: 60, left: 50 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        if (data.length === 0) {
            g.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .text("No data available for this country.");
            return;
        }

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

    // Initialize first scene
    updateChartForScene(currentScene);
}

// Json URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Fetch the JSON data and console log it
let dataPromise = d3.json(url);

function init() {
    let dropdownMenu = d3.select('#selDataset');

    dataPromise.then(data => {
        // console.log(data);

        let sampleNames = data.names;

        // Fill in dropdown menu
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i];
            dropdownMenu.append('option').text(sampleId).property('value', sampleId);
        };

        // Read the dropdown value
        let selectedIndex = dropdownMenu.property('selectedIndex');
        // console.log(`Dropdown Value = ${selectedIndex}`);

        drawBarGraph(selectedIndex);
        drawBubbleGraph(selectedIndex);
        demographicInfo(selectedIndex);
    });
};

function drawBarGraph(index) {
    dataPromise.then(data => {
        // console.log(data);

        // Chart Values
        let sampleValues = Object.values(data.samples[index].sample_values);

        // Chart Labels
        let otuLabels = Object.values(data.samples[index].otu_ids);

        // Chart Hover Text
        let otuHover = Object.values(data.samples[index].otu_labels);
        // console.log(otuHover);

        let trace = {
            x: sampleValues.slice(0, 10),
            y: otuLabels.slice(0, 10).map(label => `OTU ${label}`),
            type: 'bar',
            orientation: 'h',
            text: otuHover.slice(0, 10),
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'}]
        };

        let layout = {
            title: 'Bacteria Cultures Found (Top 10)',
            margin: {t: 50, l: 150}
        };

        Plotly.newPlot('bar', [trace], layout);

    });
};

function drawBubbleGraph(index) {
    dataPromise.then(data => {
        // console.log(data);

        // Chart y Values
        let yValues = Object.values(data.samples[index].sample_values);

        // Chart x Values
        let xValues = Object.values(data.samples[index].otu_ids);

        // Chart Hover Text
        let otuHover = Object.values(data.samples[index].otu_labels);
        // console.log(otuHover);

        let trace = {
            x: xValues,
            y: yValues,
            text: otuHover,
            mode: 'markers',
            marker: {
                size: yValues,
                color: xValues,
            }
        };

        Plotly.newPlot('bubble', [trace]);

    });
};

function demographicInfo(index) {
    dataPromise.then(data => {
        console.log(data);
        
        // Find metadata for selection
        let metaData = data.metadata[index];
        console.log(metaData);

        // Select metadata section in HTML
        let demographicInfo = d3.select('#sample-metadata');

        // Clear metadata section
        demographicInfo.html('');

        // Add new metadata to section
        Object.entries(metaData).forEach(([key, value]) => {
            demographicInfo.append('h4').html(`<b>${key}:</b> ${value}`);
        });

    });
};

// Function called by DOM changes
function optionChanged() {
    let dropdownMenu = d3.select('#selDataset');

    // Assign the value of the dropdown menu
    let selectedIndex = dropdownMenu.property('selectedIndex');
  
    // Call function to update the chart
    drawBarGraph(selectedIndex);
    drawBubbleGraph(selectedIndex);
    demographicInfo(selectedIndex);
};
  
init();

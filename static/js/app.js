// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(meta => meta.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) =>{
      panel.append("p").text(`${key}: ${value}`);
});
  }).catch(error => console.error(error));
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;
    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Viridis',
  }
};

const bubbleData = [bubbleTrace];
const bubbleLayout = {
  title : 'Bubble Chart of OTUs',
  xaxis: {title: 'OTU IDs'},
  yaxis: {title: 'Number of Bacteria'},
  showlegend: false,
};
    // Render the Bubble Chart
Plotly.newPlot('bubble', bubbleData, bubbleLayout).catch(error => console.error(error));

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
const barData = sample_values
  .map((value, index) => ({
    value: value,
    label: otu_ids[index],
    hoverText: otu_labels[index]
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 10); //Top 10

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
const barTrace = {
  x: barData.map(d => d.value).reverse(),
  y: barData.map(d => `OTU ${d.label}`).reverse(),
  text: barData.map(d => d.hoverText).reverse(),
  type: 'bar',
  orientation: 'h',
};
const barDataFinal = [barTrace];
const barLayout = {
  title: 'Top 10 Bacteria Cultures Found',
  xaxis: {title: 'Number of Bacteria'},
 
};



    // Render the Bar Chart
Plotly.newPlot('bar', barDataFinal, barLayout).catch(error => console.error(error));
  }).catch(error => console.error(error));
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
const select = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
names.forEach(name => {
  select.append("option").text(name).property("value", name);
});

    // Get the first sample from the list
const firstSample = names[0];

    // Build charts and metadata panel with the first sample
buildCharts(firstSample);
buildMetadata(firstSample);
  }).catch(error => console.error(error));
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


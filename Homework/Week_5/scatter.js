// Name: Julien Fer
// Studentnumber: 10649441
//
// This template shows a scatter plot of the unemployment rate
// in the Netherlands (2018)

function title(txt) {
  d3.select("head")
    .append("title")
    .attr("class", "title")
    .attr("id", "titleHead")
    .text(txt);
}

function addParagraph(txt, id) {
  d3.select("body")
    .append("p")
    .attr("class", "paragraph")
    .attr("id", id)
    .text(txt);
}

function transformResponse(data) {
  let dataTotal = [];

  // acces data property of the response
  // console.log(data[0].dataSets.series);
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i]);
    let dataHere = data[i].dataSets[0].series;
    // console.log(dataHere);

    // access variables in the response and save length for later
    let series = data[i].structure.dimensions.series;
    let seriesLength = series.length;
    // console.log(series);
    // console.log(seriesLength);

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });
    // console.log(varArray);
    // console.log(lenArray);

    // get the time periods in the dataset
    let observation = data[i].structure.dimensions.observation[0];
    // console.log(observation);

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);
    // console.log(varArray);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);
    // console.log(strings);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach( function(string) {
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });
    // add dataArray to dataTotal
    dataTotal.push(dataArray);
    // console.log(dataArray);
  }
  return dataTotal
}

function preproccesing (dataset, countries) {
  // console.log(dataset);

  // let mstiVar = {
  //   "2007": [],
  //   "2008": [],
  //   "2009": [],
  //   "2010": [],
  //   "2011": [],
  //   "2012": [],
  //   "2013": [],
  //   "2014": [],
  //   "2015": []
  // };
  //
  // let consumer = {
  //   "2007": [],
  //   "2008": [],
  //   "2009": [],
  //   "2010": [],
  //   "2011": [],
  //   "2012": [],
  //   "2013": [],
  //   "2014": [],
  //   "2015": []
  // };

  dataComplete = {
    "2007": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2008": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2009": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2010": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2011": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2012": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2013": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2014": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []},
    "2015": {"France": [], "Germany": [], "Korea": [], "Netherlands": [], "Portugal": [], "United Kingdom": []}
  }

  // create array to keep count of all dataPoints MSTI variables
  // let allDatapoints = [];
  let index = 0;
  let country = "";

  dataset.forEach( function(variable, i) {
    variable.forEach( function(data){
      if ("MSTI Variables" in data) {
        if (data.time == "2007") {
          index++;
          // let tempObj = {};
          country = countries[index - 1];
        }
        // let tempObj = {};
        dataComplete[data.time][country].push(data.datapoint);
        // tempObj[country] = data.datapoint;
        // mstiVar[data["time"]].push(tempObj);
      } else if (data.Indicator == "Consumer confidence")  {
        // let tempObj = {};
        dataComplete[data.time][data.Country].push(data.datapoint);
        // tempObj[data.Country] = data.datapoint;
        // consumer[data.time].push(tempObj);
      }
    })
    // console.log(mstiVar);
    // console.log(consumer);
  });
  // years.forEach( function(year) {
  //
  // });
  console.log(dataComplete);
  return dataComplete
  // dataset[0] = mstiVar;
  // dataset[1] = consumer;
}

function createSvg(dimGraph, string) {
  return d3.select("body")
          .append("svg")
          .attr("class", string)
          .attr("width", dimGraph.width)
          .attr("height", dimGraph.height);
}

function scaleLinear(dimGraph, margins) {
  return d3.scaleLinear()
          .domain([0, d3.max(dimGraph.data)])
          .range([dimGraph.height - (margins.top + margins.bottom), (margins.top + margins.bottom)]);
}

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

let dimGraph = {
  "width": 1000,
  "height": 500,
};

const margins = {
  "left": 50,
  "right": 50,
  "top": 50,
  "bottom": 50
}

const countries = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"];
const years = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"];

window.onload = function() {
  var requests = [d3.json(womenInScience), d3.json(consConf)];
  // console.log(requests);
  title("Scatter plot");
  addParagraph("Correlation between percentage female resaerchers and consumer confidence", "titlePage");
  addParagraph("Name: Julien Fer", "name");
  addParagraph("Studentnumber: 10649441", "studentnumber");
  addParagraph("Link to dataset will come here", "link");


  Promise.all(requests).then(function(response) {
    let dataset = transformResponse(response);
    // console.log(dataset);
    dataset = preproccesing(dataset, countries);
    dimGraph["data"] = dataset;
    // dimGraph.data.push(dataset);
    console.log(dimGraph.data);
    console.log(Object.values(dimGraph.data["2007"]));
    let svg = createSvg(dimGraph, "svg");
    svg.selectAll("circle")
   .data(Object.values(dimGraph.data["2007"]))
   .enter()
   // .text(console.log(dimGraph.data[0]))
   .text( function(d) {
     console.log(d);
   })
   .append("circle")
   .attr("cx", function(d) {
     return d[0];
   })
   .attr("cy", function(d) {
     return d[1];
   })
   .attr("r", 5);
    // console.log(dataset);
  }).catch(function(e){
      throw(e);
  });
};

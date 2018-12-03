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

function createSvg(dimGraph, string) {
  return d3.select("body")
          .append("svg")
          .attr("class", string)
          .attr("width", dimGraph.width)
          .attr("height", dimGraph.height);
}

function preproccesing (dataset) {
  console.log(dataset);
  let mstiVar = {
    "2007": [],
    "2008": [],
    "2009": [],
    "2010": [],
    "2011": [],
    "2012": [],
    "2013": [],
    "2014": [],
    "2015": []
  };

  let consumer = {
    "2007": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2008": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2009": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2010": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2011": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2012": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2013": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2014": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0},
    "2015": {"France": 0, "Netherlands": 0, "Portugal": 0, "Germany": 0, "United Kingdom": 0, "Korea": 0}
  };
  let country = [];
  let year = [];
  let consumerConfedince = [];
  dataset.forEach( function(variable, i) {
    // console.log(Object.keys(variable[i]));
    // console.log(Object.entries(variable[i]))
    variable.forEach( function(data){
      if ("MSTI Variables" in data) {
        mstiVar[data["time"]].push(data.datapoint);
      } // else {
      //   let year = data.time;
      //   let country = data.Country;
      //   consumer.year.country = data.datapoint
      //   // consumer.data["time"].consumer.data["Country"] = data.datapoint;
      //   console.log(data.datapoint);
      // }
      // console.log(("MSTI Variables" in data))
    })
    console.log(mstiVar);
    // console.log(consumer);
  });
}

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

const dimGraph = {
  "width": 1000,
  "height": 500
};

const margins = {
  "left": 50,
  "right": 50,
  "top": 50,
  "bottom": 50
}

window.onload = function() {
  var requests = [d3.json(womenInScience), d3.json(consConf)];
  // console.log(requests);
  title("Scatter plot");

  Promise.all(requests).then(function(response) {
    let dataset = transformResponse(response);
    preproccesing(dataset);
    let svg = createSvg(dimGraph, "svg");
   //  svg.selectAll("circle")
   // .data(dataset)
   // .enter()
   // .append("circle")
   // .attr("cx", function(d) {
   //      return d[0];
   // })
   // .attr("cy", function(d) {
   //      return d[1];
   // })
   // .attr("r", 5);
    // console.log(dataset);
  }).catch(function(e){
      throw(e);
  });
};

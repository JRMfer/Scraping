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
    let data = transformResponse(response);
    console.log(data);
  }).catch(function(e){
      throw(e);
  });
};

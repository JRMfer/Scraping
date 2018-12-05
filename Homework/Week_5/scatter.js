// Name: Julien Fer
// Studentnumber: 10649441
//
// This script contains the functionality to show a scatter plot of
// the percentage of female researchers against the consumer confidence of
// 6 countries from 2007-2015.


function title(txt) {
  // makes title for head
  d3.select("head")
    .append("title")
    .attr("class", "title")
    .attr("id", "titleHead")
    .text(txt);
}

function addParagraph(txt, id) {
  // add paragraph to body
  d3.select("body")
    .append("p")
    .attr("class", "paragraph")
    .attr("id", id)
    .text(txt);
}

function addLink(txt, url) {
  // add links to body
  d3.select("body")
    .append("p")
    .attr("class", "paragraph")
    .attr("id", "link")
    .text(txt)
    .on("click", function() {
      window.open(url);
    });
}

function transformResponse(data) {
  // tranforms dataset received from API tom appropiate format
  let dataTotal = [];

  // acces data property of the response
  for (let i = 0; i < data.length; i++) {

    let dataHere = data[i].dataSets[0].series;

    // access variables in the response and save length for later
    let series = data[i].structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie) {
      varArray.push(serie);
      lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data[i].structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);
    // console.log(varArray);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string) {
      // for each observation and its index
      observation.values.forEach(function(obs, index) {
        let data = dataHere[string].observations[index];
        if (data != undefined) {

          // set up temporary object
          let tempObj = {};

          let tempString = string.split(":").slice(0, -1);
          tempString.forEach(function(s, indexi) {
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
  }
  return dataTotal
}

function preproccesing(dataset, dimGraph) {
  // this function preprocceses the dataset to a more usefull Object

  // setup dictionary, with a key for every year and within this year keys for
  // the different countries in which a list with the datapoints will be constructed.
  dataComplete = {
    "2007": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2008": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2009": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2010": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2011": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2012": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2013": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2014": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    },
    "2015": {
      "France": [],
      "Germany": [],
      "Korea": [],
      "Netherlands": [],
      "Portugal": [],
      "United Kingdom": []
    }
  }

  // create counter to keep track of the index
  let index = 0;

  // loops over dataset per variable, and stores datapoints in dictionary
  // created earlier
  dataset.forEach(function(variable, i) {
    variable.forEach(function(data) {
      if ("MSTI Variables" in data) {
        if (data.time == "2007") {
          index++;
          country = dimGraph.countries[index - 1];
        }
        dataComplete[data.time][country].push(data.datapoint);
      } else if (data.Indicator == "Consumer confidence") {
        dataComplete[data.time][data.Country].push(data.datapoint);
      }
    })
  });
  // returns the "new" dataset as dictionary
  return dataComplete;
}

function createSvg(dimGraph, string) {
  // creates SVG element
  return d3.select("body")
    .append("svg")
    .attr("class", string)
    .attr("width", dimGraph.width)
    .attr("height", dimGraph.height);
}

function findMaxObject(dimGraph) {
  // find maximum value of every variable in dataset
  dataVar1 = [];
  dataVar2 = [];
  maxValue = [];

  // this loop gets the values for each year and each country for the two
  // the variables in dataset
  dimGraph.years.forEach(function(year) {
    dimGraph.countries.forEach(function(country) {
      // checks if datapoints are complete, if not append to appropiate list
      if (dimGraph.data[year][country].length === 2) {
        dataVar1.push(dimGraph.data[year][country][0]);
        dataVar2.push(dimGraph.data[year][country][1]);
      } else {
        dataVar2.push(dimGraph.data[year][country][0]);
      }
    })
  })
  maxValue.push(d3.max(dataVar1));
  maxValue.push(d3.max(dataVar2));
  // returns max value of the two variables
  return maxValue;
}

function findMinObject(dimGraph) {
  // find minimum value of every variable in dataset

  dataVar1 = [];
  dataVar2 = [];
  minValue = [];

  // this loop gets the values for each year and each country for the two
  // the variables in dataset
  dimGraph.years.forEach(function(year) {
    dimGraph.countries.forEach(function(country) {
      // checks if datapoints are complete, if not append to appropiate list
      if (dimGraph.data[year][country].length === 2) {
        dataVar1.push(dimGraph.data[year][country][0]);
        dataVar2.push(dimGraph.data[year][country][1]);
      } else {
        dataVar2.push(dimGraph.data[year][country][0]);
      }
    })
  })
  minValue.push(d3.min(dataVar1));
  minValue.push(d3.min(dataVar2));
  // returns min value of the two variables
  return minValue;
}

function xScaleLinear(dimGraph, margins, domain) {
  // setup linear scale for x values

  return d3.scaleLinear()
    .domain(domain)
    .range([margins.left, dimGraph.width - margins.right])
}

function yScaleLinear(dimGraph, margins, domain) {
  // setup linear scale for y values

  return d3.scaleLinear()
    .domain(domain)
    .range([dimGraph.height - margins.bottom, margins.top]);
}

function rScaleLinear(domain, range) {
  // setup linear scale for radius circles

  return d3.scaleLinear()
    .domain(domain)
    .range(range);
}

function drawGraph(svg, dimGraph, year) {
  // this function draws a scatter plot given the dimensions of the graph and
  // the year to be analyzed.

  // setup tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

  // add circles (datapoints) to SVG, so basically draws graph
  svg.selectAll("circle")
    .data(Object.values(dimGraph.data[year]))
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      // check if datapoints are complete, if so returns scaled x value
      if (d.length > 1) {
        return dimGraph.xScale(d[0]);
      }
    })
    .attr("cy", function(d) {
      // check if datapoints are complete, if so returns scaled y value
      if (d.length > 1) {
        return dimGraph.yScale(d[1]);
      }
    })
    .attr("r", function(d) {
      // check if datapoints are complete, if so returns scaled radius
      if (d.length > 1) {
        return dimGraph.rScale(d[1]);
      }
    })
    .attr("fill", function(d, i) {
      // check if datapoints are complete,
      // if so returns corresponding color of country
      if (d.length > 1) {
        return dimGraph.colors[i];
      }
    })
    // add mouseover effect: shows the values of the datapoint while hovering
    .on('mouseover', function(d, j) {
      if (d.length > 1) {
        tooltip.transition()
          .style('opacity', 1)
        // shows value while hovering over scatter point
        tooltip.html(d[0].toFixed(2) + "%  ,  " + d[1].toFixed(2))
          .style('left', dimGraph.xScale(d[0]) + 'px')
          .style('top', (dimGraph.yScale(d[1]) + margins.bottom + margins.top) + 'px')

        d3.select(this).style('opacity', 0.5)
      }
    })
    // set mouseout effects
    .on('mouseout', function(d) {
      if (d.length > 1) {
        tooltip.transition()
          .style('opacity', 0)
        d3.select(this).style('opacity', 1)
      }
    });

  // add legend to graph
  addLegend(svg, year, dimGraph.colors)
}

function addLegend(svg, year) {
  // function to draw legend for the graph

  // append area for legend to svg
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", dimGraph.width - margins.right + 50)
    .attr("y", margins.top + 50)
    .attr("height", dimGraph.height - margins.top - margins.bottom)
    .attr("width", margins.right - dimGraph.padding);

  // set border for legend
  var borderPath = svg.append("rect")
    .attr("x", dimLegend.x)
    .attr("y", dimLegend.y)
    .attr("height", dimLegend.height)
    .attr("width", dimLegend.width)
    .attr("id", "borderLegend")

  // add circles for legend with the color correspoding to the countries color
  legend.selectAll("circle")
    .data(Object.keys(dimGraph.data[year]))
    .enter()
    .append("circle")
    .attr("cx", dimLegend.x + 3 * dimLegend.padding)
    .attr("cy", function(d, i) {
      return dimLegend.y + 9 * dimLegend.padding + (i * 30);
    })
    .attr("r", 2 * dimLegend.padding)
    .style("fill", function(d, j) {
      return dimGraph.colors[j];
    });

  // add countries name to the legend
  legend.selectAll("text")
    .data(Object.keys(dimGraph.data[year]))
    .enter()
    .append("text")
    .attr("class", "labelsLegend")
    .text(function(d) {
      return d;
    })
    .attr("x", dimLegend.x + dimLegend.widthRect + 3 * dimLegend.padding)
    .attr("y", function(d, i) {
      return dimLegend.y + 10 * dimLegend.padding + (i * 30);
    });
}

function updateGraph() {
  // this function updates the plot depending on the choice of the user

  // gets value chosen by user
  let selectYear = d3.select(".dropdown")
    .property("value")

  // removes datapoints old scatterplot
  d3.select(".svg").selectAll("circle").remove();

  // draws datapoints selected scatter plot
  drawGraph(d3.select(".svg"), dimGraph, selectYear);
}

// global variables links datasets
var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

// global constant margins
const margins = {
  "left": 100,
  "right": 300,
  "top": 100,
  "bottom": 100
};

// global constant dimension graph
const dimGraph = {
  "width": 1000,
  "height": 700,
  "padding": 1,
  "colors": ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"],
  "countries": ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"],
  "years": ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
};

// global constant dimensions legend
const dimLegend = {
  "x": dimGraph.width - margins.right + 50,
  "y": (dimGraph.height - margins.top - margins.bottom) / 2 - 70,
  "height": 240,
  "width": 240,
  "widthRect": 20,
  "heightRect": 20,
  "padding": 5
}

// this function assures that the following is executed when the page is load
window.onload = function() {

  // request datasets
  var requests = [d3.json(womenInScience), d3.json(consConf)];

  // add title, a few paragraphs and links to datasets to the body
  title("Scatter plot");
  addParagraph("Correlation between percentage female researchers and consumer confidence", "titlePage");
  addParagraph("Name: Julien Fer", "name");
  addParagraph("Studentnumber: 10649441", "studentnumber");
  addLink("Dataset: Women in science", womenInScience);
  addLink("Dataset: Consumer confidence", consConf);
  addParagraph("This scatterplot shows the relation between consumer confidence and the percentage of female researchers in 6 countries", "explanation");

  // waits till requests are fullfilled
  Promise.all(requests).then(function(response) {

    // preprocceses dataset and add to dimension graph
    let dataset = transformResponse(response);
    dataset = preproccesing(dataset, dimGraph);
    dimGraph["data"] = dataset;

    // make dropdown with as options the different years and include the update
    // function, so when option is clicked this function will be called.
    let dropdown = d3.select("body")
      .append("select")
      .attr("class", "dropdown")
      .on('change', updateGraph);

    let options = dropdown.selectAll("option")
      .data(Object.keys(dimGraph.data))
      .enter()
      .append("option")
      .text(function(d) {
        return d;
      });

    // find max and min values of both variables and
    // setup scale functions for x,y values and the radius
    let maxValues = findMaxObject(dimGraph);
    let minValues = findMinObject(dimGraph);
    let xScale = xScaleLinear(dimGraph, margins, [0, minValues[0] + maxValues[0]]);
    let yScale = yScaleLinear(dimGraph, margins, [minValues[1] - dimGraph.padding,
                                                  maxValues[1] + dimGraph.padding]);
    let rScale = rScaleLinear([minValues[1] - dimGraph.padding, maxValues[1] +
                               dimGraph.padding], [10, 30]);

    // add scale functions to dimeonsions graph
    dimGraph["xScale"] = xScale;
    dimGraph["yScale"] = yScale;
    dimGraph["rScale"] = rScale;

    // creat x and y axis, as the scale functions are determined by the min and
    // max values it will be correct for all the possible graphs.
    let xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat(d => d + '%');
    let yAxis = d3.axisLeft()
      .scale(yScale);

    // create SVG
    let svg = createSvg(dimGraph, "svg");

    // append x and y axis to SVG at the appropiate place
    svg.append("g")
      .attr("class", "axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + (dimGraph.height - margins.bottom) + ")")
      .call(xAxis)

    svg.append("g")
      .attr("class", "axis")
      .attr("id", "yAxis")
      .attr("transform", "translate(" + margins.left + ",0)")
      .call(yAxis);

    // initialize first scatter plot to be shown
    let myScatter = drawGraph(svg, dimGraph, "2007")

    // create title
    svg.append("text")
      .attr("x", (dimGraph.width - margins.right - margins.left) / 4)
      .attr("y", margins.top / 2)
      .attr("id", "titleGraph")
      .text("Scatter plot: Consumer confidence against female researchers");

    // create title y axis
    svg.append("text")
      .attr("x", -dimGraph.height / 2)
      .attr("y", margins.left / 2)
      .attr("transform", "rotate(-90)")
      .attr("id", "titleAxis")
      .text("Consumer confidence");

    // create title x axis
    svg.append("text")
      .attr("x", dimGraph.width / 2 - margins.left)
      .attr("y", dimGraph.height - margins.bottom / 2)
      .attr("id", "titleAxis")
      .text("Percentage of female researchers");

  }).catch(function(e) {
    throw (e);
  });
};

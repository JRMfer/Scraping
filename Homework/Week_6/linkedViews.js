// Name: Julien Fer
// Studentnumber: 10649441
//
// This script contains the functionality to show a bar chart of the government
// spending of several countries in the European Union in 2014. The bar chart is
// also linked to a datamap, so the user can see the government spending
// per country.


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

var governmentSpending = "https://data.oecd.org/gga/central-government-spending.htm"
var spendingGovernment =  "Government_spending_2014.json"
var worldCountries = "http://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json"
var euCountries = "https://gist.githubusercontent.com/milafrerichs/69035da4707ea51886eb/raw/4cb1783c2904f52cbb8a258ee96031f9054d155b/eu.topojson"

// global constant margins
var marginsMap = {
  "left": 100,
  "right": 100,
  "top": 0,
  "bottom": 0
}

var dimMap = {
  "width": 850 - marginsMap.right - marginsMap.left,
  "height": 550 - marginsMap.top - marginsMap.bottom
}

var marginsBar = {
  "left": 100,
  "right": 100,
  "top": 100,
  "bottom": 100
}

var dimBar =  {
  "width": 850,
  "height": 550,
  "animateDuration": 700,
  "animateDelay": 75,
  "barPadding": 1
};

// this function assures that the following is executed when the page is load
window.onload = function() {

  // add title, a few paragraphs and links to datasets to the body
  title("Government spending 2014");
  addParagraph("Correlation between percentage female researchers and consumer confidence", "titlePage");
  addParagraph("Name: Julien Fer", "name");
  addParagraph("Studentnumber: 10649441", "studentnumber");
  addLink("Dataset: Central government spending", governmentSpending);
  addParagraph("This page shows the central goverment spending (2014) of countries in the European Union", "explanation");

  var format = d3.format(".1f");

  // Set tooltips
  var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([100, 100])
            .html(function(d, spending) {
              let shortName = d.properties.iso_a3;
              if (spending[shortName]) {
                let keys = Object.keys(spending[shortName]);
                let total = 0
                keys.forEach( function(key) {
                  total += spending[shortName][key];
                })
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Government spending: </strong><span class='details'>" + format(total) + "%" +"</span>";
                }
                else {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Government spending: </strong><span class='details'>" + undefined +"</span>";
                }
              });

  var svg = d3.select("#area1")
              .append("svg")
              .attr("height", dimMap.height + marginsMap.top + marginsMap.bottom)
              .attr("width", dimMap.width)
              .attr("id", "svg")
              .append("g")
              .attr("transform", "translate(" + marginsMap.left + "," + marginsMap.top  + ")");

  svg.call(tip);

let scores = [10, 20, 30, 40, 50, 60, 70, 80];
let colors = ["rgb(247,252,245)", "rgb(229,245,224)", "rgb(199,233,192)", "rgb(161,217,155)", "rgb(116,196,118)", "rgb(65,171,93)","rgb(35,139,69)","rgb(0,90,50)"];

  let color = d3.scaleThreshold()
    .domain(scores)
    .range(colors);

  /*
    Read in eu.topojson
    Read in Government_spending_2014.json
  */

  var requests = [d3.json(euCountries), d3.json(spendingGovernment)]

  Promise.all(requests).then( function(response) {
    let topology = response[0];
    let data = response[1];
    dimBar["data"] = data;
    console.log(topology);
    console.log(dimBar["data"]);
    ready(0, topology, data);
    drawBarChart("#area2", marginsBar, dimBar, "barChart", "OECD");
  }).catch( function(e) {
    throw (e);
  });

  /*
    Create a new projection using Mercator (geoMercator)
    and center it (translate)
    and zoom in a certain amount (scale)
  */
  let projection = d3.geoMercator()
    .translate([dimMap.width / 5, dimMap.height * 1.4])
    .scale(415)

  /*
    create a path (geoPath)
    using the projection
  */
  let path = d3.geoPath()
    .projection(projection)

  function ready(error, data, spending) {
    /*
      topjson.feature converts
      our RAW geo data into USEABLE geo data
      always pass it data, then data.objects.__something__
      then get .features out of it
    */

    var countries = topojson.feature(data, data.objects.europe).features
    console.log(countries);
    console.log(spending);


    /*
      Add a path for each country
    */

    svg.selectAll(".country")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", function(d){
        let shortName = d.properties.iso_a3;
        if (spending[shortName]) {
          let keys = Object.keys(spending[shortName]);
          let total = 0
          keys.forEach( function(key) {
            total += spending[shortName][key];
          })
          return color(total);
          }
          else {
            return "rgb(255, 255, 255)";
          }
      })
      .on("mouseover", function(d) {
        d3.select(this).classed("selected", true);
        tip.show(d, spending);
      })
      .on("mouseout", function(d) {
        d3.select(this).classed("selected", false);
        tip.hide(d, spending);
      })
      .on("click", function(d) {
        console.log("Hello world!");
      })

      var legend = svg.selectAll(".legend")
          .data(scores)
          .enter().append('g')
          .attr("class", "legend")
          .attr("transform", function (d, i) {
          {
              return "translate(-75," + i * 20 + ")";
          }
      })

      legend.append('rect')
          .attr("x", 0)
          .attr("y", 250)
          .attr("width", 20)
          .attr("height", 20)
          .style("fill", function (d, i) {
          return color(d - 1);
      })

      legend.append('text')
          .attr("x", 30)
          .attr("y", 265)
      //.attr("dy", ".35em")
      .text(function (d, i) {
          return "< " + d + "%";
      })
          .attr("class", "textselected")
          .style("text-anchor", "start")
          .style("font-size", 15)
  }

  function findMaxObject(data) {
    let keys = Object.keys(data);
    let maxValue = 0;
    keys.forEach( function(key) {
      if (data[key] > maxValue){
        maxValue = data[key];
      }
    })
    return maxValue;
  }

  function findMinObject(data) {
    let keys = Object.keys(data);
    let minValue = 0;
    keys.forEach( function(key) {
      if (data[key] < minValue){
        minValue = data[key];
      }
    })
    if (minValue >= 0) {
      return 0;
    }
    else {
      return minValue;
    }
  }

  function drawBarChart(area, margins, dim, id, country) {
    // set up svg element
    var svg = d3.select(area)
      .append("svg")
      .attr("class", "svg")
      .attr("id", id)
      .attr("width", dim.width)
      .attr("height", dim.height);

    // set yScale graph
    var yScale = d3.scaleLinear()
      .domain([0, findMaxObject(dim.data[country])])
      .range([dim.height - margins.top, margins.bottom]);

    console.log(yScale(0));
    console.log(yScale(findMaxObject(dim.data[country])));
    keys = Object.keys(dim.data[country]);

    // set xScale graph
    var xScale = d3.scaleLinear()
      .domain([0, keys.length])
      .range([margins.left, dim.width - margins.right]);

    var tooltip = d3.select(area).append("div")
      .attr("class", "tooltip");

    // draw graph
    var myChart = svg.selectAll("rect")
      .data(Object.keys(dim.data[country]))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", function(d) {
        return d;
      })
      // set bars at the right coordinates
      .attr("x", function(d, i) {
        return xScale(i);
      })
      .attr("y", function(d) {
        console.log(dim.height - yScale(dim.data[country][d]));
        return yScale(dim.data[country][d]);
      })
      // adjust color bars according to their value
      .attr("fill", function(d) {
        return "rgb(102, " + (dim.data[country][d] * 10) + ", 102)";
      })
      // set width and height of the bars
      .attr("width", (dim.width - margins.left - margins.right) / keys.length -
        dim.barPadding)
      .attr("height", function(d) {
        console.log(yScale(dim.data[country][d]));
        return dim.height - yScale(dim.data[country][d]);
      })
      // setup mouseover hover effect
      .on('mouseover', function(d, j) {
        tooltip.transition()
          .style('opacity', 1)
        // shows value while hovering over bar
        tooltip.html(d + ": " + dim.data[country][d] + "%")
          .style('left', (xScale(j) + 0.5 * (dim.width - margins.left - margins.right) /
              5 - dim.barPadding) +
            'px')
          .style('top', (yScale(d) + margins.top + margins.bottom) + 'px')

        d3.select(this).style('opacity', 0.5)
      })
      // set mouseout effects
      .on('mouseout', function(d) {
        tooltip.transition()
          .style('opacity', 0)
        d3.select(this).style('opacity', 1)
      });
  }
}

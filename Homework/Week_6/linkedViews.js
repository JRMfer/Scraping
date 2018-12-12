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
var margins = {
  "left": 100,
  "right": 100,
  "top": 0,
  "bottom": 0
}

var dimMap = {
  "width": 1000 - margins.right - margins.left,
  "height": 500 - margins.top - margins.bottom
}

// this function assures that the following is executed when the page is load
window.onload = function() {

  // add title, a few paragraphs and links to datasets to the body
  title("Government spending 2014");
  addParagraph("Correlation between percentage female researchers and consumer confidence", "titlePage");
  addParagraph("Name: Julien Fer", "name");
  addParagraph("Studentnumber: 10649441", "studentnumber");
  addLink("Dataset: Central government spending", governmentSpending);
  addParagraph("This page shows the central goverment spending (2014) of countries in the European Union", "explanation");

  var format = d3.format(",");

  // Set tooltips
  var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) +"</span>";
            });

  var svg = d3.select("body")
              .append("svg")
              .attr("height", dimMap.height + margins.top + margins.bottom)
              .attr("width", dimMap.width)
              .attr("id", "map")
              .append("g")
              .attr("transform", "translate(" + margins.left + "," + margins.top  + ")");

  /*
    Read in eu.topojson
    Read in Government_spending_2014.json
  */

  var requests = [d3.json(euCountries), d3.json(spendingGovernment)]

  Promise.all(requests).then( function(response) {
    let topology = response[0];
    let data = response[1];
    console.log(topology);
    console.log(data);
    ready(0, topology)
  }).catch( function(e) {
    throw (e);
  });

  /*
    Create a new projection using Mercator (geoMercator)
    and center it (translate)
    and zoom in a certain amount (scale)
  */
  let projection = d3.geoMercator()
    .translate([dimMap.width / 7, dimMap.height * 1.55])
    .scale(425)

  /*
    create a path (geoPath)
    using the projection
  */
  let path = d3.geoPath()
    .projection(projection)

  function ready(error, data) {
    /*
      topjson.feature converts
      our RAW geo data into USEABLE geo data
      always pass it data, then data.objects.__something__
      then get .features out of it
    */

    var countries = topojson.feature(data, data.objects.europe).features
    console.log(countries);


    /*
      Add a path for each country
    */

    svg.selectAll(".country")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
  }
}

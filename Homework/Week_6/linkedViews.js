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

// this function assures that the following is executed when the page is load
window.onload = function() {

  // add title, a few paragraphs and links to datasets to the body
  title("Government spending 2014");
  addParagraph("Correlation between percentage female researchers and consumer confidence", "titlePage");
  addParagraph("Name: Julien Fer", "name");
  addParagraph("Studentnumber: 10649441", "studentnumber");
  addLink("Dataset: Women in science", governmentSpending);
  addParagraph("This page shows the central goverment spending (2014) of countries in the European Union", "explanation");
}

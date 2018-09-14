const fs = require('fs');

const readableStream = fs.createReadStream('Indicators.csv');

const jsonObj = [];
const jsonObj3 = [];
let header;
// index values inside the csv files;
const countryName = 0;
const indicatorName = 2;

const year = 4;
const value = 5;
let arr = [];
let urban = [];
let rural = [];

var countries = ['India', 'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei'
  , 'Cambodia', 'China', 'Cyprus', 'Georgia', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan'
  , 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman'
  , 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Russia', 'Saudi Arabia', 'Singapore', 'South Korea'
  , 'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan'
  , 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'];

readableStream.setEncoding('utf8');
readableStream.on('data', (chunk) => {
  const lines = chunk.split('\n');
  header = lines[0];
  lines.forEach((line) => {
    createJSON(line);
  });
});

// creates JSON objects and writes into array result
function createJSON(line) {
  const elements = line.split(',');
  // console.log(elements[0])
  if (elements[countryName] == 'India') {
    if (elements[year] >= 1960 && elements[year] <= 2015) {
      if (elements[indicatorName].includes('Urban population growth (annual')) {
        let obj = {
          country: elements[countryName],
          indicator: elements[indicatorName],
          yr: elements[year],
          val: elements[value],
        };
        jsonObj.push(obj);
      }

      else if (elements[indicatorName] === 'Urban population (% of total)') {

        let tempObj = {
          yr: elements[year],
          val: elements[value]
        };
        urban.push(tempObj);
        //console.log(urban);
      }
      else if (elements[indicatorName] === 'Rural population (% of total population)') {

        let tempObj = {
          yr1: elements[year],
          val1: elements[value]
        };
        rural.push(tempObj);
        //console.log(rural);
      }
    }
  }
  for (let i = 0; i < countries.length; i++) {
    if (countries[i] === elements[countryName]) {
      if (elements[indicatorName] === "Urban population" || elements[indicatorName] === "Rural population") {
        let obj = {
          country: elements[countryName],
          indicator: elements[indicatorName],
          yr: elements[year],
          val: elements[value],
        }
        jsonObj3.push(obj);
      }
    }
  }
}
readableStream.on('end', function () {

  for (i = 0; i < urban.length; i++) {
    for (j = 0; j < rural.length; j++) {
      if (i === j) {
        let tempObj = Object.assign(rural[j], urban[j]);
        arr.push(tempObj);
      }
    }
  }

  var myJSON = JSON.stringify(arr);

  fs.writeFile("output/part1.json", myJSON, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });

  var myJSON = JSON.stringify(jsonObj);

  fs.writeFile("output/app.json", myJSON, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
  var myJSON = JSON.stringify(jsonObj3);

  fs.writeFile("output/part3.json", myJSON, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
});


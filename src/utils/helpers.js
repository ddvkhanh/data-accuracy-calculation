const fs = require("fs");
const isEqual = require('lodash.isequal');
const userURL="public/logs.json"
const compURL="public/computerLogCount.json"

//Read CSV
extractJSON = function (file) {
  try {
    const dataBuffer = fs.readFileSync(file);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};
const staticRecords = [
  { BarCode: "021860", ShortendDiameter: 48 },
  { BarCode: "021858", ShortendDiameter: 56 },
  { BarCode: "021856", ShortendDiameter: 48 },
  { BarCode: "022934", ShortendDiameter: 66 },
  { BarCode: "022932", ShortendDiameter: 58 },
  { BarCode: "022930", ShortendDiameter: 42 },
  { BarCode: "022928", ShortendDiameter: 28 },
  { BarCode: "91495", ShortendDiameter: 34 },
  { BarCode: "91496", ShortendDiameter: 34 },
  { BarCode: "91498", ShortendDiameter: 40 },
];
const barcodeAdSEDMap = {};
staticRecords.forEach((element) => {
  barcodeAdSEDMap[element.BarCode] = element.ShortendDiameter;
});

//Create computer-generated CSV file
// this is hard-coded for now
calculateLogCount = () => {


  let logData = JSON.stringify(staticRecords, null, 2);
  fs.writeFileSync("computerLogCount.json", logData);

};

//Compare datasets of human and computer generated
compareLogCount= ()=>{
  console.log("in");
  console.log(isEqual(userURL, compURL));
};

console.log("ref",barcodeAdSEDMap )

module.exports = {
    extractJSON,
    calculateLogCount,
    compareLogCount,
    staticRecords,
    barcodeAdSEDMap
};

const fs = require("fs");

//Read CSV
extractCSV = function (file) {
  try {
    const dataBuffer = fs.readFileSync(file);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

//Create computer-generated CSV file
// this is hard-coded for now
calculateLogCount = () => {
  let records = [
    { BarCode: "AAB112", ShortendDiameter: 8 },
    { BarCode: "AAB113", ShortendDiameter: 8 },
    { BarCode: "AAB114", ShortendDiameter: 8 },
    { BarCode: "AAB115", ShortendDiameter: 8 },
    { BarCode: "AAB116", ShortendDiameter: 8 },
    { BarCode: "AAB117", ShortendDiameter: 8 },
    { BarCode: "AAB118", ShortendDiameter: 8 },
    { BarCode: "AAB119", ShortendDiameter: 8 },

  ];

  let logData = JSON.stringify(records, null, 2);
  fs.writeFileSync("computerLogCount.json", logData);
  console.log(logData);
};

module.exports = {
  extractCSV,
  calculateLogCount
};

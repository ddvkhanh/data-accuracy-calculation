console.log("Client-side code running");

///@function: This function is for uploading CSV file

//@event handler: Upload CSV button
//@input:         user file
//@output:        Upload status + json content extracted from that file

const csvInput = document.getElementById("csv-input");
const imgInput = document.getElementById("img-input");
const fileform = document.getElementById("fileform");
const csv_input_error = document.getElementById("csv-input-error");
const img_input_error = document.getElementById("img-input-error");
const img_server_error = document.getElementById("img-input-error");
function validateInputs() {
  let result = true;
  csv_input_error.classList.add("hidden");
  img_input_error.classList.add("hidden");
  if (csvInput.files.length == 0) {
    csv_input_error.classList.remove("hidden");
    result = false;
  }
  if (imgInput.files.length == 0) {
    img_input_error.classList.remove("hidden");
    result = false;
  }

  return result;
}

async function uploadImage() {
  try {
    if (imgInput.files.length == 0) return;
    const file = imgInput.files[0];
    console.log("file", file);
    const url = "/upload-log-image";
  
    const formData = new FormData();
    formData.append("log-image", file);
  
    const response = await fetch(
      url,
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "same-origin", // no-cors, *cors, same-origin
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData,
      } // body data type must match "Content-Type" header
    );
    return await response.json();
  } catch (error) {
    console.log("run into error");
  }

}

function computeStatsFromRefAndParsedData(refDataAsDictionary, parsedData) {
  //Find matching keys (BarCode), for every matched BarCode, calculate standard deviation

  const matches = [];
  const unmatches = [];
  const arrayStd = [];
  let matchCount = 0;
  //@function arrSum: calculate sum of array (for standard deviation calculation)

  Object.keys(parsedData).forEach((key) => {
    const BarCode = key;
    const ShortendDiameter = parsedData[key];
    const measurement = { ShortendDiameter, BarCode };
    if (refDataAsDictionary[BarCode]) {
      matches.push(measurement);
      matchCount++;
      //calculate standard deviation
      const diff = refDataAsDictionary[BarCode] - ShortendDiameter;
      arrayStd.push(Math.pow(diff, 2));
    } else {
      unmatches.push(measurement);
    }
  });
  return {
    matches,
    unmatches,
    arrayStd,
  };
}

async function onFormSubmit(e) {
  e.preventDefault();
  // if validation for 2 files fail display error message and then
  // stop calculation
  if (!validateInputs()) return;

  const csvFile = csvInput.files[0];

  var csvFileReader = new FileReader();
  const parsedData = {};
  csvFileReader.onload = async function () {
    const submittedDataRaw = CSVToArray(csvFileReader.result);
    for (let index = 1; index < submittedDataRaw.length; index++) {
      const key = submittedDataRaw[index][0];
      const value = submittedDataRaw[index][1];
      if (key) parsedData[key] = value;
    }

    // assume ref data is available here after upload Image success
    console.log("Ref data form server", refData);
    if (refData.error){
      img_server_error.classList.remove("hidden");
      img_server_error.innerHTML = refData.error;
      return;
    }
    console.log("parsed data", parsedData);
    const computedResult = computeStatsFromRefAndParsedData(
      refData,
      parsedData
    );
    console.log("computed result", computedResult);
    const { matches, unmatches, arrayStd } = computedResult;

    //Find standard error to determine calculation accuracy (original data set vs computer generated)
    const standardError = Math.sqrt(arrSum(arrayStd) / (matches.length - 2));
    generateDynamicTable(matches, "match-table");
    generateDynamicTable(unmatches, "unmatch-table");

    document.getElementById("accuracy").innerHTML = `${
      (matches.length / (matches.length + unmatches.length)) * 100
    }%`;
    document.getElementById("standard-error").innerHTML = standardError;
  };
  img_server_error.classList.add("hidden");
  const refData = await uploadImage();

  csvFileReader.readAsText(csvFile);
}

fileform.addEventListener("submit", onFormSubmit);

//@event handler:   Compute button
//@input:           click
//@output:          comparison table, BarCode matching rate, Mean standard error
/*const computeButton = document.getElementById("logcount-compute");
computeButton.addEventListener("click", async function (e) {
  console.log("Getting data from server");
  const refDataUrl = "/reference-records";
  const response = await fetch(refDataUrl);
  const refData = await response.json();
  const refDataAsDictionary = {};
  refData.forEach((element) => {
    refDataAsDictionary[element.BarCode] = element.ShortendDiameter;
  });

  

});*/

//@function:         Generate dynamic table
//@input:            array of json object
//@output:           table on web
function generateDynamicTable(logData, location) {
  var noOfLogs = logData.length;
  console.log(noOfLogs);
  if (noOfLogs > 0) {
    //Create dynamic table
    var table = document.createElement("table");
    table.style.width = "50%";
    table.setAttribute("border", "1");
    table.setAttribute("cellspacing", "0");
    table.setAttribute("cellpadding", "5");

    //retrieve col header
    var col = [];
    for (var i = 0; i < noOfLogs; i++) {
      for (var key in logData[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }
    console.log(col);

    //create table head
    var tHead = document.createElement("thead");

    //create row for table head
    var hRow = document.createElement("tr");

    //add column header to row of table head
    for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th");
      th.innerHTML = col[i];
      hRow.appendChild(th);
    }
    tHead.appendChild(hRow);
    table.appendChild(tHead);
    //create table bodu
    var tBody = document.createElement("tbody");

    //add column header to row of table head
    for (var i = 0; i < noOfLogs; i++) {
      var bRow = document.createElement("tr");
      for (var j = 0; j < col.length; j++) {
        var td = document.createElement("td");
        td.innerHTML = logData[i][col[j]];
        bRow.appendChild(td);
      }
      tBody.appendChild(bRow);
    }
    table.appendChild(tBody);
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById(location);
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  }
}

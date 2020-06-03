//Last update: 3/6/2020
//Purpose: Client-side of logcount page; Allow user to upload image and csv files, hit submit, then proceed data accuracy comparison


console.log("Client-side code running");

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


//@function:  This function is for uploading Image file

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

//@function:  Find matching keys (BarCode), for every matched BarCode, calculate standard deviation

function computeStatsFromRefAndParsedData(refDataAsDictionary, parsedData) {
  const matches = [];
  const unmatches = [];
  const arrayStd = [];
  let matchCount = 0;

  Object.keys(parsedData).forEach((key) => {
    const BarCode = key;
    const ShortendDiameter = parsedData[key];
    const measurement = { BarCode, ShortendDiameter };
    if (refDataAsDictionary[BarCode]) {
      const matchedMeasurement = {
        "Log number": BarCode,
        "Actual SED": ShortendDiameter,
        "Computed SED": refDataAsDictionary[BarCode],
      };

      matches.push(matchedMeasurement);
      matchCount++;
      //calculate standard deviation
      const diff = refDataAsDictionary[BarCode] - ShortendDiameter;
      arrayStd.push(Math.pow(diff, 2));
    } else {
      const unmatchedMeasurement = {
        Barcode: BarCode,
        "Actual SED": ShortendDiameter,
      };
      unmatches.push(unmatchedMeasurement);
    }
  });
  return {
    matches,
    unmatches,
    arrayStd,
  };
}

//@Event handler: Submit button
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
    // console.log("Ref data form server", refData);
    if (refData.error) {
      img_server_error.classList.remove("hidden");
      img_server_error.innerHTML = refData.error;
      return;
    }
    // console.log("parsed data", parsedData);
    const computedResult = computeStatsFromRefAndParsedData(
      refData,
      parsedData
    );
    // console.log("computed result", computedResult);
    const { matches, unmatches, arrayStd } = computedResult;

    //Find standard error to determine calculation accuracy (original data set vs computer generated)
    const standardError = Math.sqrt(arrSum(arrayStd) / (matches.length - 2));
    const roundedStandardError = roundToDecimal(standardError, 4);

    document.getElementById("total-logs").innerHTML = `Total logs: ${
      matches.length + unmatches.length
    }`;
    document.getElementById(
      "matched-barcodes"
    ).innerHTML = `Matched logs: ${matches.length}`;
    generateDynamicTable(matches, "match-table");
    document.getElementById(
      "unmatched-barcodes"
    ).innerHTML = `Unmatched logs: ${unmatches.length}`;
    generateDynamicTable(unmatches, "unmatch-table");

    document.getElementById("accuracy").innerHTML = `${
      (matches.length / (matches.length + unmatches.length)) * 100
    }%`;
    document.getElementById("standard-error").innerHTML = roundedStandardError;
  };
  img_server_error.classList.add("hidden");
  const response = await uploadImage();
  const refData = response.data;
  document.getElementById("server-image").src = response.processedImageUrl;

  csvFileReader.readAsText(csvFile);
}

fileform.addEventListener("submit", onFormSubmit);


var src = document.getElementById("img-input");
var target = document.getElementById("original-image");
showImage(src, target);

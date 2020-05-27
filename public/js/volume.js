console.log("Client-side code running");

const imgInput = document.getElementById("img-vol-input");
const fileformVol = document.getElementById("fileform-vol");
const img_input_error = document.getElementById("img-vol-input-error");
const img_server_error = document.getElementById("img-vol-server-error");
const logLength=document.getElementById("log-length").value;
const jasActual=document.getElementById("jas-actual").value;



async function uploadImage() {
  try {
    if (imgInput.files.length == 0) return;
    const file = imgInput.files[0];
    console.log("file", file);
    const url = "/upload-vol-log-image";

    const formData = new FormData();
    formData.append("log-vol-image", file);

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

fileformVol.addEventListener("submit", onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  // if validation for 2 files fail display error message and then
  // stop calculation

  console.log(logLength);
  console.log(jasActual);
  if (!validateInputs()) return;

  const refData = await uploadImage();

  console.log("Ref data form server", refData);
  if (refData.error){
    img_server_error.classList.remove("hidden");
    img_server_error.innerHTML = refData.error;
    return;
  }
  img_server_error.classList.add("hidden");
}

function validateInputs() {
  let result = true;
  img_input_error.classList.add("hidden");
  if (imgInput.files.length == 0) {
    img_input_error.classList.remove("hidden");
    result = false;
  }
  return result;
}

function retrieveCompData(){
  const parsedData = {};
  const computedResult = computeStatsFromRefAndParsedData(
    refData,
    parsedData
  );
}

function calculateLength6Plus(){

}

function caculateLengthWithin6(){

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
    const measurement = {  BarCode, ShortendDiameter };
    if (refDataAsDictionary[BarCode]) {
      const matchedMeasurement = {
        ...measurement,
        ReferenceShortendDiameter: refDataAsDictionary[BarCode],
      };
      
    }
  });
  return {
    matches,
    unmatches,
    arrayStd,
  };
}
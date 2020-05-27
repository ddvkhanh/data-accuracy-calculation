console.log("Client-side code running");

const imgInput = document.getElementById("img-vol-input");
const fileformVol = document.getElementById("fileform-vol");
const img_input_error = document.getElementById("img-vol-input-error");
const img_server_error = document.getElementById("img-vol-server-error");
const logLength = document.getElementById("log-length").value;
const jasActual = document.getElementById("jas-actual").value;
const centimeterCubeToMeterCubeDivisor = 10000;
const errorMargin = 0.0000001;
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
    console.log("Run into error", error);
  }
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

function onLogLengthChange(newLengthValue) {
  console.log("event", event);
  const localReferenceData = referenceData;
  console.log("reference", referenceData, localReferenceData);
  var computedData = referenceData.map(({ BarCode, ShortendDiameter }) => {
    return {
      "Bar code": BarCode,
      ShortendDiameter,
      volume:
        Math.round(volumeCalculator(ShortendDiameter, newLengthValue) * 10e7) /
        10e7,
    };
  });
  const totalVolume = computedData.reduce(
    (acc, curr) => acc + curr["volume"],
    0
  );
  console.log("total volume", totalVolume);
  document.getElementById("computed-total-volume").classList.remove("hidden");
  document.getElementById(
    "computed-total-volume-number"
  ).innerHTML = `${totalVolume} `;
  generateDynamicTable(computedData, "computed-table");
}

async function onFormSubmit(e) {
  e.preventDefault();
  // if validation for 2 files fail display error message and then
  // stop calculation

  console.log(logLength);
  console.log(jasActual);
  if (!validateInputs()) return;

  const refData = await uploadImage();
  const step2Section = document.getElementById("step2");
  const step3Section = document.getElementById("step3");

  console.log("Ref data form server", refData);
  console.log("refData", refData)
  if (refData.error) {
    img_server_error.classList.remove("hidden");
    img_server_error.innerHTML = refData.error;
    step2Section.classList.add("hidden");
    step3Section.classList.add("hidden");
    return;
  } else {
    referenceData = refData;
    if (step2Section.classList.contains("hidden")) {
      step2Section.classList.remove("hidden");
      step3Section.classList.remove("hidden");
    } else {
      onLogLengthChange(document.getElementById("log-length").value)
    }
 
  
  }
}

fileformVol.addEventListener("submit", onFormSubmit);

const preprocessDiameter = (diameterInCm) => {
  const roundedDownDiameter = Math.floor(diameterInCm);
  if (diameterInCm <= 14) return roundedDownDiameter;
  if (roundedDownDiameter % 2 == 0)
    // even number already
    return roundedDownDiameter;
  else return roundedDownDiameter - 1;
};
const testPreprocessDiameter = () => {
  const testDiameters = [
    {
      diameterInCm: 13.2,
      expected: 13,
    },
    {
      diameterInCm: 14,
      expected: 14,
    },
    {
      diameterInCm: 15.5,
      expected: 14,
    },
    {
      diameterInCm: 12.8,
      expected: 12,
    },
    {
      diameterInCm: 21.6,
      expected: 20,
    },
  ];
  testDiameters.map(({ diameterInCm, expected }) => {
    const result = preprocessDiameter(diameterInCm);
    const testResultString = `preproces diameter ${diameterInCm}, expected: ${expected}, actual: ${result} `;
    const printer = result != expected ? console.error : console.log;
    printer(testResultString);
  });
};

const volumeWhenLogLengthLessThan6M = (diameterInCm, length) => {
  const preprocessedDiameter = preprocessDiameter(diameterInCm);
  const result =
    (preprocessedDiameter ** 2 * length) / centimeterCubeToMeterCubeDivisor;
  return result;
};

const testVolumeWhenLogLengthLessThan6M = () => {
  const testData = [
    {
      diameterInCm: 13.2,
      length: 5,
      expected: 0.0845,
    },
    {
      diameterInCm: 21.5,
      length: 3,
      expected: 0.12,
    },
  ];
  testData.map(({ diameterInCm, length, expected }) => {
    const result = volumeWhenLogLengthLessThan6M(diameterInCm, length);
    const testResultString = `diameter: ${diameterInCm}, length:${length}
    , expected: ${expected}, actual:${result}`;
    const printer =
      Math.abs(result - expected) > errorMargin ? console.error : console.log;
    printer(testResultString);
  });
};

//testPreprocessDiameter();
//testVolumeWhenLogLengthLessThan6M();

const volumeWhenLogLengthMoreThan6M = (diameterInCm, length) => {
  const preprocessedDiameter = preprocessDiameter(diameterInCm);
  const roundedDownLength = Math.floor(length);
  const result =
    (preprocessedDiameter + (roundedDownLength - 4) / 2) ** 2 *
    (length / centimeterCubeToMeterCubeDivisor);
  return result;
};

const testVolumeWhenLogLengthMoreThan6M = () => {
  const testData = [
    {
      diameterInCm: 13.2,
      length: 8,
      expected: 0.18,
    },
    {
      diameterInCm: 21.5,
      length: 13.5,
      expected: 0.8103375,
    },
  ];
  testData.map(({ diameterInCm, length, expected }) => {
    const result = volumeWhenLogLengthMoreThan6M(diameterInCm, length);
    const testResultString = `diameter: ${diameterInCm}, length:${length}
    , expected: ${expected}, actual:${result}`;
    const printer =
      Math.abs(result - expected) > errorMargin ? console.error : console.log;
    printer(testResultString);
  });
};
//testVolumeWhenLogLengthMoreThan6M();

const volumeCalculator = (diameterInCm, length) =>
  length < 6
    ? volumeWhenLogLengthLessThan6M(diameterInCm, length)
    : volumeWhenLogLengthMoreThan6M(diameterInCm, length);

testVolumCalculator = () => {
  const diameter = [48, 56, 48, 66, 58, 42, 28, 34, 34, 40];
  const expectedWhenLengthIs6 = [
    1.4406,
    1.9494,
    1.4406,
    2.6934,
    2.0886,
    1.1094,
    0.5046,
    0.735,
    0.735,
    1.0086,
  ];
  const expectedWhenLengthIs3 = [
    0.6912,
    0.9408,
    0.6912,
    1.3068,
    1.0092,
    0.5292,
    0.2352,
    0.3468,
    0.3468,
    0.48,
  ];
  testCaseWithLength6 = diameter.map((value, index) => {
    return {
      diameterInCm: value,
      length: 6,
      expected: expectedWhenLengthIs6[index],
    };
  });
  testCaseWithLength3 = diameter.map((value, index) => {
    return {
      diameterInCm: value,
      length: 3,
      expected: expectedWhenLengthIs3[index],
    };
  });
  testCaseWithLength6
    .concat(testCaseWithLength3)
    .map(({ diameterInCm, length, expected }) => {
      const result = volumeCalculator(diameterInCm, length);
      const testResultString = `diameter: ${diameterInCm}, length:${length}
      , expected: ${expected}, actual:${result}`;
      const printer =
        Math.abs(result - expected) > errorMargin ? console.error : console.log;
      printer(testResultString);
    });
};

//testVolumCalculator();

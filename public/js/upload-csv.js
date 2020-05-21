/// This function is for uploading CSV file
///

function uploadCSV() {
    //Input: CSV file from user 
  const csvInput = document.getElementById("csv-input");
  const fileformCsv = document.getElementById("fileform-csv");

  //Steps: 
  fileformCsv.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("e", e.target);

    if (csvInput.files.length == 0) return;
    const file = csvInput.files[0];
    console.log("file", file);
    const url = "/upload-log-count-csv-file2";
    const formData = new FormData(fileformCsv);

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
    console.log("file fetch");
  });
}

//Output:
function testUploadCSV() {
  console.log("to be finish");
}

testUploadCSV();

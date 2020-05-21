console.log("Client-side code running");

/// This function is for uploading CSV file

const csvInput = document.getElementById("csv-input");
const fileformCsv = document.getElementById("fileform-csv");
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
  document.getElementById("csv-upload").innerHTML = "<p>Upload successful</p>";
  console.log("file fetch");
});

const computeButton = document.getElementById("logcount-compute");
computeButton.addEventListener("click", function (e) {
  const url = "../logs.json";
  const url2 = "../computerLogCount.json";

  // //Read JSON
  // const xmlhttp = new XMLHttpRequest();

  // xmlhttp.open("GET", url, true);
  // // xmlhttp.open("GET", url2, true);

  // xmlhttp.responseType = "json";

  // xmlhttp.onload = function (e) {
  //   const jsonResponse = this.response;
  //   console.log(jsonResponse.length);
  //   generateDynamicTable(jsonResponse);

  // };
  // xmlhttp.send();

  const loadFile = function (filePath, done) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onload = function () {
      console.log('response'+ JSON.stringify(this.response));
      const jsonResponse = this.response;
    };
    xhr.open("GET", filePath, true);
    xhr.send();
  };
  const myFiles = [url, url2];
  const jsonData = [];
  myFiles.forEach(function (file, i) {
    loadFile(file, function (responseText) {
      jsonData[i] = JSON.parse(responseText);
    });

  });





  //Generate dynamic table

  function generateDynamicTable(logData, div1, div2) {
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
    }

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
    var divContainer = document.getElementById("result-table");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  }
});

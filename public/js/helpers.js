function arrSum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = strDelimiter || ",";

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return arrData;
}
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

function showImage(src, target) {
  var fr = new FileReader();
  // when image is loaded, set the src of the image where you want to display it
  fr.onload = function (e) {
    target.src = this.result;
  };
  src.addEventListener("change", function () {
    // fill fr with image data
    fr.readAsDataURL(src.files[0]);
  });
}

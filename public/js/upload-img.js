/// This function is for uploading CSV file
///

function uploadImg() {
    //Input: CSV file from user 
  const imgInput = document.getElementById("img-input");
  const fileformImg = document.getElementById("fileform-img");

  //Steps: 
  fileformImg.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("e", e.target);

    if (imgInput.files.length == 0) return;
    const file = imgInput.files[0];
    console.log("file", file);
    const url = "/upload-log-image2";
    const formData = new FormData(fileformImg);

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
    console.log("Img file fetch");
  });
}

//Output:
function testUploadCSV() {
  console.log("Img to be finish");
}

testUploadCSV();


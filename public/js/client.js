console.log('Client-side code running');

const button = document.getElementById('logcount-compute');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
});


const csvInput = document.getElementById('csv-input');
const fileformCsv = document.getElementById('fileform-csv');
fileformCsv.addEventListener("submit", async function(e) {
  e.preventDefault();

  console.log('e', e.target);
 
 
  if (csvInput.files.length == 0) return;
  const file = csvInput.files[0];
  console.log('file',file);
  const url ="/upload-log-count-csv-file2";
  const formData = new FormData(fileformCsv)

  const response = await fetch(
    url,
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'same-origin', // no-cors, *cors, same-origin
    
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: formData
     } // body data type must match "Content-Type" header
  )
 
  console.log('response',response.json())
})
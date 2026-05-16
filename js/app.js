loadTableData();

initializeTableEvents();

const addColumnButton =
document.getElementById("addColumnButton");

addColumnButton.addEventListener("click", () => {

  addNewColumn();
});

const addRowButton =
document.getElementById("addRowButton");

addRowButton.addEventListener("click", () => {

  addNewRow();
});

const deleteColumnButton =
document.getElementById("deleteColumnButton");

deleteColumnButton.addEventListener("click", () => {

  deleteLastColumn();
});

const deleteRowButton =
document.getElementById("deleteRowButton");

deleteRowButton.addEventListener("click", () => {

  deleteLastRow();
});

const exportButton =
document.getElementById("exportButton");

exportButton.addEventListener("click", () => {

  exportJson();
});

const importButton =
document.getElementById("importButton");

const fileInput =
document.getElementById("fileInput");

importButton.addEventListener("click", () => {

  fileInput.click();
});

fileInput.addEventListener("change", (event) => {

  const file = event.target.files[0];

  if (!file) return;

  importJson(file);
});
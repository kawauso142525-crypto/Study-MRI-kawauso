let currentFileName = "default";

let tableData = [
  ["項目", "列1"],
  ["データ", ""]
];

async function init() {
  await saveFile(currentFileName, tableData);
  await refreshFiles();
  renderTable(tableData);
}

async function refreshFiles() {
  const fileNames = await getFileNames();
  const select = document.getElementById("fileSelect");

  select.innerHTML = "";

  fileNames.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  select.value = currentFileName;
}

document.getElementById("newFileButton").onclick = async () => {
  const name = prompt("ファイル名");
  if (!name) return;

  tableData = [["項目", "列1"], ["", ""]];

  await saveFile(name, tableData);
  currentFileName = name;

  await refreshFiles();
  renderTable(tableData);
};

document.getElementById("deleteFileButton").onclick = async () => {
  await deleteFile(currentFileName);
  await refreshFiles();
};

document.getElementById("saveButton").onclick = async () => {
  await saveFile(currentFileName, tableData);
  alert("保存完了");
};

document.getElementById("addRowButton").onclick = () => {
  addNewRow(tableData);
  renderTable(tableData);
};

document.getElementById("addColumnButton").onclick = () => {
  addNewColumn(tableData);
  renderTable(tableData);
};

document.getElementById("fileSelect").onchange = async (e) => {
  currentFileName = e.target.value;
  tableData = await loadFile(currentFileName);
  renderTable(tableData);
};

init();
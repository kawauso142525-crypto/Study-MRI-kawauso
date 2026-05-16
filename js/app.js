let currentFileName = "";

let tableData = [
  ["項目", "列1"],
  ["データ1", ""]
];

const fileSelect =
  document.getElementById("fileSelect");

const newFileButton =
  document.getElementById("newFileButton");

const deleteFileButton =
  document.getElementById(
    "deleteFileButton"
  );

const addRowButton =
  document.getElementById("addRowButton");

const addColumnButton =
  document.getElementById("addColumnButton");

const saveButton =
  document.getElementById("saveButton");

const exportButton =
  document.getElementById("exportButton");

const importInput =
  document.getElementById("importInput");

function refreshFileSelect() {

  const fileNames = getFileNames();

  fileSelect.innerHTML = "";

  fileNames.forEach((fileName) => {

    const option =
      document.createElement("option");

    option.value = fileName;

    option.textContent = fileName;

    fileSelect.appendChild(option);
  });

  if (currentFileName) {

    fileSelect.value = currentFileName;
  }
}

function loadCurrentFile() {

  const data =
    loadFile(currentFileName);

  if (data) {

    tableData = data;
  }

  renderTable(tableData);
}

newFileButton.addEventListener(
  "click",
  () => {

    const fileName =
      prompt(
        "ファイル名を入力してください"
      );

    if (!fileName) return;

    const defaultData = [
      ["項目", "列1"],
      ["データ1", ""]
    ];

    saveFile(fileName, defaultData);

    currentFileName = fileName;

    refreshFileSelect();

    loadCurrentFile();
  }
);

deleteFileButton.addEventListener(
  "click",
  () => {

    if (
      !confirm(
        "このファイルを削除しますか？"
      )
    ) {
      return;
    }

    deleteFile(currentFileName);

    const fileNames =
      getFileNames();

    if (fileNames.length === 0) {

      currentFileName = "default";

      tableData = [
        ["項目", "列1"],
        ["データ1", ""]
      ];

      saveFile(
        currentFileName,
        tableData
      );
    }
    else {

      currentFileName =
        fileNames[0];

      tableData =
        loadFile(currentFileName);
    }

    refreshFileSelect();

    renderTable(tableData);
  }
);

fileSelect.addEventListener(
  "change",
  () => {

    currentFileName =
      fileSelect.value;

    loadCurrentFile();
  }
);

addRowButton.addEventListener(
  "click",
  () => {

    addNewRow(tableData);

    renderTable(tableData);
  }
);

addColumnButton.addEventListener(
  "click",
  () => {

    addNewColumn(tableData);

    renderTable(tableData);
  }
);

saveButton.addEventListener(
  "click",
  () => {

    saveFile(
      currentFileName,
      tableData
    );

    alert("保存しました");
  }
);

exportButton.addEventListener(
  "click",
  () => {

    const dataStr = JSON.stringify(
      tableData,
      null,
      2
    );

    const blob = new Blob(
      [dataStr],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `${currentFileName}.json`;

    a.click();

    URL.revokeObjectURL(url);
  }
);

importInput.addEventListener(
  "change",
  (event) => {

    const file =
      event.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (e) => {

      tableData =
        JSON.parse(e.target.result);

      renderTable(tableData);

      saveFile(
        currentFileName,
        tableData
      );
    };

    reader.readAsText(file);
  }
);

const fileNames = getFileNames();

if (fileNames.length === 0) {

  currentFileName = "default";

  saveFile(
    currentFileName,
    tableData
  );
}
else {

  currentFileName = fileNames[0];

  tableData =
    loadFile(currentFileName);
}

refreshFileSelect();

renderTable(tableData);

let currentFileName = "default";

let tableData = [
  ["項目", "列1"],
  ["データ", ""]
];

/* =========================
   初期化
========================= */
async function init() {
  tableData = await loadFile(currentFileName);

  if (!tableData || !tableData.length) {
    tableData = [["項目", "列1"], ["", ""]];
  }

  renderTable(tableData);
  await refreshFiles();
}

/* =========================
   ファイル一覧更新
========================= */
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

/* =========================
   新規ファイル
========================= */
document.getElementById("newFileButton").onclick = async () => {
  const name = prompt("ファイル名を入力してください");
  if (!name) return;

  currentFileName = name;
  tableData = [["項目", "列1"], ["", ""]];

  await saveFile(currentFileName, tableData);

  await refreshFiles();
  renderTable(tableData);
};

/* =========================
   ファイル削除
========================= */
document.getElementById("deleteFileButton").onclick = async () => {
  if (!confirm("削除しますか？")) return;

  await deleteFile(currentFileName);

  tableData = [["項目", "列1"], ["", ""]];

  await refreshFiles();
  renderTable(tableData);
};

/* =========================
   手動保存
========================= */
document.getElementById("saveButton").onclick = async () => {
  await saveFile(currentFileName, tableData);
  alert("保存しました");
};

/* =========================
   行追加
========================= */
document.getElementById("addRowButton").onclick = () => {
  addNewRow(tableData);
  renderTable(tableData);
  autoSaveFile(currentFileName, tableData);
};

/* =========================
   列追加
========================= */
document.getElementById("addColumnButton").onclick = () => {
  addNewColumn(tableData);
  renderTable(tableData);
  autoSaveFile(currentFileName, tableData);
};

/* =========================
   ファイル切り替え
========================= */
document.getElementById("fileSelect").onchange = async (e) => {
  currentFileName = e.target.value;

  tableData = await loadFile(currentFileName);

  if (!tableData || !tableData.length) {
    tableData = [["項目", "列1"], ["", ""]];
  }

  renderTable(tableData);
};

/* =========================
   🔥 自動保存（入力監視）
========================= */
document.addEventListener("input", () => {
  autoSaveFile(currentFileName, tableData);
});

/* =========================
   初期実行
========================= */
init();
let view = "folder";
let currentFolder = "default";
let currentFile = "";
let tableData = [];

/* =========================
   Firebase Ready
========================= */
document.addEventListener("firebase-ready", () => {

  window.firebaseAuthLib.onAuthStateChanged(
    window.firebaseAuth,
    async (user) => {

      if (!user) return;

      document.getElementById("title").textContent = user.email;

      await init();

    }
  );

});

/* =========================
   VIEW制御（iOSコア）
========================= */
function setView(v) {

  view = v;

  document.getElementById("folderView").style.display = v === "folder" ? "block" : "none";
  document.getElementById("fileView").style.display = v === "file" ? "block" : "none";
  document.getElementById("tableView").style.display = v === "table" ? "block" : "none";

  renderNav();
}

/* =========================
   ナビ更新
========================= */
function renderNav() {

  const title = document.getElementById("title");
  const back = document.getElementById("backBtn");
  const action = document.getElementById("actionBtn");

  if (view === "folder") {
    title.textContent = currentFolder;
    back.style.visibility = "hidden";
    action.textContent = "＋";
  }

  if (view === "file") {
    title.textContent = currentFolder;
    back.style.visibility = "visible";
    action.textContent = "＋";
  }

  if (view === "table") {
    title.textContent = currentFile;
    back.style.visibility = "visible";
    action.textContent = "💾";
  }
}

/* =========================
   戻る
========================= */
document.getElementById("backBtn").onclick = () => {

  if (view === "table") {
    setView("file");
    return;
  }

  if (view === "file") {
    setView("folder");
    return;
  }

  const parts = currentFolder.split("/");
  parts.pop();
  currentFolder = parts.length ? parts.join("/") : "default";

  init();
};

/* =========================
   アクションボタン
========================= */
document.getElementById("actionBtn").onclick = async () => {

  if (view === "folder") {

    const name = prompt("フォルダ名");
    if (!name) return;

    currentFolder = name;

    await window.saveFile("__init__", [["init"]], currentFolder);

    await init();
  }

  if (view === "file") {

    const name = prompt("ファイル名");
    if (!name) return;

    currentFile = name;
    tableData = [["項目", "列1"], ["", ""]];

    await window.saveFile(name, tableData, currentFolder);

    setView("table");
  }

  if (view === "table") {

    await window.saveFile(currentFile, tableData, currentFolder);
  }
};

/* =========================
   初期化
========================= */
async function init() {

  setView("folder");

  const folders = await window.getFolderNames();
  renderFolderList(folders);

  renderNav();
}

/* =========================
   フォルダ一覧
========================= */
function renderFolderList(folders) {

  const el = document.getElementById("folderView");
  el.innerHTML = "";

  folders.forEach(f => {

    const row = document.createElement("div");
    row.className = "ios-row";
    row.textContent = "📁 " + f;

    row.onclick = async () => {

      currentFolder = f;

      await loadFiles();

      setView("file");
    };

    el.appendChild(row);
  });
}

/* =========================
   ファイル読み込み
========================= */
async function loadFiles() {

  const el = document.getElementById("fileView");
  el.innerHTML = "";

  let files = await window.getFileNamesByFolder(currentFolder);
  files = files.filter(f => f !== "_folder_init");

  if (files.length === 0) {

    tableData = [["項目", "列1"], ["", ""]];
    currentFile = "";
    setView("table");
    renderTable(tableData);
    return;
  }

  files.forEach(f => {

    const row = document.createElement("div");
    row.className = "ios-row";
    row.textContent = "📄 " + f;

    row.onclick = async () => {

      currentFile = f;
      tableData = await window.loadFile(f);

      if (!tableData) {
        tableData = [["項目", "列1"], ["", ""]];
      }

      setView("table");
      renderTable(tableData);
    };

    el.appendChild(row);
  });
}

/* =========================
   保存
========================= */
document.getElementById("actionBtn").addEventListener("dblclick", async () => {

  if (view !== "table") return;

  await window.saveFile(currentFile, tableData, currentFolder);
});

/* =========================
   編集系
========================= */
document.getElementById("addRowButton")?.addEventListener("click", () => {
  addNewRow(tableData);
  renderTable(tableData);
});

document.getElementById("deleteRowButton")?.addEventListener("click", () => {
  deleteLastRow(tableData);
  renderTable(tableData);
});

document.getElementById("addColumnButton")?.addEventListener("click", () => {
  addNewColumn(tableData);
  renderTable(tableData);
});

document.getElementById("deleteColumnButton")?.addEventListener("click", () => {
  deleteLastColumn(tableData);
  renderTable(tableData);
});

console.log("iOS UI app.js loaded");
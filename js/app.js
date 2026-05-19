let currentFolder =
  "default";

let currentFileName =
  "";

let tableData = [];

/* =========================
   共通：安全フォルダ正規化
========================= */
function normalizeFolder(folder) {

  if (!folder)
    return "default";

  return folder;

}

/* =========================
   ログイン
========================= */
async function login() {

  const auth =
    window.firebaseAuth;

  const provider =
    window.firebaseProvider;

  const {
    signInWithPopup
  } =
    window.firebaseAuthLib;

  try {

    await signInWithPopup(
      auth,
      provider
    );

  } catch (error) {

    console.error(
      "login error:",
      error
    );

  }

}

/* =========================
   ログインボタン
========================= */
document
  .getElementById(
    "loginButton"
  )
  .onclick = async () => {

    await login();

  };

/* =========================
   Firebase Ready
========================= */
document.addEventListener(

  "firebase-ready",

  () => {

    window.firebaseAuthLib
      .onAuthStateChanged(

        window.firebaseAuth,

        async (user) => {

          if (!user)
            return;

          console.log(
            "ログイン:",
            user.uid
          );

          document
            .getElementById(
              "userInfo"
            )
            .textContent =
              user.email;

          await refreshFolders();

          await refreshFiles();

        }

      );

  }

);

/* =========================
   現在パス表示
========================= */
function updateCurrentPath() {

  const area =
    document.getElementById(
      "currentPath"
    );

  if (!area)
    return;

  area.textContent =
    "現在: " +
    currentFolder;

}

/* =========================
   フォルダ一覧
========================= */
async function refreshFolders() {

  const select =
    document.getElementById(
      "folderSelect"
    );

  select.innerHTML = "";

  let folders =
    await window
      .getFolderNames();

  if (
    !folders.includes("default")
  ) {

    folders.unshift("default");

  }

  const visibleFolders =
    folders.filter(folder => {

      if (currentFolder === "default") {

        return (
          folder !== "default" &&
          !folder.includes("/")
        );

      }

      return (

        folder.startsWith(
          currentFolder + "/"
        )

        &&

        folder
          .replace(
            currentFolder + "/",
            ""
          )
          .split("/")
          .length === 1

      );

    });

  if (currentFolder === "default") {

    const opt =
      document.createElement("option");

    opt.value = "default";
    opt.textContent = "default";

    select.appendChild(opt);

  }

  visibleFolders.forEach(folder => {

    const opt =
      document.createElement("option");

    opt.value = folder;

    opt.textContent =
      folder.split("/").pop();

    select.appendChild(opt);

  });

  select.value =
    currentFolder;

  updateCurrentPath();

}

/* =========================
   ファイル一覧
========================= */
async function refreshFiles() {

  const select =
    document.getElementById(
      "fileSelect"
    );

  select.innerHTML = "";

  let files =
    await window.getFileNamesByFolder(
      currentFolder
    );

  files =
    files.filter(
      name => name !== "_folder_init"
    );

  if (files.length === 0) {

    tableData = [
      ["項目", "列1"],
      ["", ""]
    ];

    renderTable(tableData);

    currentFileName = "";

    return;

  }

  files.forEach(name => {

    const opt =
      document.createElement("option");

    opt.value = name;
    opt.textContent = name;

    select.appendChild(opt);

  });

  currentFileName =
    files[0];

  select.value =
    currentFileName;

  tableData =
    await window.loadFile(
      currentFileName
    );

  if (!tableData) {

    tableData = [
      ["項目", "列1"],
      ["", ""]
    ];

  }

  renderTable(tableData);

}

/* =========================
   フォルダ追加
========================= */
document
  .getElementById("newFolderButton")
  .onclick = async () => {

    const name =
      prompt("フォルダ名");

    if (!name)
      return;

    currentFolder = name;

    await window.saveFile(
      "_folder_init",
      [["項目", "列1"], ["", ""]],
      currentFolder
    );

    await refreshFolders();
    await refreshFiles();

  };

/* =========================
   子フォルダ追加
========================= */
document
  .getElementById("newSubFolderButton")
  .onclick = async () => {

    const name =
      prompt("子フォルダ名");

    if (!name)
      return;

    currentFolder =
      currentFolder + "/" + name;

    await window.saveFile(
      "_folder_init",
      [["項目", "列1"], ["", ""]],
      currentFolder
    );

    await refreshFolders();
    await refreshFiles();

  };

/* =========================
   戻る
========================= */
document
  .getElementById("backFolderButton")
  .onclick = async () => {

    if (currentFolder === "default")
      return;

    const split =
      currentFolder.split("/");

    split.pop();

    currentFolder =
      split.length === 0
        ? "default"
        : split.join("/");

    await refreshFolders();
    await refreshFiles();

  };

/* =========================
   フォルダ削除
========================= */
document
  .getElementById("deleteFolderButton")
  .onclick = async () => {

    if (currentFolder === "default") {

      alert("defaultは削除不可");
      return;

    }

    const ok =
      confirm(
        currentFolder + " を削除しますか？"
      );

    if (!ok)
      return;

    await window.deleteFolder(currentFolder);

    const split =
      currentFolder.split("/");

    split.pop();

    currentFolder =
      split.length === 0
        ? "default"
        : split.join("/");

    await refreshFolders();
    await refreshFiles();

  };

/* =========================
   フォルダ変更
========================= */
document
  .getElementById("folderSelect")
  .onchange = async (e) => {

    currentFolder =
      normalizeFolder(e.target.value);

    await refreshFolders();
    await refreshFiles();

  };

/* =========================
   新規ファイル
========================= */
document
  .getElementById("newFileButton")
  .onclick = async () => {

    const name =
      prompt("ファイル名");

    if (!name)
      return;

    currentFileName = name;

    tableData = [
      ["項目", "列1"],
      ["", ""]
    ];

    await window.saveFile(
      name,
      tableData,
      currentFolder
    );

    await refreshFiles();

  };

/* =========================
   保存
========================= */
document
  .getElementById("saveButton")
  .onclick = async () => {

    if (!currentFileName)
      return;

    await window.saveFile(
      currentFileName,
      tableData,
      currentFolder
    );

    console.log("保存完了");

  };

/* =========================
   ファイル削除
========================= */
document
  .getElementById("deleteFileButton")
  .onclick = async () => {

    if (!currentFileName)
      return;

    await window.deleteFile(currentFileName);

    await refreshFiles();

  };

/* =========================
   ファイル切替
========================= */
document
  .getElementById("fileSelect")
  .onchange = async (e) => {

    currentFileName = e.target.value;

    tableData =
      await window.loadFile(currentFileName);

    if (!tableData) {

      tableData = [
        ["項目", "列1"],
        ["", ""]
      ];

    }

    renderTable(tableData);

  };

/* =========================
   行追加
========================= */
document
  .getElementById("addRowButton")
  .onclick = () => {

    addNewRow(tableData);
    renderTable(tableData);

  };

/* =========================
   行削除
========================= */
document
  .getElementById("deleteRowButton")
  .onclick = () => {

    deleteLastRow(tableData);
    renderTable(tableData);

  };

/* =========================
   列追加
========================= */
document
  .getElementById("addColumnButton")
  .onclick = () => {

    addNewColumn(tableData);
    renderTable(tableData);

  };

/* =========================
   列削除
========================= */
document
  .getElementById("deleteColumnButton")
  .onclick = () => {

    deleteLastColumn(tableData);
    renderTable(tableData);

  };

/* =========================
   自動保存
========================= */
document.addEventListener(
  "input",
  async () => {

    if (!currentFileName)
      return;

    await window.autoSaveFile(
      currentFileName,
      tableData,
      currentFolder
    );

  }
);

console.log("app.js loaded");
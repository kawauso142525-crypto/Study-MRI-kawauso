let currentFolder =
  "default";

let currentFileName =
  "default";

let tableData = [];

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
  } = window.firebaseAuthLib;

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
   認証監視
========================= */
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

/* =========================
   フォルダ一覧
========================= */
async function refreshFolders() {

  const select =
    document.getElementById(
      "folderSelect"
    );

  select.innerHTML = "";

  const folders =
    await window.getFolderNames();

  /* default無ければ追加 */
  if (
    !folders.includes(
      "default"
    )
  ) {

    folders.unshift(
      "default"
    );

  }

  folders.forEach(folder => {

    const opt =
      document.createElement(
        "option"
      );

    opt.value = folder;

    opt.textContent = folder;

    select.appendChild(opt);

  });

  select.value =
    currentFolder;

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

  const files =
    await window
      .getFileNamesByFolder(
        currentFolder
      );

  files.forEach(name => {

    const opt =
      document.createElement(
        "option"
      );

    opt.value = name;

    opt.textContent = name;

    select.appendChild(opt);

  });

}

/* =========================
   フォルダ追加
========================= */
document
  .getElementById(
    "newFolderButton"
  )
  .onclick = async () => {

    const name =
      prompt(
        "フォルダ名"
      );

    if (!name)
      return;

    currentFolder =
      name;

    await refreshFolders();

    await refreshFiles();

  };

/* =========================
   フォルダ変更
========================= */
document
  .getElementById(
    "folderSelect"
  )
  .onchange = async (e) => {

    currentFolder =
      e.target.value;

    await refreshFiles();

  };

/* =========================
   新規ファイル
========================= */
document
  .getElementById(
    "newFileButton"
  )
  .onclick = async () => {

    const name =
      prompt(
        "ファイル名"
      );

    if (!name)
      return;

    currentFileName =
      name;

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

    renderTable(
      tableData
    );

  };

/* =========================
   保存
========================= */
document
  .getElementById(
    "saveButton"
  )
  .onclick = async () => {

    await window.saveFile(

      currentFileName,

      tableData,

      currentFolder

    );

    console.log(
      "保存完了"
    );

  };

/* =========================
   ファイル削除
========================= */
document
  .getElementById(
    "deleteFileButton"
  )
  .onclick = async () => {

    await window.deleteFile(
      currentFileName
    );

    await refreshFiles();

  };

/* =========================
   ファイル切替
========================= */
document
  .getElementById(
    "fileSelect"
  )
  .onchange = async (e) => {

    currentFileName =
      e.target.value;

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

    renderTable(
      tableData
    );

  };

/* =========================
   行追加
========================= */
document
  .getElementById(
    "addRowButton"
  )
  .onclick = () => {

    addNewRow(
      tableData
    );

    renderTable(
      tableData
    );

  };

/* =========================
   行削除
========================= */
document
  .getElementById(
    "deleteRowButton"
  )
  .onclick = () => {

    deleteLastRow(
      tableData
    );

    renderTable(
      tableData
    );

  };

/* =========================
   列追加
========================= */
document
  .getElementById(
    "addColumnButton"
  )
  .onclick = () => {

    addNewColumn(
      tableData
    );

    renderTable(
      tableData
    );

  };

/* =========================
   列削除
========================= */
document
  .getElementById(
    "deleteColumnButton"
  )
  .onclick = () => {

    deleteLastColumn(
      tableData
    );

    renderTable(
      tableData
    );

  };

/* =========================
   自動保存
========================= */
document.addEventListener(

  "input",

  async () => {

    if (
      !currentFileName
    )
      return;

    await window.autoSaveFile(

      currentFileName,

      tableData,

      currentFolder

    );

  }

);

console.log(
  "app.js loaded"
);

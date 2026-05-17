```javascript
let currentFileName = "default";

let tableData = [];

/* ログイン */
async function login() {

  const auth =
    window.firebaseAuth;

  const provider =
    window.firebaseProvider;

  const { signInWithPopup } =
    window.firebaseAuthLib;

  await signInWithPopup(
    auth,
    provider
  );

}

/* ログインボタン */
document
  .getElementById("loginButton")
  .onclick = async () => {

    await login();

  };

/* 認証監視 */
window.firebaseAuthLib.onAuthStateChanged(

  window.firebaseAuth,

  async (user) => {

    const userInfo =
      document.getElementById(
        "userInfo"
      );

    if (!user) {

      userInfo.textContent =
        "未ログイン";

      return;
    }

    userInfo.textContent =
      "ログイン中: " + user.email;

    console.log("ログイン:", user.uid);

    tableData =
      await loadFile(currentFileName);

    if (!tableData ||
        !tableData.length) {

      tableData = [
        ["項目", "列1"],
        ["", ""]
      ];

    }

    renderTable(tableData);

    refreshFiles();

  }

);

/* 初期化 */
function init() {

  console.log("app start");

}

init();

/* ファイル一覧 */
function refreshFiles() {

  const select =
    document.getElementById(
      "fileSelect"
    );

  select.innerHTML = "";

  const files =
    getFileNames();

  files.forEach(name => {

    const opt =
      document.createElement(
        "option"
      );

    opt.value = name;

    opt.textContent = name;

    select.appendChild(opt);

  });

  select.value =
    currentFileName;

}

/* 保存 */
document
  .getElementById("saveButton")
  .onclick = () => {

    saveFile(
      currentFileName,
      tableData
    );

  };

/* 新規 */
document
  .getElementById("newFileButton")
  .onclick = async () => {

    const name =
      prompt("ファイル名");

    if (!name) return;

    currentFileName = name;

    tableData = [
      ["項目", "列1"],
      ["", ""]
    ];

    await saveFile(
      name,
      tableData
    );

    refreshFiles();

    renderTable(tableData);

  };

/* 削除 */
document
  .getElementById("deleteFileButton")
  .onclick = async () => {

    await deleteFile(
      currentFileName
    );

  };

/* 行追加 */
document
  .getElementById("addRowButton")
  .onclick = () => {

    addNewRow(tableData);

    renderTable(tableData);

  };

/* 列追加 */
document
  .getElementById("addColumnButton")
  .onclick = () => {

    addNewColumn(tableData);

    renderTable(tableData);

  };

/* 切替 */
document
  .getElementById("fileSelect")
  .onchange = async (e) => {

    currentFileName =
      e.target.value;

    tableData =
      await loadFile(currentFileName);

    renderTable(tableData);

  };

/* 自動保存 */
document.addEventListener(
  "input",
  () => {

    autoSaveFile(
      currentFileName,
      tableData
    );

  }
);
```

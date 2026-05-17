let currentFileName = "default";

let tableData = [];

/* =========================
   ログイン
========================= */
async function login() {

  if (!window.firebaseAuthLib) {
    console.error(
      "firebaseAuthLib が未読み込み"
    );
    return;
  }

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
      "ログインエラー:",
      error
    );

  }

}

/* =========================
   ログインボタン
========================= */
document
  .getElementById("loginButton")
  .onclick = async () => {

    await login();

  };

/* =========================
   認証監視
========================= */
if (
  window.firebaseAuthLib &&
  window.firebaseAuth
) {

  window.firebaseAuthLib
    .onAuthStateChanged(

      window.firebaseAuth,

      async (user) => {

        const userInfo =
          document.getElementById(
            "userInfo"
          );

        /* 未ログイン */
        if (!user) {

          userInfo.textContent =
            "未ログイン";

          return;
        }

        /* ログイン成功 */
        userInfo.textContent =
          "ログイン中: " + user.email;

        console.log(
          "ログイン:",
          user.uid
        );

        /* ファイル読込 */
        tableData =
          await loadFile(
            currentFileName
          );

        /* 初回 */
        if (
          !tableData ||
          !tableData.length
        ) {

          tableData = [
            ["項目", "列1"],
            ["", ""]
          ];

        }

        renderTable(tableData);

        refreshFiles();

      }

    );

}

/* =========================
   初期化
========================= */
function init() {

  console.log("app start");

}

init();

/* =========================
   ファイル一覧更新
========================= */
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

/* =========================
   保存
========================= */
document
  .getElementById("saveButton")
  .onclick = async () => {

    await saveFile(
      currentFileName,
      tableData
    );

    console.log("保存完了");

  };

/* =========================
   新規ファイル
========================= */
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
      currentFileName,
      tableData
    );

    refreshFiles();

    renderTable(tableData);

  };

/* =========================
   ファイル削除
========================= */
document
  .getElementById("deleteFileButton")
  .onclick = async () => {

    await deleteFile(
      currentFileName
    );

    refreshFiles();

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
   列追加
========================= */
document
  .getElementById("addColumnButton")
  .onclick = () => {

    addNewColumn(tableData);

    renderTable(tableData);

  };

/* =========================
   ファイル切替
========================= */
document
  .getElementById("fileSelect")
  .onchange = async (e) => {

    currentFileName =
      e.target.value;

    tableData =
      await loadFile(
        currentFileName
      );

    if (!tableData) {

      tableData = [
        ["項目", "列1"],
        ["", ""]
      ];

    }

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

    await autoSaveFile(
      currentFileName,
      tableData
    );

  }

);

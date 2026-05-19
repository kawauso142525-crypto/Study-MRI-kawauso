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
   Firebase読込後
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
   フォルダ一覧
========================= */
async function refreshFolders() {

  const select =
    document.getElementById(
      "folderSelect"
    );

  select.innerHTML = "";

  const folders =
    await window
      .getFolderNames();

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

    opt.textContent =
      folder;

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

  if (
    files.length === 0
  ) {

    tableData = [

      ["項目", "列1"],

      ["", ""]

    ];

    renderTable(
      tableData
    );

    return;

  }

  files.forEach(name => {

    const opt =
      document.createElement(
        "option"
      );

    opt.value = name;

    opt.textContent =
      name;

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

  renderTable(
    tableData
  );

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


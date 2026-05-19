const STORAGE_KEY =
  "multiFileTableData";

/* =========================
   local取得
========================= */
function loadAllFiles() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : {};

}

/* =========================
   local保存
========================= */
function saveAllFiles(
  allFiles
) {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(
      allFiles
    )

  );

}

/* =========================
   読込
========================= */
async function loadFile(
  fileName
) {

  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user)
    return null;

  const uid =
    user.uid;

  const {
    doc,
    getDoc
  } =
    window.firebaseFunctions;

  try {

    const snap =
      await getDoc(

        doc(

          window.firebaseDB,

          "users",

          uid,

          "files",

          fileName

        )

      );

    if (
      snap.exists()
    ) {

      const raw =
        snap.data()
          .tableData;

      return JSON.parse(
        raw
      );

    }

  } catch (error) {

    console.error(
      "loadFile error:",
      error
    );

  }

  return null;

}

/* =========================
   保存
========================= */
async function saveFile(

  fileName,

  data,

  folder = "default"

) {

  /* local保存 */
  const allFiles =
    loadAllFiles();

  allFiles[fileName] = {

    folder,

    tableData: data

  };

  saveAllFiles(
    allFiles
  );

  /* Firebase */
  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user)
    return;

  const uid =
    user.uid;

  const {
    doc,
    setDoc
  } =
    window.firebaseFunctions;

  try {

    await setDoc(

      doc(

        window.firebaseDB,

        "users",

        uid,

        "files",

        fileName

      ),

      {

        folder,

        tableData:
          JSON.stringify(
            data
          )

      }

    );

    console.log(
      "save success:",
      fileName
    );

  } catch (error) {

    console.error(
      "saveFile error:",
      error
    );

  }

}

/* =========================
   自動保存
========================= */
async function autoSaveFile(

  fileName,

  data,

  folder

) {

  await saveFile(

    fileName,

    data,

    folder

  );

}

/* =========================
   削除
========================= */
async function deleteFile(
  fileName
) {

  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user)
    return;

  const uid =
    user.uid;

  const {
    doc,
    deleteDoc
  } =
    window.firebaseFunctions;

  try {

    await deleteDoc(

      doc(

        window.firebaseDB,

        "users",

        uid,

        "files",

        fileName

      )

    );

  } catch (error) {

    console.error(
      "deleteFile error:",
      error
    );

  }

}

/* =========================
   フォルダ一覧
========================= */
async function getFolderNames() {

  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user)
    return [];

  const uid =
    user.uid;

  const {
    collection,
    getDocs
  } =
    window.firebaseFunctions;

  try {

    const querySnapshot =
      await getDocs(

        collection(

          window.firebaseDB,

          "users",

          uid,

          "files"

        )

      );

    const folders =
      new Set();

    querySnapshot.forEach(doc => {

      const data =
        doc.data();

      if (
        data.folder
      ) {

        folders.add(
          data.folder
        );

      }

    });

    return [
      ...folders
    ];

  } catch (error) {

    console.error(
      "getFolderNames error:",
      error
    );

    return [];

  }

}

/* =========================
   フォルダ別ファイル
========================= */
async function getFileNamesByFolder(
  folder
) {

  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user)
    return [];

  const uid =
    user.uid;

  const {
    collection,
    getDocs
  } =
    window.firebaseFunctions;

  try {

    const querySnapshot =
      await getDocs(

        collection(

          window.firebaseDB,

          "users",

          uid,

          "files"

        )

      );

    const files = [];

    querySnapshot.forEach(doc => {

      const data =
        doc.data();

      if (

        (
          data.folder
          || "default"
        )

        === folder

      ) {

        files.push(
          doc.id
        );

      }

    });

    return files;

  } catch (error) {

    console.error(
      "getFileNamesByFolder error:",
      error
    );

    return [];

  }

}

/* =========================
   グローバル公開
========================= */
window.loadFile =
  loadFile;

window.saveFile =
  saveFile;

window.autoSaveFile =
  autoSaveFile;

window.deleteFile =
  deleteFile;

window.getFolderNames =
  getFolderNames;

window.getFileNamesByFolder =
  getFileNamesByFolder;

console.log(
  "storage.js loaded"
);

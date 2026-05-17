const STORAGE_KEY = "multiFileTableData";

/* 全ファイル取得 */
function loadAllFiles() {

  const data =
    localStorage.getItem(STORAGE_KEY);

  return data
    ? JSON.parse(data)
    : {};

}

/* 全保存 */
function saveAllFiles(allFiles) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(allFiles)
  );

}

/* ファイル読み込み */
async function loadFile(fileName) {

  const allFiles = loadAllFiles();

  if (allFiles[fileName]) {
    return allFiles[fileName];
  }

  const user =
    window.firebaseAuth.currentUser;

  if (!user) return null;

  const uid = user.uid;

  const { doc, getDoc } =
    window.firebaseFunctions;

  const snap = await getDoc(
    doc(
      window.firebaseDB,
      "users",
      uid,
      "files",
      fileName
    )
  );

  if (snap.exists()) {

    const data = snap.data().tableData;

    allFiles[fileName] = data;

    saveAllFiles(allFiles);

    return data;
  }

  return null;
}

/* 保存 */
async function saveFile(fileName, data) {

  const allFiles = loadAllFiles();

  allFiles[fileName] = data;

  saveAllFiles(allFiles);

  const user =
    window.firebaseAuth.currentUser;

  if (!user) return;

  const uid = user.uid;

  const { doc, setDoc } =
    window.firebaseFunctions;

  await setDoc(

    doc(
      window.firebaseDB,
      "users",
      uid,
      "files",
      fileName
    ),

    {
      tableData: data
    }

  );

  console.log("saved");
}

/* 自動保存 */
function autoSaveFile(fileName, data) {

  saveFile(fileName, data);

}

/* 削除 */
async function deleteFile(fileName) {

  const allFiles = loadAllFiles();

  delete allFiles[fileName];

  saveAllFiles(allFiles);

  const user =
    window.firebaseAuth.currentUser;

  if (!user) return;

  const uid = user.uid;

  const { doc, deleteDoc } =
    window.firebaseFunctions;

  await deleteDoc(

    doc(
      window.firebaseDB,
      "users",
      uid,
      "files",
      fileName
    )

  );

}

/* ファイル一覧 */
function getFileNames() {

  return Object.keys(
    loadAllFiles()
  );

}
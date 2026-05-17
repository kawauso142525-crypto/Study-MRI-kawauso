const STORAGE_KEY =
  "multiFileTableData";

/* =========================
   local全取得
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
   local全保存
========================= */
function saveAllFiles(allFiles) {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(allFiles)

  );

}

/* =========================
   ファイル読込
========================= */
async function loadFile(fileName) {

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
  } = window.firebaseFunctions;

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

    if (snap.exists()) {

      const raw =
        snap.data().tableData;

      const data =
        JSON.parse(raw);

      /* local更新 */
      const allFiles =
        loadAllFiles();

      allFiles[fileName] =
        data;

      saveAllFiles(allFiles);

      return data;

    }

  } catch (error) {

    console.error(
      "loadFile error:",
      error
    );

  }

  /* local fallback */
  const allFiles =
    loadAllFiles();

  return (
    allFiles[fileName]
    || null
  );

}

/* =========================
   保存
========================= */
async function saveFile(
  fileName,
  data
) {

  /* local保存 */
  const allFiles =
    loadAllFiles();

  allFiles[fileName] =
    data;

  saveAllFiles(allFiles);

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
  } = window.firebaseFunctions;

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

        /* Nested arrays対策 */
        tableData:
          JSON.stringify(data)

      }

    );

    console.log(
      "Firestore保存成功"
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
  data
) {

  await saveFile(
    fileName,
    data
  );

}

/* =========================
   削除
========================= */
async function deleteFile(
  fileName
) {

  const allFiles =
    loadAllFiles();

  delete allFiles[fileName];

  saveAllFiles(allFiles);

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
  } = window.firebaseFunctions;

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
   Firestore一覧取得
========================= */
async function getFileNames() {

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
  } = window.firebaseFunctions;

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

    const names = [];

    querySnapshot.forEach(doc => {

      names.push(doc.id);

    });

    return names;

  } catch (error) {

    console.error(
      "getFileNames error:",
      error
    );

    return [];

  }

}


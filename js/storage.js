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
   ファイル読込
========================= */
window.loadFile =
  async function(
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

  };

/* =========================
   ファイル保存
========================= */
window.saveFile =
  async function(

    fileName,

    data,

    folder =
      "default"

  ) {

    const allFiles =
      loadAllFiles();

    allFiles[fileName] = {

      folder,

      tableData:
        data

    };

    saveAllFiles(
      allFiles
    );

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

    } catch (error) {

      console.error(
        "saveFile error:",
        error
      );

    }

  };

/* =========================
   自動保存
========================= */
window.autoSaveFile =
  async function(

    fileName,

    data,

    folder

  ) {

    await window.saveFile(

      fileName,

      data,

      folder

    );

  };

/* =========================
   ファイル削除
========================= */
window.deleteFile =
  async function(
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

  };

/* =========================
   フォルダ一覧
========================= */
window.getFolderNames =
  async function() {

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

      querySnapshot.forEach(
        docSnap => {

          const data =
            docSnap.data();

          folders.add(

            data.folder
            || "default"

          );

        }
      );

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

  };

/* =========================
   フォルダ別ファイル
========================= */
window.getFileNamesByFolder =
  async function(
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

      querySnapshot.forEach(
        docSnap => {

          const data =
            docSnap.data();

          if (

            (
              data.folder
              || "default"
            )

            ===

            folder

          ) {

            files.push(
              docSnap.id
            );

          }

        }
      );

      return files;

    } catch (error) {

      console.error(
        "getFileNamesByFolder error:",
        error
      );

      return [];

    }

  };

/* =========================
   フォルダ削除
========================= */
window.deleteFolder =
  async function(
    folderPath
  ) {

    const user =
      window.firebaseAuth
        ?.currentUser;

    if (!user)
      return;

    const uid =
      user.uid;

    const {
      collection,
      getDocs,
      doc,
      deleteDoc
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

      for (
        const fileDoc
        of querySnapshot.docs
      ) {

        const data =
          fileDoc.data();

        const folder =
          data.folder
          || "default";

        /* 対象 */
        if (

          folder ===
          folderPath

          ||

          folder.startsWith(
            folderPath + "/"
          )

        ) {

          await deleteDoc(

            doc(

              window.firebaseDB,

              "users",

              uid,

              "files",

              fileDoc.id

            )

          );

        }

      }

    } catch (error) {

      console.error(
        "deleteFolder error:",
        error
      );

    }

  };

console.log(
  "storage.js loaded"
);
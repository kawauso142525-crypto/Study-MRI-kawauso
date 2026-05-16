const STORAGE_KEY =
  "multiFileTableData";

function loadAllFiles() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : {};
}

function saveAllFiles(allFiles) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(allFiles)
  );
}

async function loadFile(fileName) {

  const allFiles =
    loadAllFiles();

  if (allFiles[fileName]) {

    return allFiles[fileName];
  }

  try {

    const {
      doc,
      getDoc
    } = window.firebaseFunctions;

    const docRef =
      doc(
        window.firebaseDB,
        "files",
        fileName
      );

    const docSnap =
      await getDoc(docRef);

    if (docSnap.exists()) {

      const data =
        docSnap.data().tableData;

      allFiles[fileName] = data;

      saveAllFiles(allFiles);

      return data;
    }
  }
  catch (error) {

    console.error(error);
  }

  return null;
}

async function saveFile(
  fileName,
  data
) {

  const allFiles =
    loadAllFiles();

  allFiles[fileName] = data;

  saveAllFiles(allFiles);

  try {

    const {
      doc,
      setDoc
    } = window.firebaseFunctions;

    await setDoc(
      doc(
        window.firebaseDB,
        "files",
        fileName
      ),
      {
        tableData: data
      }
    );
  }
  catch (error) {

    console.error(error);
  }
}

function getFileNames() {

  return Object.keys(
    loadAllFiles()
  );
}

function deleteFile(fileName) {

  const allFiles =
    loadAllFiles();

  delete allFiles[fileName];

  saveAllFiles(allFiles);
}
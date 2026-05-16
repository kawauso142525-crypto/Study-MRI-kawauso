const STORAGE_KEY = "multiFileTableData";

function loadAllFiles() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveAllFiles(allFiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allFiles));
}

async function loadFile(fileName) {
  const allFiles = loadAllFiles();

  if (allFiles[fileName]) {
    return allFiles[fileName];
  }

  const { doc, getDoc } = window.firebaseFunctions;

  const snap = await getDoc(
    doc(window.firebaseDB, "files", fileName)
  );

  if (snap.exists()) {
    const data = snap.data().tableData;
    allFiles[fileName] = data;
    saveAllFiles(allFiles);
    return data;
  }

  return null;
}

async function saveFile(fileName, data) {
  const allFiles = loadAllFiles();
  allFiles[fileName] = data;
  saveAllFiles(allFiles);

  const { doc, setDoc } = window.firebaseFunctions;

  await setDoc(
    doc(window.firebaseDB, "files", fileName),
    { tableData: data }
  );
}

async function deleteFile(fileName) {
  const allFiles = loadAllFiles();
  delete allFiles[fileName];
  saveAllFiles(allFiles);

  const { doc, deleteDoc } = window.firebaseFunctions;

  await deleteDoc(
    doc(window.firebaseDB, "files", fileName)
  );
}

async function getFileNames() {
  return Object.keys(loadAllFiles());
}
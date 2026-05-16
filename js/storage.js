const STORAGE_KEY = "multiFileTableData";

function loadAllFiles() {

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : {};
}

function saveAllFiles(allFiles) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(allFiles)
  );
}

function loadFile(fileName) {

  const allFiles = loadAllFiles();

  return allFiles[fileName] || null;
}

function saveFile(fileName, data) {

  const allFiles = loadAllFiles();

  allFiles[fileName] = data;

  saveAllFiles(allFiles);
}

function getFileNames() {

  return Object.keys(loadAllFiles());
}
function deleteFile(fileName) {

  const allFiles = loadAllFiles();

  delete allFiles[fileName];

  saveAllFiles(allFiles);
}
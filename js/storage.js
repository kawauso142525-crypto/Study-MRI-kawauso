const STORAGE_KEY = "multiFileTableData";

/* =========================
   ローカルストレージ
========================= */
function loadAllFiles() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveAllFiles(allFiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allFiles));
}

/* =========================
   ファイル読み込み
========================= */
window.loadFile = async function (fileName) {
  const allFiles = loadAllFiles();

  // ① ローカルにあれば優先
  if (allFiles[fileName]) {
    return allFiles[fileName];
  }

  // ② Firestoreから取得
  try {
    const { doc, getDoc } = window.firebaseFunctions;

    const snap = await getDoc(
      doc(window.firebaseDB, "files", fileName)
    );

    if (!snap.exists()) {
      return [["項目", "列1"], ["", ""]];
    }

    const data = snap.data();

    // 安全に変換（nested array対策）
    const rows = (data.rows || []).map(r => r.cells || []);

    allFiles[fileName] = rows;
    saveAllFiles(allFiles);

    return rows;

  } catch (e) {
    console.error("loadFile error:", e);
    return [["項目", "列1"], ["", ""]];
  }
};

/* =========================
   ファイル保存
========================= */
window.saveFile = async function (fileName, tableData) {
  try {
    const allFiles = loadAllFiles();

    // ローカル保存
    allFiles[fileName] = tableData;
    saveAllFiles(allFiles);

    // Firestore用に安全変換（重要）
    const safeData = {
      fileName,
      updatedAt: Date.now(),
      rows: tableData.map((row, i) => ({
        id: "row-" + i,
        cells: row
      }))
    };

    const { doc, setDoc } = window.firebaseFunctions;

    await setDoc(
      doc(window.firebaseDB, "files", fileName),
      safeData
    );

  } catch (e) {
    console.error("saveFile error:", e);
  }
};

/* =========================
   ファイル削除
========================= */
window.deleteFile = async function (fileName) {
  try {
    const allFiles = loadAllFiles();

    delete allFiles[fileName];
    saveAllFiles(allFiles);

    const { doc, deleteDoc } = window.firebaseFunctions;

    await deleteDoc(
      doc(window.firebaseDB, "files", fileName)
    );

  } catch (e) {
    console.error("deleteFile error:", e);
  }
};

/* =========================
   ファイル一覧
========================= */
window.getFileNames = function () {
  return Object.keys(loadAllFiles());
};
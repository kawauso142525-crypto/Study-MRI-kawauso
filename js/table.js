function renderTable(tableData) {

  const container =
    document.getElementById("tableContainer");

  if (!container) return;

  container.innerHTML = "";

  const table =
    document.createElement("table");

  tableData = tableData || [];

  tableData.forEach((row, rowIndex) => {

    const tr = document.createElement("tr");

    (row || []).forEach((cell, colIndex) => {

      const td = document.createElement("td");

      const input = document.createElement("input");

      input.value = cell ?? "";

      input.addEventListener("input", (e) => {

        tableData[rowIndex][colIndex] = e.target.value;

        if (typeof saveSuggestion === "function") {
          saveSuggestion(rowIndex + 1, e.target.value);
        }

      });

      td.appendChild(input);
      tr.appendChild(td);

    });

    table.appendChild(tr);

  });

  container.appendChild(table);
}

/* =========================
   行追加
========================= */
function addNewRow(tableData) {

  if (!tableData?.length) return;

  const colCount = tableData[0].length;

  const newRow = Array(colCount).fill("");

  tableData.push(newRow);
}

/* =========================
   列追加
========================= */
function addNewColumn(tableData) {

  if (!tableData?.length) return;

  tableData.forEach(row => {
    row.push("");
  });

}

/* =========================
   行削除
========================= */
function deleteLastRow(tableData) {

  if (!tableData || tableData.length <= 1) return;

  tableData.pop();
}

/* =========================
   列削除
========================= */
function deleteLastColumn(tableData) {

  if (!tableData?.[0] || tableData[0].length <= 1) return;

  tableData.forEach(row => {
    row.pop();
  });
}
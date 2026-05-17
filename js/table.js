function renderTable(tableData) {

  const container =
    document.getElementById(
      "tableContainer"
    );

  container.innerHTML = "";

  const table =
    document.createElement("table");

  tableData.forEach((row, rowIndex) => {

    const tr =
      document.createElement("tr");

    row.forEach((cell, colIndex) => {

      const td =
        document.createElement("td");

      const input =
        document.createElement("input");

      input.value = cell;

      input.addEventListener(
        "input",
        (e) => {

          tableData[rowIndex][colIndex]
            = e.target.value;

          saveSuggestion(
            rowIndex,
            e.target.value
          );

        }
      );

      td.appendChild(input);

      tr.appendChild(td);

    });

    table.appendChild(tr);

  });

  container.appendChild(table);

}

/* 行追加 */
function addNewRow(tableData) {

  const colCount =
    tableData[0].length;

  const newRow =
    Array(colCount).fill("");

  tableData.push(newRow);

}

/* 列追加 */
function addNewColumn(tableData) {

  tableData.forEach(row => {
    row.push("");
  });

}

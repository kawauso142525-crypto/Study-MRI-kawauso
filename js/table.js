function renderTable(tableData) {

  const tableContainer =
    document.getElementById(
      "tableContainer"
    );

  tableContainer.innerHTML = "";

  const wrapper =
    document.createElement("div");

  wrapper.className = "table-wrapper";

  const table =
    document.createElement("table");

  tableData.forEach(
    (rowData, rowIndex) => {

      const tr =
        document.createElement("tr");

      rowData.forEach(
        (cellData, colIndex) => {

          const cell =
            rowIndex === 0
              ? document.createElement("th")
              : document.createElement("td");

          const input =
            document.createElement("input");

          input.value = cellData;

          input.addEventListener(
            "change",
            (event) => {

              tableData[rowIndex][colIndex] =
                event.target.value;

              saveFile(
                currentFileName,
                tableData
              );
            }
          );

          cell.appendChild(input);

          tr.appendChild(cell);
        }
      );

      if (rowIndex !== 0) {

        const deleteCell =
          document.createElement("td");

        const deleteButton =
          document.createElement("button");

        deleteButton.textContent = "削除";

        deleteButton.className =
          "delete-row-button";

        deleteButton.addEventListener(
          "click",
          () => {

            deleteRow(
              tableData,
              rowIndex
            );

            renderTable(tableData);
          }
        );

        deleteCell.appendChild(
          deleteButton
        );

        tr.appendChild(deleteCell);
      }

      table.appendChild(tr);
    }
  );

  const deleteColumnRow =
    document.createElement("tr");

  tableData[0].forEach(
    (_, colIndex) => {

      const td =
        document.createElement("td");

      if (colIndex !== 0) {

        const button =
          document.createElement("button");

        button.textContent = "列削除";

        button.className =
          "delete-column-button";

        button.addEventListener(
          "click",
          () => {

            deleteColumn(
              tableData,
              colIndex
            );

            renderTable(tableData);
          }
        );

        td.appendChild(button);
      }

      deleteColumnRow.appendChild(td);
    }
  );

  table.appendChild(deleteColumnRow);

  wrapper.appendChild(table);

  tableContainer.appendChild(wrapper);
}

function addNewRow(tableData) {

  const columnCount =
    tableData[0].length;

  const newRow =
    Array(columnCount).fill("");

  newRow[0] =
    `データ${tableData.length}`;

  tableData.push(newRow);

  saveFile(
    currentFileName,
    tableData
  );
}

function addNewColumn(tableData) {

  tableData.forEach(
    (row, rowIndex) => {

      if (rowIndex === 0) {

        row.push(
          `列${row.length}`
        );
      }
      else {

        row.push("");
      }
    }
  );

  saveFile(
    currentFileName,
    tableData
  );
}

function deleteRow(
  tableData,
  rowIndex
) {

  tableData.splice(rowIndex, 1);

  saveFile(
    currentFileName,
    tableData
  );
}

function deleteColumn(
  tableData,
  colIndex
) {

  tableData.forEach((row) => {

    row.splice(colIndex, 1);
  });

  saveFile(
    currentFileName,
    tableData
  );
}
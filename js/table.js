function initializeTableEvents() {

  const table = document.getElementById("taskTable");

  table.addEventListener("click", (event) => {

    const cell = event.target;

    const isEditable =
      cell.classList.contains("editable");

    const isEditableHeader =
      cell.classList.contains("editable-header");

    if (!isEditable && !isEditableHeader) return;

    if (cell.querySelector("input")) return;

    startEditing(cell);
  });
}

function startEditing(cell) {

  const oldValue = cell.textContent;

  const rowIndex = cell.parentElement.rowIndex;

  const input = document.createElement("input");

  input.value = oldValue;

  cell.textContent = "";

  cell.appendChild(input);

  showSuggestions(cell, input, rowIndex);

  input.focus();

  input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

      saveCell(cell, input.value, rowIndex);
    }
  });

  input.addEventListener("blur", () => {

    setTimeout(() => {

      saveCell(cell, input.value, rowIndex);

    }, 200);
  });
}

function showSuggestions(cell, input, rowIndex) {

  const suggestions = getSuggestions(rowIndex);

  const oldBox = cell.querySelector(".suggestion-box");

  if (oldBox) oldBox.remove();

  const box = document.createElement("div");

  box.classList.add("suggestion-box");

  cell.appendChild(box);

  function renderSuggestions() {

    box.innerHTML = "";

    const keyword = input.value.toLowerCase();

    const filtered = suggestions.filter((item) => {

      return item.toLowerCase().includes(keyword);

    });

    filtered.forEach((item) => {

      const div = document.createElement("div");

      div.textContent = item;

      div.classList.add("suggestion-item");

      div.addEventListener("click", () => {

        input.value = item;

        box.remove();

        input.focus();
      });

      box.appendChild(div);
    });

    if (filtered.length === 0) {

      box.style.display = "none";

    } else {

      box.style.display = "block";
    }
  }

  renderSuggestions();

  input.addEventListener("input", () => {

    renderSuggestions();
  });
}

function saveCell(cell, value, rowIndex) {

  cell.textContent = value;

  saveSuggestion(rowIndex, value);

  saveTableData();
}

function addNewColumn() {

  const table = document.getElementById("taskTable");

  const headerRow = table.rows[0];

  const newColumnIndex = headerRow.cells.length;

  const newHeader = document.createElement("th");

  newHeader.textContent = `データ${newColumnIndex}`;

  headerRow.appendChild(newHeader);

  for (let i = 1; i < table.rows.length; i++) {

    const cell = document.createElement("td");

    cell.classList.add("editable");

    cell.textContent = "";

    table.rows[i].appendChild(cell);
  }

  saveTableData();
}

function addNewRow() {

  const table = document.getElementById("taskTable");

  const columnCount = table.rows[0].cells.length;

  const row = table.insertRow();

  const headerCell = document.createElement("th");

  headerCell.textContent = "新項目";

  headerCell.classList.add("editable-header");

  row.appendChild(headerCell);

  for (let i = 1; i < columnCount; i++) {

    const cell = document.createElement("td");

    cell.textContent = "";

    cell.classList.add("editable");

    row.appendChild(cell);
  }

  saveTableData();
}

function deleteLastColumn() {

  const table = document.getElementById("taskTable");

  const columnCount = table.rows[0].cells.length;

  if (columnCount <= 2) return;

  for (let i = 0; i < table.rows.length; i++) {

    table.rows[i].deleteCell(columnCount - 1);
  }

  saveTableData();
}

function deleteLastRow() {

  const table = document.getElementById("taskTable");

  if (table.rows.length <= 2) return;

  table.deleteRow(table.rows.length - 1);

  saveTableData();
}
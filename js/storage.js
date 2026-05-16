function saveTableData() {

  const table = document.getElementById("taskTable");

  const data = [];

  for (let i = 0; i < table.rows.length; i++) {

    const row = table.rows[i];

    const rowData = [];

    for (let j = 0; j < row.cells.length; j++) {

      rowData.push({
        text: row.cells[j].textContent,
        tag: row.cells[j].tagName,
        className: row.cells[j].className
      });
    }

    data.push(rowData);
  }

  localStorage.setItem("taskData", JSON.stringify(data));
}

function loadTableData() {

  const savedData = localStorage.getItem("taskData");

  if (!savedData) return;

  const data = JSON.parse(savedData);

  const table = document.getElementById("taskTable");

  table.innerHTML = "";

  data.forEach((rowData) => {

    const row = table.insertRow();

    rowData.forEach((cellData) => {

      const cell = document.createElement(cellData.tag);

      cell.textContent = cellData.text;

      if (cellData.className) {
        cell.className = cellData.className;
      }

      row.appendChild(cell);
    });
  });
}

function exportJson() {

  const taskData =
    localStorage.getItem("taskData");

  const suggestions =
    localStorage.getItem("suggestions");

  const backupData = {
    taskData: JSON.parse(taskData),
    suggestions: JSON.parse(suggestions)
  };

  const blob = new Blob(
    [JSON.stringify(backupData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "task-backup.json";

  a.click();

  URL.revokeObjectURL(url);
}

function importJson(file) {

  const reader = new FileReader();

  reader.onload = function(event) {

    const data = JSON.parse(event.target.result);

    localStorage.setItem(
      "taskData",
      JSON.stringify(data.taskData)
    );

    localStorage.setItem(
      "suggestions",
      JSON.stringify(data.suggestions)
    );

    location.reload();
  };

  reader.readAsText(file);
}
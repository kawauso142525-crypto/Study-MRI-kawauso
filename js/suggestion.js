function getSuggestions(rowIndex) {

  const saved =
    localStorage.getItem("suggestions");

  let suggestions = saved
    ? JSON.parse(saved)
    : {
        row1: [],
        row2: [],
        row3: [],
        shared: []
      };

  if (rowIndex === 1) return suggestions.row1;

  if (rowIndex === 2) return suggestions.row2;

  if (rowIndex === 3) return suggestions.row3;

  return suggestions.shared;
}

function saveSuggestion(rowIndex, value) {

  if (!value.trim()) return;

  const saved =
    localStorage.getItem("suggestions");

  let suggestions = saved
    ? JSON.parse(saved)
    : {
        row1: [],
        row2: [],
        row3: [],
        shared: []
      };

  let targetArray;

  if (rowIndex === 1) {
    targetArray = suggestions.row1;
  }

  else if (rowIndex === 2) {
    targetArray = suggestions.row2;
  }

  else if (rowIndex === 3) {
    targetArray = suggestions.row3;
  }

  else {
    targetArray = suggestions.shared;
  }

  if (!targetArray.includes(value)) {
    targetArray.push(value);
  }

  localStorage.setItem(
    "suggestions",
    JSON.stringify(suggestions)
  );
}

function getSuggestions(rowIndex) {
  const saved = localStorage.getItem("suggestions");

  const suggestions = saved ? JSON.parse(saved) : {
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

  const saved = localStorage.getItem("suggestions");

  const suggestions = saved ? JSON.parse(saved) : {
    row1: [],
    row2: [],
    row3: [],
    shared: []
  };

  let target;
  if (rowIndex === 1) target = suggestions.row1;
  else if (rowIndex === 2) target = suggestions.row2;
  else if (rowIndex === 3) target = suggestions.row3;
  else target = suggestions.shared;

  if (!target.includes(value)) {
    target.push(value);
  }

  localStorage.setItem("suggestions", JSON.stringify(suggestions));
}
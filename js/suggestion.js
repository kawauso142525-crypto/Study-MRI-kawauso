async function getSuggestions(rowIndex) {

  const { doc, getDoc } = window.firebaseFunctions;

  const docRef = doc(
    window.firebaseDB,
    "suggestions",
    "global"
  );

  const snap = await getDoc(docRef);

  const data = snap.exists()
    ? snap.data()
    : {
        row1: [],
        row2: [],
        row3: [],
        shared: []
      };

  if (rowIndex === 1) return data.row1;
  if (rowIndex === 2) return data.row2;
  if (rowIndex === 3) return data.row3;

  return data.shared;
}

async function saveSuggestion(rowIndex, value) {

  if (!value.trim()) return;

  const { doc, getDoc, setDoc } = window.firebaseFunctions;

  const docRef = doc(
    window.firebaseDB,
    "suggestions",
    "global"
  );

  const snap = await getDoc(docRef);

  let suggestions = snap.exists()
    ? snap.data()
    : {
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

  await setDoc(docRef, suggestions);
}
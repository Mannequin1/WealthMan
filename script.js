async function fetchSignals() {
  const signalsList = document.getElementById("signalsList");
  const lastUpdate = document.getElementById("lastUpdate");
  signalsList.innerHTML = "";

  try {
    // Use Sheetson API to get sheet data as JSON
    const response = await fetch(`https://api.sheetson.com/v2/sheets/Sheet1`, {
      headers: {
        'Authorization': 'Bearer public',  // no auth needed for public sheets
      }
    });

    if (!response.ok) throw new Error("Failed to fetch signals.");

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      signalsList.innerHTML = "<li>No signals found.</li>";
      return;
    }

    data.results.forEach(row => {
      // Assume your sheet has a column called 'Signal' - adjust this
      const signalText = row.Signal || JSON.stringify(row);
      const li = document.createElement("li");
      li.textContent = signalText;
      signalsList.appendChild(li);
    });

    const now = new Date();
    lastUpdate.textContent = `Last updated: ${now.toLocaleString()}`;

  } catch (error) {
    signalsList.innerHTML = "<li>Error loading signals. Try refreshing.</li>";
    lastUpdate.textContent = "";
    console.error(error);
  }
}
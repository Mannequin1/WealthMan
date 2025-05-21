<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>WealthMind Signals Feed</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

    body {
      margin: 0;
      height: 100vh;
      font-family: 'Montserrat', sans-serif;
      background: radial-gradient(circle at center, #0a0a0a 0%, #000000 70%);
      color: #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 40px 20px;
      overflow-x: hidden;
    }

    .stars {
      position: fixed;
      width: 100%;
      height: 100%;
      background: transparent;
      box-shadow:
        50px 50px 2px white,
        120px 80px 2px #f5a623,
        200px 120px 2px white,
        300px 200px 2px #f5a623,
        400px 300px 2px white,
        500px 350px 2px #f5a623,
        600px 400px 2px white;
      animation: twinkle 10s linear infinite;
      z-index: 0;
      pointer-events: none;
    }

    @keyframes twinkle {
      0%, 100% {opacity: 1;}
      50% {opacity: 0.6;}
    }

    h1 {
      margin-bottom: 15px;
      letter-spacing: 3px;
      font-weight: 700;
      text-align: center;
      z-index: 1;
    }

    #loadingMsg {
      color: #f5a623;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 1rem;
      z-index: 1;
    }

    #signalsList {
      list-style: none;
      padding: 0;
      margin: 0 0 30px 0;
      width: 100%;
      max-width: 600px;
      background: rgba(20, 20, 20, 0.9);
      border-radius: 8px;
      box-shadow: 0 0 20px #f5a623aa;
      z-index: 1;
      max-height: 400px;
      overflow-y: auto;
    }

    #signalsList li {
      padding: 12px 20px;
      border-bottom: 1px solid #333;
      font-size: 1rem;
    }

    #signalsList li:last-child {
      border-bottom: none;
    }

    #lastUpdate {
      font-size: 0.9rem;
      font-weight: 600;
      color: #aaa;
      text-align: center;
      z-index: 1;
      user-select: none;
    }
  </style>
</head>
<body>
  <div class="stars"></div>

  <h1>WealthMind Signals Feed</h1>
  <p id="loadingMsg" style="display:none;">Loading signals...</p>

  <ul id="signalsList">
    <!-- Signals will load here -->
  </ul>

  <p id="lastUpdate"></p>

  <script>
    async function fetchSignals({
      sheetName = "Sheet1",
      apiKey = "public",
      refreshInterval = 60,  // auto-refresh every 60s
    } = {}) {
      const signalsList = document.getElementById("signalsList");
      const lastUpdate = document.getElementById("lastUpdate");
      const loadingMsg = document.getElementById("loadingMsg");

      if (!signalsList || !lastUpdate) {
        console.error("Missing #signalsList or #lastUpdate element");
        return;
      }

      try {
        // Show loading
        if (loadingMsg) loadingMsg.style.display = "block";

        // Clear previous signals & messages
        signalsList.innerHTML = "";
        lastUpdate.textContent = "";

        const response = await fetch(`https://api.sheetson.com/v2/sheets/${encodeURIComponent(sheetName)}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) throw new Error(`Failed to fetch signals: ${response.status} ${response.statusText}`);

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          signalsList.innerHTML = "<li>No signals found.</li>";
          lastUpdate.textContent = "";
          return;
        }

        // Add signals
        data.results.forEach(row => {
          // Customize your signal field here
          const signalText = row.Signal || JSON.stringify(row);
          const li = document.createElement("li");
          li.textContent = signalText;
          signalsList.appendChild(li);
        });

        // Show count and timestamp
        const now = new Date();
        lastUpdate.textContent = `Showing ${data.results.length} signals — last updated: ${now.toLocaleString()}`;
      } catch (error) {
        signalsList.innerHTML = "<li style='color: crimson;'>Error loading signals. Try refreshing.</li>";
        lastUpdate.textContent = "";
        console.error(error);
      } finally {
        if (loadingMsg) loadingMsg.style.display = "none";
      }

      // Setup auto-refresh if requested
      if (refreshInterval > 0) {
        setTimeout(() => fetchSignals({ sheetName, apiKey, refreshInterval }), refreshInterval * 1000);
      }
    }

    // Initial fetch with defaults
    fetchSignals();
  </script>
</body>
</html>
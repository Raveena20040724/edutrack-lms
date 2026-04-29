// frontend/src/services/keepAlive.js
// Pings backend every 4 minutes to prevent Neon DB cold start

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
let interval = null;

export const startKeepAlive = () => {
  if (interval) return; // already running
  console.log('[KeepAlive] Started — pinging every 4 min');

  interval = setInterval(async () => {
    try {

      await fetch(`${BASE_URL}/ping/`);
    } catch {
      // silent — keepAlive failure should never break the app
    }
  }, 4 * 60 * 1000); // 4 minutes
};

export const stopKeepAlive = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log('[KeepAlive] Stopped');
  }
};
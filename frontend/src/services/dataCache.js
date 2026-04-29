export const cacheSet = (key, data) => {
  localStorage.setItem(key, JSON.stringify({
    data,
    time: Date.now()
  }));
};
export const cacheClear = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("eduTrack_")) {
      localStorage.removeItem(key);
    }
  });
};
export const cacheGet = (key, maxAge = 5 * 60 * 1000) => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.time > maxAge) return null;
    return parsed.data;
  } catch {
    return null;
  }
};
export async function getCache(key) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  } else {
    // Fallback to localStorage for local Vite dev server
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}

export async function setCache(key, data) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: data }, () => {
        resolve();
      });
    });
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

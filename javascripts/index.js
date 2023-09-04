document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ type: 'checkLogin' });
  });
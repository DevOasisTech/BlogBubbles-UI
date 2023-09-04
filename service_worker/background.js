function checkLoginStatus() {
  chrome.storage.local.get(['token'], function(result) {
    if (!result.token) {
      return {isLoggedIn: false};
    } else {
      return {isLoggedIn: true};
    }
  });
  return {status: 'checked'};
}
function showLoginPopup() {
  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // tabs is an array, but there should only be one active tab in the current window
    console.log("tabs",tabs);
    const activeTab = tabs[0];

    // Check if activeTab is available
    if (!activeTab) {
      console.error("No active tab found.");
      return;
    }

    // Execute your content script
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ["content_scripts/show_login.js"]
    }, function() {
      // Optional callback after the script has been injected
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("--------------message.type--------------",message.type);
  if (message.type === 'checkLoginStatus') {
    resp = checkLoginStatus();
    sendResponse(resp);
  } else if (message.type === 'showLoginPopup') {
    showLoginPopup();
  } else {
    return false;
  }
});

// Initial check
// checkLoginStatus();

chrome.runtime.onInstalled.addListener(function() {
// Create a context menu for selected text
chrome.contextMenus.create({
    id: "annotateText",
    title: "Add Comment",
    contexts: ["selection"]
  });
  
  // Add a click event listener
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "annotateText") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content_scripts/add_comment.js"]
      });
    }
  });

//   chrome.contextMenus.create({
//     id: 'openSidePanel',
//     title: 'Open side panel',
//     contexts: ['all']
//   });
//   chrome.tabs.create({ url: 'page.html' });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'openSidePanel') {
//     // This will open the panel in all the pages on the current window.
//     chrome.sidePanel.open({ windowId: tab.windowId });
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender) => {
//   // The callback for runtime.onMessage must return falsy if we're not sending a response
//   (async () => {
//     if (message.type === 'open_side_panel') {
//       console.log("sender.tab.id",sender.tab.id);
//       // This will open a tab-specific side panel only on the current tab.
//       // await chrome.sidePanel.open({ tabId: sender.tab.id });
//       await chrome.sidePanel.setOptions({
//         tabId: sender.tab.id,
//         path: 'sidepanel-tab.html',
//         enabled: true
//       });
//     }
//   })();
});
async function checkLoginStatus() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['token'], function(result) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (!result || !result.token) {
        console.log("Not logged in");
        resolve({ isLoggedIn: false });
      } else {
        console.log("Logged in");
        resolve({ isLoggedIn: true });
      }
    });
  });
}


async function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }      
      if (tabs.length === 0) {
        return reject(new Error("No active tab found."));
      }
      resolve(tabs[0]);
    });
  });
}

function showLoginPopup() {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      // Execute your content script
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content_scripts/showLogin.js"]
      }, function() {
        // Optional callback after the script has been injected
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

function ShowSignup() {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      // Execute your content script
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content_scripts/showSignup.js"]
      }, function() {
        // Optional callback after the script has been injected
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("--------------message.type--------------",message.type);
  if (message.type === 'checkLoginStatus') {
    resp = checkLoginStatus().then((resp) => {
      console.log("resp", resp);
      sendResponse(resp);
    });
    return true;  
  } else if (message.type === 'showLoginPopup') {
    showLoginPopup(); 
  } else if (message.type === 'ShowSignup') {
    ShowSignup(); 
  }
   else {
    return false;
  }
});

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

});
(async function() {
  console.log("Add Comment- start");
  chrome.runtime.sendMessage({type: 'checkLoginStatus'}, response => {
      console.log('Received response:', response);
      if (response.isLoggedIn) {
          console.log("Add Comment- isLoggedIn");
          // let identifier = getIdentifier();
          // showIdentifier(identifier);            
      } else{
        console.log("Add Comment- isLoggedOut");
        chrome.runtime.sendMessage({type: 'showLoginPopup'});
      }
  });
})();
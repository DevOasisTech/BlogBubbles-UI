(async function() {
  console.log("Add Comment- start");
  chrome.runtime.sendMessage({type: 'checkLoginStatus'}, response => {
      console.log('Received response:', response);
      if (response.isLoggedIn) {
          console.log("Add Comment- isLoggedIn");
          
        // Temp code to remove token
          chrome.storage.local.remove(["token"],function(){
            var error = chrome.runtime.lastError;
               if (error) {
                   console.error(error);
               }
           });        

      } else{
        console.log("Add Comment- isLoggedOut");
        chrome.runtime.sendMessage({type: 'showLoginPopup'});
      }
  });
})();
async function showLoginPopup() {
  // Create the modal container
  console.log("122222");
  const modalHtml = await fetch(chrome.runtime.getURL('modal/modal.html')).then(response => response.text());
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  console.log("3333333");

    // Fetch and insert CSS
    const cssUrl = chrome.runtime.getURL('modal/modal.css');
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', cssUrl);
    document.head.appendChild(link);
    console.log("44444");
    // Fetch and insert JS
    const jsContent = await fetch(chrome.runtime.getURL('modal/modal.js')).then(response => response.text());
    let script = document.createElement('script');
    script.textContent = jsContent;
    document.body.appendChild(script);
    console.log("5555555");
return;

  let modalContainer = document.createElement("div");
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "0";
  modalContainer.style.left = "0";
  modalContainer.style.width = "100%";
  modalContainer.style.height = "100%";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modalContainer.style.zIndex = "10000";
  
  // Create the actual modal
  let modal = document.createElement("div");
  modal.style.width = "300px";
  modal.style.height = "200px";
  modal.style.backgroundColor = "#fff";
  modal.style.position = "absolute";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  
  // Create the login form
  let loginForm = `
    <div>
      <label for="username">Username:</label>
      <input type="text" id="username" name="username">
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password">
    </div>
    <button id="loginButton">Login</button>
  `;
  modal.innerHTML = loginForm;
  
  // Add modal to modal container
  modalContainer.appendChild(modal);
  
  // Add modal container to the document
  document.body.appendChild(modalContainer);
  
  // Add event listener to login button
  document.getElementById("loginButton").addEventListener("click", () => {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    // Send the credentials to the background script for validation
    chrome.runtime.sendMessage({type: "validateCredentials", username, password}, response => {
      if (response.status === "success") {
        // Remove the modal
        document.body.removeChild(modalContainer);
      } else {
        // Show an error message (you can enhance this part)
        alert("Invalid credentials");
      }
    });
  });
}

(async function() {
    console.log("SHow login popup.");
    showLoginPopup();

})();
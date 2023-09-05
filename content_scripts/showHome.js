async function showHome() {
  chrome.storage.local.get(["token"], function (result) {
    const token = result.token;
    console.log("tokentoken", token);
    if (token) {
      const userData = getUserDataFromToken(token);
      console.log("userData", userData);
      if (userData) {
        let modalContainer = document.createElement("div");
        modalContainer.style.position = "fixed";
        modalContainer.style.top = "0";
        modalContainer.style.right = "0";
        modalContainer.style.width = "100%";
        modalContainer.style.height = "100%";
        modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        modalContainer.style.zIndex = "10000";
        modalContainer.style.display = "flex";
        modalContainer.style.justifyContent = "flex-end";

        let modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        modalContent.style.backgroundColor = "white";
        modalContent.style.padding = "50px";
        modalContent.style.width = "400px";
        modalContent.style.height = "100vh";

        modalContainer.appendChild(modalContent);

        const loggedInContainer = `
            <div class="logged-in-container">
                <div class="username">Logged in as: ${userData.username}</div>
                <button id="logout-btn" class="logout-button">Logout</button>
            </div>
            `;

        modalContent.innerHTML = loggedInContainer;
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);

        const logoutButton = document.getElementById("logout-btn");

        logoutButton.addEventListener("click", function () {
          chrome.storage.local.remove(["token"], function (result) {
            modalContainer.remove();
            console.log("tokentoken", result.token);
            chrome.runtime.sendMessage({ type: "showLoginPopup" });
          });
        });
      }
    }
  });
}

function getUserDataFromToken(token) {
  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const userData = {
      username: tokenPayload.email,
    };
    console.log("Try", userData);
    return userData;
  } catch (error) {
    console.error("Error decoding token or extracting user data:", error);
    return null;
  }
}
function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
      .logged-in-container {
        background-color: #fff;
        padding: 20px;
        text-align: center;
      }
  
      .username {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .logout-button {
        background-color: #0073e6;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
      }
    `;

  document.head.appendChild(style);
}
addStyles();

(async function () {
  console.log("showHome popup.");
  showHome();
})();

async function showLoginPopup() {

  let modalContainer = document.createElement("div");
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "0";
  modalContainer.style.left = "0";
  modalContainer.style.width = "100%";
  modalContainer.style.height = "100%";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modalContainer.style.zIndex = "10000";
  
  // Create the modal content
  let modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  
  // Create the login form
  let loginForm = `
    <div class="description">Blog Bubbles</div>
    <div class="input-container">
      <input type="email" id="email" placeholder="Enter your email" required>
    </div>
    <div class="input-container">
      <input type="password" id="password" placeholder="Enter your Password" required>
    </div>
    <button id="login-btn" class="login-button">Login</button>
    <div id="error-msg" class="error-msg"></div>
    <p class="create-account-link" id="create-account-link">Don't have an account? <span class="link-text">Sign Up</span></p>
  `;
  modalContent.innerHTML = loginForm;

  modalContainer.appendChild(modalContent);

  document.body.appendChild(modalContainer);


  // Event listener for the login button
  const loginButton = document.getElementById("login-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("error-msg");

  const loginApiUrl = "http://localhost:8000/v1/login";
  const tokenKey = "auth_token";

  loginButton.addEventListener("click", async function () {
    const email = emailInput.value;
    const password = passwordInput.value;
    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    };

    try {
      const response = await fetch(loginApiUrl, requestData);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      const authToken = data?.token;
      localStorage.setItem(tokenKey, authToken);
      console.log("API response:", data);
    
    } catch (error) {
      console.error("API error:", error);
      errorMsg.textContent = error.message;
    }
  });

}

function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .login-container {
      background-color: #fff;
      padding: 20px;
      text-align: center;
    }

    .description {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .input-container {
      margin-bottom: 20px;
    }

    .input-container input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      text-decoration: none;
      outline: none;
      width: 250px;
    }

    .login-button {
      background-color: #0073e6;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }

    .create-account-link {
      margin-top: 20px;
      font-size: 14px;
      cursor: pointer;
      flex: 1;
      margin: 16px 5px;
    }

    .link-text {
      color: #0073e6;
      text-decoration: underline;
    }

    .sign-up-container {
      background-color: #fff;
      padding: 20px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
    }

    .error-msg {
      color: red;
      font-size: 12px;
    }
  `;

  document.head.appendChild(style);
}

addStyles();

(async function() {
    console.log("SHow login popup.");
    showLoginPopup();

})();
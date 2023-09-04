document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const createAccountLink = document.getElementById("create-account-link");
  const errorMsg = document.getElementById("error-msg");

  const loginApiUrl = "http://localhost:8000/v1/login";
  const tokenKey = "auth_token";

  createAccountLink.addEventListener("click", function () {
    console.log("Clicked");
    const signUpPageURL = chrome.runtime.getURL("../components/signUp.html");
    chrome.tabs.create({ url: signUpPageURL });
  });

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

      const commentsPageURL = chrome.runtime.getURL(
        "../components/comments.html"
      );
      chrome.windows.create({
        url: commentsPageURL,
        type: "popup",
      });
    } catch (error) {
      console.error("API error:", error);
      errorMsg.textContent = error.message;
    }
  });
});

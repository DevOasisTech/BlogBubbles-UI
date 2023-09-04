const signupLink = document.getElementById("create-account-link");
const errorMsg = document.getElementById("error-msg");

console.log("Sign Up");
const signUpButton = document.getElementById("signup-button");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const cPasswordInput = document.getElementById("cPassword");

const signUpApiUrl = "http://localhost:8000/v1/register";
const tokenKey = "auth_token";

signupLink.addEventListener("click", function () {
  const signInPageURL = chrome.runtime.getURL("../components/signIn.html");
  chrome.windows.create({
    url: signInPageURL,
    type: "popup",
  });
});

signUpButton.addEventListener("click", async function () {
  console.log("Clicked Sign Up");

  const email = emailInput.value;
  const password = passwordInput.value;
  const cPassword = cPasswordInput.value;

  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password1: password,
      password2: cPassword,
    }),
  };

  try {
    const response = await fetch(signUpApiUrl, requestData);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    const authToken = data?.token;
    localStorage.setItem(tokenKey, authToken);
    const commentsPageURL = chrome.runtime.getURL(
      "../components/comments.html"
    );
    chrome.windows.create({
      url: commentsPageURL,
      type: "popup",
    });
    console.log("API response:", data);
  } catch (error) {
    console.error("API error:", error);
    errorMsg.textContent = error.detail?.[0]?.msg || '';
  }
});

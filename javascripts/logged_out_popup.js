console.log('logged_out_popup.js loaded');

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    alert(1);
    
    // Perform your API call to login
    fetch('http://localhost:8080', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        chrome.storage.local.set({token: data.token}, function() {
          chrome.runtime.sendMessage({type: 'checkLoginStatus'});
        });
      } else {
        // Handle login failure
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
  
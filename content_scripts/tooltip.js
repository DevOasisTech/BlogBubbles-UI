// ... Add tooltip HTML and CSS to the page ...
// Create tooltip HTML element and add it to the body
let skipMouseUp = false;

const tooltip = document.createElement('div');
tooltip.id = 'myTooltip';
tooltip.style.display = 'none';
const button = document.createElement('button');
button.id = 'addCommentBtn';
button.textContent = 'Add Comment';
tooltip.appendChild(button);
document.body.appendChild(tooltip);

// Add tooltip CSS to the page
const tooltipCSS = document.createElement('style');
tooltipCSS.innerHTML = `#myTooltip { position: fixed; background-color: #f9f9f9; border: 1px solid #ccc; padding: 10px; z-index: 1000; }`;
document.head.appendChild(tooltipCSS);

// Now attach event listeners
document.getElementById('addCommentBtn').addEventListener('click', function(event) {
    skipMouseUp = true;
    event.stopPropagation();
    // Add your comment logic here
    console.log("Add Comment button clicked");
  
    // Send a message to the background script to execute the other content script
    chrome.runtime.sendMessage({ type: 'executeAddCommentScript' });
    // stop other event propogation
    return false;
  });


// Function to show tooltip
function showTooltip(x, y) {
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.display = 'block';
  }
  
  // Function to hide tooltip
  function hideTooltip() {
    const tooltip = document.getElementById('myTooltip');
    if (tooltip == null) {
      return;
    }
    tooltip.style.display = 'none';
  }
  
  // Event to show tooltip when text is selected
  document.addEventListener('mouseup', function(e) {
    // Set a timeout to give the browser time to 
    // skipMouseUp for addComment button click
    setTimeout(function() {
        // If skipMouseUp is true, reset it and return immediately
        if (skipMouseUp) {
            skipMouseUp = false;
            return;
        }
    
        const text = window.getSelection().toString().trim();
        if (text.length > 0) {
            showTooltip(e.clientX, e.clientY - 80);
        } else {
          hideTooltip();
        }
    }, 100);
  });

  // Event to reposition tooltip when the page is scrolled
window.addEventListener('scroll', function() {
    const text = window.getSelection().toString().trim();
    if (text.length > 0) {
      hideTooltip();
    }
  });
  
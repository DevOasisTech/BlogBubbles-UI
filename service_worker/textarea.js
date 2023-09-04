// https://www.reddit.com/submit?url=https%3A%2F%2Fyouai.ai%2Fais%2Freact-app-generator[…]%20and%20it%20will%20build%20the%20frontend%20using%20ReactJS
// //use document.activeElement instead of window.getSelection()
// {/* <div class="_2wyvfFW3oNcCs5GVkmcJ8z"><textarea maxlength="300" placeholder="Title" class="PqYQ3WC15KaceZuKcFI02 _1ec_Oj5SWdypd8L-VELKg- " rows="1" style="overflow-x: hidden; overflow-wrap: break-word; height: 60px;">React App Generator v0.1 — Describe the website you want, and it will build the frontend using ReactJS</textarea><div class="_10vnCUi_uRLhIdKnPglWAw">102<!-- -->/<!-- -->300</div></div> */}
// // textarea.selectionStart
// // textarea.selectionEnd

// Your approach seems reasonable for capturing a selection from a regular DOM text node. However, as you have mentioned that your text is inside a `textarea`, using `window.getSelection()` won't capture the selection inside it as you've noticed.

// For a `textarea`, you would have to handle it separately from a regular DOM text node. You can use the `textarea`'s own properties `selectionStart` and `selectionEnd` to get the start and end positions of the selected text. Here's a snippet that combines both approaches depending on the element type:

// ```javascript
// function getSelectionData() {
//   let identifier = {};
//   let selectionNodeData = {};

//   // Check if the focus is in a textarea
//   if (document.activeElement.tagName === 'TEXTAREA') {
//     let textarea = document.activeElement;
//     let start = textarea.selectionStart;
//     let end = textarea.selectionEnd;
//     let text = textarea.value.slice(start, end);

//     // Store in identifier
//     if (textarea.id) {
//       identifier.id = textarea.id;
//     }

//     // Store the selected text data
//     selectionNodeData = {
//       textContent: text,
//       anchorOffset: start,
//       focusOffset: end,
//       contextBefore: textarea.value.slice(0, start),
//       contextAfter: textarea.value.slice(end),
//     };
//   } else {
//     let selection1 = window.getSelection();

//     let anchorNode = selection1.anchorNode;

//     // Navigate up to find the closest element with an ID
//     let parentNode = anchorNode;
//     while (parentNode && parentNode.nodeType !== Node.ELEMENT_NODE) {
//       parentNode = parentNode.parentNode;
//     }

//     while (parentNode) {
//       if (parentNode.id) {
//         identifier.id = parentNode.id;
//         break;
//       }
//       parentNode = parentNode.parentNode;
//     }

//     // Store the selected text data
//     selectionNodeData = {
//       textContent: selection1.toString(),
//       anchorOffset: selection1.anchorOffset,
//       focusOffset: selection1.focusOffset,
//       contextBefore: selection1.anchorNode.textContent.slice(0, selection1.anchorOffset),
//       contextAfter: selection1.focusNode.textContent.slice(selection1.focusOffset),
//     };
//   }

//   console.log("Identifier:", identifier);
//   console.log("Selection Node Data:", selectionNodeData);

//   return { identifier, selectionNodeData };
// }

// // Call function to get selection data
// let { identifier, selectionNodeData } = getSelectionData();
// ```

// This function `getSelectionData` detects whether the user is focused on a `textarea`. If they are, it uses `selectionStart` and `selectionEnd` to find the selection data. Otherwise, it falls back to using `window.getSelection()` for regular text nodes. The function returns both the `identifier` and `selectionNodeData` for later use.

// Make sure to run this code when you actually detect a text selection or some trigger event in your Chrome Extension.



// --------------------------------------------------------------------------------

// What other such cases needs to be handled similar to text area

// Besides `textarea`, there are a few other HTML elements and scenarios you might consider handling specially:

// ### Input Type Text

// The `input` element with `type="text"` also does not work with `window.getSelection()`. You can use the same approach as with `textarea`, utilizing `selectionStart` and `selectionEnd`.

// ```javascript
// if (document.activeElement.tagName === 'INPUT') {
//   let input = document.activeElement;
//   let type = input.getAttribute('type');
//   if (type === 'text') {
//     // Use selectionStart and selectionEnd
//   }
// }
// ```

// ### Content Editable Elements

// Some web pages use elements with the `contenteditable` attribute set to `true`. You can use `window.getSelection()` for these, but you might still want to check for the `contenteditable` attribute to handle them differently if needed.

// ```javascript
// if (document.activeElement.getAttribute('contenteditable') === 'true') {
//   // Handle differently if you want to
// }
// ```

// ### Rich Text Editors

// Some web applications use complex DOM structures and JavaScript to build rich text editors (like CKEditor, TinyMCE, etc.). These usually are built using `iframe`s or multiple nested elements and would require special handling.

// ### SVG Elements

// SVG elements aren't exactly text, but sometimes you might want to handle interactions with them differently.

// ### Shadow DOM

// If the web page is using Web Components with Shadow DOM, you'll have to pierce through the Shadow DOM to get the real selected element.

// ### Selection Across Multiple Elements

// Sometimes, the user may select text across multiple sibling elements. This is a more complex scenario that `window.getSelection()` can usually handle, but you might want to identify each element involved in the selection.

// ### Multi-frame Web Pages

// If a web page includes multiple frames (using `iframe` tags), each will have its own separate `window` and `document` objects. You would need to recurse into each frame to check for selections there as well.

// By considering these different types of elements and scenarios, you can make your text selection feature more robust and versatile.


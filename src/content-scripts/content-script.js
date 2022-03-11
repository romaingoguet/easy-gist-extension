import { setLocalStorage } from '../services/storage';

/**
 * Insert the form frame in the web page
 * @param {Object} gist
 */
function insertIframe(gist = {}) {
  const ifrm = document.createElement('iframe');
  ifrm.classList.add('iframe-gist');
  ifrm.setAttribute('allowtransparency', 'true');
  ifrm.id = 'gist-ifrm';
  ifrm.src = chrome.extension.getURL('form.html');
  ifrm.src += `?${new URLSearchParams(gist).toString()}`;
  ifrm.style.width = '100%';
  ifrm.style.height = '100%';
  document.body.appendChild(ifrm);
}

/**
 *  Copy a string in the clipboard
 * @param {string} text
 */
function copyToClipboard(text) {
  const input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = text;
  // input.focus();
  input.select();
  document.execCommand('Copy');
  input.remove();
}

/**
 * Show Snackbar notification
 * @param {string} message
 */
function showNotification(message) {
  const snackBar = document.getElementById('eg-snackbar');
  snackBar.innerHTML = message;
  snackBar.className = 'eg-show';
  setTimeout(() => { snackBar.className = snackBar.className.replace('eg-show', ''); }, 3000);
}

/**
 * Listen for request from background
 */
chrome.runtime.onMessage.addListener(
  (request, response, sendResponse) => {
    if (request.command === 'openForm') {
      insertIframe(request.gistData);
    }
    if (request.command === 'getSelection') {
      sendResponse({ selectText: window.getSelection().toString() });
    }
  },
);

/**
 * Listen for event from the iframe
 * @param {*} event
 */
function receiveMessage(event) {
  // remove the iFrame from DOM
  if (event.data.command === 'removetheiframe') {
    const element = document.getElementById('gist-ifrm');
    if (element !== undefined && element !== null) {
      element.remove();
    }
  }

  // Save the information send from Gist
  if (event.data.command === 'save') {
    chrome.runtime.sendMessage({ command: 'save', gist: event.data.gist }, (response) => {
      if (response.status === 201) {
        setLocalStorage({ lastGistUrl: response.post.html_url });
        showNotification('Gist Saved. Link copied in clipboard');
        copyToClipboard(response.post.html_url);
      } else if (response.status === 401) {
        showNotification('You need to be connected to Github account to save the gist');
      } else {
        showNotification('Error. Could not saved the gist');
        console.error('Error: Not Saved');
      }
      if (document.getElementById('gist-ifrm') !== null) {
        document.getElementById('gist-ifrm').remove();
      }
    });
  }
}

window.addEventListener('message', receiveMessage, false);

/**
 * add the div for notifications
 */
function addSnackBarDiv() {
  const notifDiv = document.createElement('div');
  notifDiv.id = 'eg-snackbar';
  document.body.appendChild(notifDiv);
}

window.addEventListener('load', addSnackBarDiv, false);

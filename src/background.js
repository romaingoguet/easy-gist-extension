import { postGist } from './services/github';
import { getLocaleStorage } from './services/storage';

// Context menu save Gist
const contextMenu = {
  id: 'gist',
  title: 'Gist',
  contexts: ['selection'],
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(contextMenu);
});

chrome.contextMenus.onClicked.addListener((clicked) => {
  if (clicked.menuItemId === 'gist' && clicked.selectionText) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'getSelection' }, (response) => {
        const gist = {
          code: response.selectText,
          title: '',
          filename: '',
        };
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { gistData: gist, command: 'openForm' });
        });
      });
    });
  }
});

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.command === 'save') {
      const token = await getLocaleStorage('authToken');
      if (token !== '') {
        const post = await postGist(token, request.gist);
        sendResponse({ status: post.status, post: post.data.result.data });
      } else {
        sendResponse({ status: 401 });
      }
    }

    if (request.command === 'checkUser') {
      const token = await getLocaleStorage('authToken');
      sendResponse({ isAuth: token !== undefined && token !== '' && token !== null });
    }
  },
);

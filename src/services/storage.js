/**
 * Save data in LocalStorage
 * @param {Object} data
 */
async function setLocalStorage(data) {
  chrome.storage.local.set(data);
}

/**
 * @param {string} key
 */
function getLocaleStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      console.log('getresult');
      console.log(result);
      if (result[key] !== undefined) {
        resolve(result[key]);
      } else {
        // reject(new Error(`Could not get local storage value for key: ${key}`));
        resolve(undefined);
      }
      reject();
    });
  });
}

/**
 * @param {string} url
 */
async function storeLastLinkClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
  } catch (ex) {
    console.error(`save in clipboard failed: ${ex}`);
  }
}

export {
  storeLastLinkClipboard,
  setLocalStorage,
  getLocaleStorage,
};

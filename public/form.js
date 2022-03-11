/**
 * html for the login modal
 */
function getLoginModale() {
    return `
    <div class="modal-content">
        <div class="text">You need to sign in to save a Gist</div>
        <button id="ok" class="gist-savebutton">Ok</button>
    </div>`;
}

/**
 * html for the form modal
 */
function getModale() {
    return `
  <div class="dialogbox" id="iframe">
    <div class="modal-content" id="modale">
      <div id="close-button" class="close-button">X</div>
      <form class="gist-form">
        <h1>Easy Gist</h1>
        <div class="radio">
            <input type="radio" id="vis-public" name="visibility" value="public" checked>
            <label for="vis-public">Public</label>
            <input type="radio" id="vis-private" name="visibility" value="private">
            <label for="vis-private">Private</label>
        </div>
        <label>Filename</label>
        <input type="text" id="gist-filename" value="">
        <label>Code</label>
        <textarea name="code" id="gist-code" cols="" rows="10"></textarea>
        <label>Description</label>
        <textarea name="description" id="gist-description" cols="" rows="2"></textarea>
        <button type="submit" id="save" class="gist-savebutton">Save Gist</button>
      </form>
    </div>
  </div>`;
}

/**
 * close the frame
 */
function closeFrame() {
    parent.window.postMessage({ command: 'removetheiframe' }, '*');
}

/**
 * Bind data in the form
 * @param {Object} gist 
 */
function bindGist(gist) {
    document.getElementById('gist-filename').value = gist.filename;
    document.getElementById('gist-code').innerHTML = gist.code;
}

/**
 * Get data from the form
 */
function getFormData() {
    var gist = {};
    gist.filename = document.getElementById('gist-filename').value;
    gist.code = document.getElementById('gist-code').value;
    gist.description = document.getElementById('gist-description').value;
    gist.private = document.querySelector('input[name="visibility"]:checked').value;
    return gist;
}

chrome.runtime.sendMessage({ command: 'checkUser' }, (response) => {
    if (response.isAuth) {
        // is logged
        const gist = Object.fromEntries(new URLSearchParams(location.search));
        gist.description = '';
        document.getElementById('container').innerHTML = getModale();
        bindGist(gist);
        document.getElementById('modale').addEventListener('click', function (e) {
            e.stopPropagation();
        })
        document.getElementById('save').addEventListener('click', function (e) {
            var gist = getFormData();
            parent.window.postMessage({ command: 'save', gist: gist }, '*');
            closeFrame();
        })
        document.getElementById('close-button').addEventListener('click', function (e) {
            closeFrame();
        })
    } else {
        // is not logged
        document.getElementById('container').innerHTML = getLoginModale();
        document.getElementById('modale').addEventListener('click', function (e) {
            e.stopPropagation();
        })
        document.getElementById('ok').addEventListener('click', function () {
            closeFrame();
        })
    }
})

document.body.addEventListener('click', function () {
    closeFrame();
})
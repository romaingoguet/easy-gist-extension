import axios from 'axios';

/**
 *
 * @param {string} code
 * @returns {Object}
 */
async function getToken(code) {
  const result = await axios.get(`${process.env.VUE_APP_GIT_SERVER_BASE_URL}token?code=${code}`);
  return result.data.token;
}

/**
 *
 * @param {string} token
 * @param {Object} gist
 * @returns {boolean}
 */
async function postGist(token, gist) {
  try {
    const result = await axios.post(`${process.env.VUE_APP_GIT_SERVER_BASE_URL}gist?token=${token}`, gist);
    return result;
  } catch (ex) {
    return { status: 500 };
  }
}

/**
 *
 * @param {string} token
 * @returns {Object}
 */
async function getUserData(token) {
  const url = `${process.env.VUE_APP_GIT_SERVER_BASE_URL}user?token=${token}`;
  const userData = await axios.get(url);
  return userData.data.user.data;
}

export {
  getToken,
  postGist,
  getUserData,
};

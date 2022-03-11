<template>
  <div class="component">
    <div class="header">
      <img id="logo" src="../assets/img/38.png" alt="Easy gist Logo" />
      <span class="has-text-weight-bold is-size-4"> Easy Gist </span>
    </div>
    <div class="body">
      <div class="buttons" v-if="!logged">
        <b-button
          size="is-small has-text-weight-bold is-dark is-fullwidth"
          icon-pack="fab"
          icon-left="github"
          v-on:click="connect"
          id="connect"
          :loading="loading"
        >
          Login with Github
        </b-button>
      </div>
      <div class="buttons" v-if="logged">
        <b-button
          icon-pack="fab"
          icon-left="github"
          v-if="logged"
          class="is-small is-dark has-text-weight-bold button is-fullwidth"
          v-on:click="openUserGistPage"
          id="token"
        >
          My Gists
        </b-button>
      </div>
    </div>
    <div v-if="logged" class="foot is-size-7">
      <span class="name">{{ this.user.name }} </span>
      <a class="logout-icon" v-on:click="disconnect">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler
        icon-tabler-power" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 6a7.75 7.75 0 1 0 10 0" />
          <line x1="12" y1="4" x2="12" y2="12" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
import { getToken, getUserData } from '../services/github';
import { setLocalStorage, getLocaleStorage } from '../services/storage';

export default {
  name: 'Popup',
  components: {},
  data() {
    return {
      logged: false,
      token: null,
      user: null,
      loading: false,
    };
  },
  methods: {
    async connect() {
      this.loading = true;
      chrome.identity.launchWebAuthFlow(
        {
          url: `https://github.com/login/oauth/authorize?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}`,
          interactive: true,
        },
        async (url) => {
          try {
            // todo : gérer le cas ou on a un mauvais retour
            // https://npilhmkhlkdkofffinodgandllpchdoa.chromiumapp.org/github?code=b98f355bf0f7291c8d7a
            const queryString = url.split('?')[1];
            const urlParameters = new URLSearchParams(queryString);
            const code = urlParameters.get('code');
            console.log(code);
            const token = await getToken(code);
            setLocalStorage({ authToken: token });
            const user = await getUserData(token);
            this.user = user;
            setLocalStorage({ user });
            this.token = token;
            this.logged = token !== undefined && token !== '' && token !== null;
            this.loading = false;
          } catch (ex) {
            this.logged = false;
            this.loading = false;
            this.user = {};
          }
        },
      );
    },
    async openUserGistPage() {
      const win = window.open(
        `https://gist.github.com/${this.user.login}`,
        '_blank',
      );
      win.focus();
    },
    async disconnect() {
      setLocalStorage({ authToken: '' });
      this.logged = false;
    },
  },
  async mounted() {
    try {
      const user = await getLocaleStorage('user');
      this.user = user !== undefined ? user : null;
      this.token = await getLocaleStorage('authToken');
      this.logged = this.token !== undefined && this.token !== '' && this.token !== null;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style scoped>
.header {
  padding: 8px 16px;
  border-bottom: solid 1px rgb(181 181 181 / 60%);
  display: flex;
  align-items: center;
}

.body {
  padding: 8px 16px;
}

.foot {
  float: right;
  height : 10px;
}

.name {
  padding-right: 5px;
}

.buttons {
  padding: 8px 16px;
}

#logo {
  height: 30px;
  margin-right: 0.5rem;
}

.logout-icon, .name {
  vertical-align: middle;
  display: inline-block;
}
</style>

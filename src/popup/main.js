import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';

library.add(fas);
library.add(fab);
Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
  customIconPacks: {
    fas: {
      sizes: {
        default: 'lg',
        'is-small': '1x',
        'is-medium': '2x',
        'is-large': '3x',
      },
      iconPrefix: '',
    },
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h) => h(App),
});

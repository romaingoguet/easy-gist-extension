<template>
  <div id="app">
    <popup />
  </div>
</template>
<script>
import Popup from '../components/Popup.vue';

export default {
  name: 'App',
  components: { Popup },
};
</script>

<style>
#app {
  font-family: Merriweather, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html {
  width: 300px;
  height: 120px;
}
</style>

<template>
  <div id="app">
    <v-app>
      <v-main>
        <preview :value="config"/>
        <config v-model="config"/>
      </v-main>
      <foot/>
    </v-app>
  </div>
</template>

<script>
import Config from './Config.vue';
import Foot from './Foot.vue';
import Preview from './Preview.vue';

export default {
  name: 'App',
  components: {
    Config,
    Foot,
    Preview,
  },
  data() {
    return {
      config: {
        screenWidth: 3810,
        screenHeight: 2160,
        titleWidth: 2280,
        fontColor: process.env.NODE_ENV === 'development'
          ? 'red'
          : 'white',
        shadowColor: process.env.NODE_ENV === 'development'
          ? 'purple'
          : 'black',
        shadowBlur: 20,
        lineSpacing: 6,
        gridSpacing: 52,
        gridLineWidth: 16,
        lines: [
          'WATZMANN',
        ],
        gridLines: [
          new Date().toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
          '1433 HM',
          '12,1 KM',
        ],
      },
    };
  },
};
</script>

<style>
html, body {
  height: 100%;
}
.v-main {
  background-color: grey;
}
</style>

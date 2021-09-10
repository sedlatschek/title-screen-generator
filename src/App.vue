<template>
  <div id="app">
    <v-app>
      <v-main>
        <config v-model="config"/>
        <preview :value="config"/>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Config from './Config.vue';
import Preview from './Preview.vue';

export default {
  name: 'App',
  components: {
    Config,
    Preview,
  },
  data() {
    return {
      config: {
        screenWidth: 3810,
        screenHeight: 2160,
        titleWidth: 2280,
        fontColor: process.env.NODE_ENV === 'development' ? 'red' : 'white',
        lineSpacing: 6,
        gridSpacing: 52,
        gridLineWidth: 16,
        lines: [
          'Kampenwand',
          'Watzmannüberschreitung',
          'XYäddd',
          'AS1234sdfa2sadfgasfdasfasdfsadf',
        ],
        gridLines: [
          '11.09.2021',
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

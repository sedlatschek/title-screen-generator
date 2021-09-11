<template>
  <div class="d-flex justify-center">
    <v-card class="ma-5" style="max-width: 641px">
      <v-form class="pa-5">
        <v-row>
          <v-col>
            <v-text-field
              @input="$emit('input', tmp)"
              v-model="tmp.screenWidth"
              type="number"
              min="1"
              label="Screen Width"/>
          </v-col>
          <v-col>
            <v-text-field
              @input="$emit('input', tmp)"
              v-model="tmp.screenHeight"
              type="number"
              min="1"
              label="Screen Height"/>
          </v-col>
          <v-col>
            <v-text-field
              @input="$emit('input', tmp)"
              v-model="tmp.titleWidth"
              type="number"
              min="1"
              label="Title Width"/>
          </v-col>
          <v-col>
            <v-text-field
              @input="$emit('input', tmp)"
              v-model="tmp.fontColor"
              label="Font Color"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              @input="$emit('input', tmp)"
              v-model="tmp.gridSpacing"
              type="number"
              min="1"
              label="Grid Spacing"/>
          </v-col>
          <v-col>
            <v-text-field
              @input="$emit('input', tmp)"
              v-model="tmp.gridLineWidth"
              type="number"
              min="1"
              label="Grid Line Width"/>
          </v-col>
          <v-col>
            <v-text-field
              @input="$emit('input', tmp)"
              v-model="tmp.lineSpacing"
              type="number"
              min="1"
              label="Line Spacing"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="lines"
              @input="onInput('lines')"
              label="Lines"
              rows="4"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="gridLines"
              @input="onInput('gridLines')"
              label="Grid Lines"
              rows="3"/>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Config',
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tmp: null,
      lines: [],
      gridLines: [],
    };
  },
  watch: {
    value(val) {
      this.reset(val);
    },
  },
  methods: {
    reset(value) {
      this.tmp = { ...value };
      this.lines = value.lines.join('\n');
      this.gridLines = value.gridLines.join('\n');
    },
    onInput(key) {
      this.$nextTick(() => {
        this.tmp[key] = this[key].split('\n');
        this.$emit('input', this.tmp);
      });
    },
  },
  created() {
    this.reset(this.value);
  },
};
</script>

<style scoped>
.v-form {
  background-color: white;
}
</style>

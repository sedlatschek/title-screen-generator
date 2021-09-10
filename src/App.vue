<template>
  <div id="app">
    <canvas ref="canvas" width="3840" height="2160"></canvas>
  </div>
</template>

<script>
import trimCanvas from './trimCanvas';

export default {
  name: 'App',
  computed: {
    left() {
      return (this.screenWidth - this.titleWidth) / 2;
    },
  },
  data() {
    return {
      screenWidth: 3810,
      screenHeight: 2160,
      titleWidth: 2280,
      fontColor: process.env.NODE_ENV === 'development' ? 'red' : 'white',
      lines: [
        'Kampenwand',
        'Watzmannüberschreitung',
        'XYäddd',
        'AS1234sdfa2sadfgasfdasfasdfsadf',
      ],
    };
  },
  methods: {
    font(fontSize) {
      return `${fontSize}px Segoe UI`;
    },
    createCanvas(additionalHeight = 0) {
      const canvas = window.document.createElement('canvas');
      canvas.height = this.screenHeight + additionalHeight;
      canvas.width = this.screenWidth;
      return canvas;
    },
    getFontSizeToAchieveWidth(line, targetWidth) {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.fillStyle = this.fontColor;
      let px = 0;
      let measuredWidth = -1;

      // get a rough estimate by using the measureText function
      while (measuredWidth < targetWidth) {
        px += 1;
        ctx.font = this.font(px);
        measuredWidth = ctx.measureText(line).width;
      }

      // get a more precise result by trying and measuring pixels
      if (process.env.NODE_ENV === 'production') {
        px -= 2;
        measuredWidth = -1;
        while (measuredWidth < targetWidth) {
          const canvas = this.createCanvas(1000);
          const tmp = canvas.getContext('2d');
          tmp.textBaseline = 'top';
          tmp.fillStyle = this.fontColor;
          tmp.font = this.font(px);
          tmp.fillText(line, 0, 1000);
          trimCanvas(canvas);
          measuredWidth = canvas.width;
          px += 0.1;
        }
      }

      return px;
    },
    makeBorderAroundCanvas(canvas) {
      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'green';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    },
    makeText(line, fontSize) {
      const canvas = this.createCanvas(1000);
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.fillStyle = this.fontColor;
      ctx.font = this.font(fontSize);
      ctx.fillText(line, 0, 1000);
      trimCanvas(canvas);
      return canvas;
    },
  },
  mounted() {
    console.log('mounted');
    const { canvas } = this.$refs;
    const ctx = canvas.getContext('2d');

    let y = 0;
    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i].toUpperCase();
      const fontSize = this.getFontSizeToAchieveWidth(line, this.titleWidth);
      const text = this.makeText(line, fontSize);
      if (process.env.NODE_ENV === 'development') {
        this.makeBorderAroundCanvas(text);
      }

      if (process.env.NODE_ENV === 'development') {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.fillRect(text.width + i * 60, y, 30, text.height);
      }

      const left = (canvas.width - text.width) / 2;
      ctx.drawImage(text, left, y);

      y += text.height;
    }

    if (process.env.NODE_ENV === 'development') {
      const left = (canvas.width - this.titleWidth) / 2;
      const top = canvas.height / 2;
      ctx.fillStyle = 'green';
      // left debug spacer bar
      ctx.fillRect(0, top, left, 30);
      // right debug spacer bar
      ctx.fillRect(canvas.width - left, top, left, 30);
    }
  },
};
</script>

<style>
html, body {
  height: 100%;
  background-color: grey;
}
canvas {
  background-color: white;
}
</style>

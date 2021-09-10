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
      lineSpacing: 6,
      gridSpacing: 52,
      gridLineWidth: 16,
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
      const lines = Array.isArray(line) ? line : [line];
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.fillStyle = this.fontColor;
      let px = 0;
      let measuredWidth = -1;

      // get a rough estimate by using the measureText function
      while (measuredWidth < targetWidth) {
        px += 1;
        measuredWidth = -1;
        ctx.font = this.font(px);
        for (let i = 0; i < lines.length; i += 1) {
          measuredWidth += ctx.measureText(lines[i]).width;
        }
      }

      // get a more precise result by trying and measuring pixels
      if (process.env.NODE_ENV === 'production') {
        px -= 2;
        measuredWidth = -1;
        while (measuredWidth < targetWidth) {
          measuredWidth = -1;
          px += 0.1;
          for (let i = 0; i < lines.length; i += 1) {
            const canvas = this.createCanvas(1000);
            const tmp = canvas.getContext('2d');
            tmp.textBaseline = 'top';
            tmp.fillStyle = this.fontColor;
            tmp.font = this.font(px);
            tmp.fillText(lines[i], 0, 1000);
            trimCanvas(canvas);
            measuredWidth += canvas.width;
          }
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
    makeGrid(columns) {
      const canvas = this.createCanvas();
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = this.fontColor;

      const spaces = columns.length - 1;
      const spacing = spaces * (this.gridSpacing * 2 + this.gridLineWidth);
      const fontSize = this.getFontSizeToAchieveWidth(columns, this.titleWidth - spacing);

      let left = 0;
      for (let i = 0; i < columns.length; i += 1) {
        const text = this.makeText(columns[i], fontSize);
        ctx.drawImage(text, left, this.gridSpacing / 2);
        left += text.width + this.gridSpacing;
        if (i < columns.length - 1) {
          const height = fontSize + this.gridSpacing / 2 - this.gridLineWidth;
          ctx.fillRect(left, 0, this.gridLineWidth, height);
          left += this.gridSpacing + this.gridLineWidth;
        }
      }

      trimCanvas(canvas);

      return canvas;
    },
    makeTitle(titleLines, gridLines) {
      const canvas = this.createCanvas();
      const ctx = canvas.getContext('2d');

      let y = 0;
      for (let i = 0; i < titleLines.length; i += 1) {
        const line = titleLines[i].toUpperCase();
        const fontSize = this.getFontSizeToAchieveWidth(line, this.titleWidth);
        const text = this.makeText(line, fontSize);
        if (process.env.NODE_ENV === 'development') {
          this.makeBorderAroundCanvas(text);
        }

        if (process.env.NODE_ENV === 'development') {
          ctx.fillStyle = 'blue';
          ctx.fillRect(text.width + i * 60, y, 30, text.height);
        }

        const left = (canvas.width - text.width) / 2;
        ctx.drawImage(text, left, y);

        y += text.height + this.lineSpacing;
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

      // grid
      y += this.gridSpacing / 2;
      const grid = this.makeGrid(gridLines);
      const left = (canvas.width - grid.width) / 2;
      ctx.fillStyle = this.fontColor;
      ctx.fillRect(left, y, grid.width, this.gridLineWidth);
      ctx.drawImage(grid, (canvas.width - grid.width) / 2, y + this.gridLineWidth);

      trimCanvas(canvas);

      return canvas;
    },
  },
  mounted() {
    const title = this.makeTitle(this.lines, ['11.09.2021', '1433 HM', '24,1 KM']);

    this.$refs.canvas.getContext('2d').drawImage(
      title,
      (this.$refs.canvas.width - title.width) / 2,
      (this.$refs.canvas.height - title.height) / 2,
    );
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
  width: 100%;
}
</style>

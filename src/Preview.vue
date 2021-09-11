<template>
  <div class="text-center px-5 pt-5">
    <canvas
      class="canvas"
      ref="canvas"
      width="3840"
      height="2160"/>
    <v-btn
      class="ma-5"
      color="primary"
      @click.prevent="draw">
      Draw Title
    </v-btn>
    <v-btn
      class="ma-5"
      color="primary"
      @click.prevent="save">
      Save PNG
    </v-btn>
  </div>
</template>

<script>
import trimCanvas from './trimCanvas';

export default {
  name: 'Preview',
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  computed: {
    left() {
      return (this.value.screenWidth - this.value.titleWidth) / 2;
    },
  },
  methods: {
    font(fontSize) {
      return `${fontSize}px Segoe UI`;
    },
    createCanvas(additionalHeight = 0) {
      const canvas = window.document.createElement('canvas');
      canvas.height = this.value.screenHeight + additionalHeight;
      canvas.width = this.value.screenWidth;
      return canvas;
    },
    getFontSizeToAchieveWidth(line, targetWidth) {
      const lines = Array.isArray(line) ? line : [line];
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.fillStyle = this.value.fontColor;
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
            tmp.fillStyle = this.value.fontColor;
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
      ctx.fillStyle = this.value.fontColor;
      ctx.font = this.font(fontSize);
      ctx.fillText(line, 0, 1000);
      trimCanvas(canvas);
      return canvas;
    },
    makeGrid(columns) {
      const canvas = this.createCanvas();
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = this.value.fontColor;

      const spaces = columns.length - 1;
      const spacing = spaces * (this.value.gridSpacing * 2 + this.value.gridLineWidth);
      const fontSize = this.getFontSizeToAchieveWidth(columns, this.value.titleWidth - spacing);

      let left = 0;
      for (let i = 0; i < columns.length; i += 1) {
        const text = this.makeText(columns[i], fontSize);
        ctx.drawImage(text, left, this.value.gridSpacing / 2);
        left += text.width + this.value.gridSpacing;
        if (i < columns.length - 1) {
          const height = fontSize + this.value.gridSpacing / 2 - this.value.gridLineWidth;
          ctx.fillRect(left, 0, this.value.gridLineWidth, height);
          left += this.value.gridSpacing + this.value.gridLineWidth;
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
        const line = titleLines[i];
        const fontSize = this.getFontSizeToAchieveWidth(line, this.value.titleWidth);
        const text = this.makeText(line, fontSize);
        if (process.env.NODE_ENV === 'development') {
          this.makeBorderAroundCanvas(text);
        }

        if (process.env.NODE_ENV === 'development') {
          ctx.fillStyle = 'blue';
          ctx.fillRect(text.width / 2 + i * 60, y, 30, text.height);
        }

        const left = (canvas.width - text.width) / 2;
        ctx.drawImage(text, left, y);

        y += text.height + this.value.lineSpacing;
      }

      if (process.env.NODE_ENV === 'development') {
        const left = (canvas.width - this.value.titleWidth) / 2;
        ctx.fillStyle = 'green';
        // left debug spacer bar
        ctx.fillRect(0, 0, left, 30);
        // right debug spacer bar
        ctx.fillRect(canvas.width - left, 0, left, 30);
      }

      // grid
      y += this.value.gridSpacing / 2;
      const grid = this.makeGrid(gridLines);
      const left = (canvas.width - grid.width) / 2;
      ctx.fillStyle = this.value.fontColor;
      ctx.fillRect(left, y, grid.width, this.value.gridLineWidth);
      ctx.drawImage(grid, (canvas.width - grid.width) / 2, y + this.value.gridLineWidth);

      trimCanvas(canvas);

      return canvas;
    },
    draw() {
      const { canvas } = this.$refs;
      canvas.width = this.value.screenWidth;
      canvas.height = this.value.screenHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const title = this.makeTitle(this.value.lines, this.value.gridLines);

      ctx.drawImage(
        title,
        (canvas.width - title.width) / 2,
        (canvas.height - title.height) / 2,
      );
    },
    save() {
      const { canvas } = this.$refs;
      const image = canvas.toDataURL();
      const anchor = document.createElement('a');
      anchor.download = 'title.png';
      anchor.href = image;
      anchor.click();
    },
  },
};
</script>

<style scoped>
.canvas {
  background-color: white;
  width: 100%;
}
</style>

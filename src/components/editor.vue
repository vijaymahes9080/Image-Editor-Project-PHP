<template>
  <div class="editor">
    <div class="canvas" @dblclick="dblclick">
      <img ref="image" :alt="data.name" :src="data.url" @load="start">
    </div>
    <div class="toolbar" v-if="cropper" @click="click">
      <button class="toolbar__button" data-action="move" title="Move (M)"><span class="fa fa-arrows"></span></button>
      <button class="toolbar__button" data-action="crop" title="Crop (C)"><span class="fa fa-crop"></span></button>
      <button class="toolbar__button" data-action="zoom-in" title="Zoom In (I)"><span class="fa fa-search-plus"></span></button>
      <button class="toolbar__button" data-action="zoom-out" title="Zoom Out (O)"><span class="fa fa-search-minus"></span></button>
      <button class="toolbar__button" data-action="rotate-left" title="Rotate Left (L)"><span class="fa fa-rotate-left"></span></button>
      <button class="toolbar__button" data-action="rotate-right" title="Rotate Right (R)"><span class="fa fa-rotate-right"></span></button>
      <button class="toolbar__button" data-action="flip-horizontal" title="Flip Horizontal (H)"><span class="fa fa-arrows-h"></span></button>
      <button class="toolbar__button" data-action="flip-vertical" title="Flip Vertical (V)"><span class="fa fa-arrows-v"></span></button>
    </div>
  </div>
</template>

<script>
  import Cropper from 'cropperjs';

  export default {
    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        canvasData: null,
        cropBoxData: null,
        croppedData: null,
        cropper: null,
      };
    },

    methods: {
      click({ target }) {
        const { cropper } = this;
        const action = target.getAttribute('data-action') || target.parentElement.getAttribute('data-action');

        switch (action) {
          case 'move':
          case 'crop':
            cropper.setDragMode(action);
            break;

          case 'zoom-in':
            cropper.zoom(0.1);
            break;

          case 'zoom-out':
            cropper.zoom(-0.1);
            break;

          case 'rotate-left':
            cropper.rotate(-90);
            break;

          case 'rotate-right':
            cropper.rotate(90);
            break;

          case 'flip-horizontal':
            cropper.scaleX(-cropper.getData().scaleX || -1);
            break;

          case 'flip-vertical':
            cropper.scaleY(-cropper.getData().scaleY || -1);
            break;

          default:
        }
      },

      keydown(e) {
        switch (e.key) {
          // Undo crop
          case 'z':
            if (e.ctrlKey) {
              e.preventDefault();
              this.restore();
            }

            break;

          // Delete the image
          case 'Delete':
            this.reset();
            break;

          default:
        }

        const { cropper } = this;

        if (!cropper) {
          return;
        }

        switch (e.key) {
          // Crop the image
          case 'Enter':
            this.crop();
            break;

          // Clear crop area
          case 'Escape':
            this.clear();
            break;

          // Move to the left
          case 'ArrowLeft':
            e.preventDefault();
            cropper.move(-1, 0);
            break;

          // Move to the top
          case 'ArrowUp':
            e.preventDefault();
            cropper.move(0, -1);
            break;

          // Move to the right
          case 'ArrowRight':
            e.preventDefault();
            cropper.move(1, 0);
            break;

          // Move to the bottom
          case 'ArrowDown':
            e.preventDefault();
            cropper.move(0, 1);
            break;

          // Enter crop mode
          case 'c':
            cropper.setDragMode('crop');
            break;

          // Enter move mode
          case 'm':
            cropper.setDragMode('move');
            break;

          // Zoom in
          case 'i':
            cropper.zoom(0.1);
            break;

          // Zoom out
          case 'o':
            cropper.zoom(-0.1);
            break;

          // Rotate left
          case 'l':
            cropper.rotate(-90);
            break;

          // Rotate right
          case 'r':
            cropper.rotate(90);
            break;

          // Flip horizontal
          case 'h':
            cropper.scaleX(-cropper.getData().scaleX || -1);
            break;

          // Flip vertical
          case 'v':
            cropper.scaleY(-cropper.getData().scaleY || -1);
            break;

          default:
        }
      },

      dblclick(e) {
        if (e.target.className.indexOf('cropper-face') >= 0) {
          e.preventDefault();
          e.stopPropagation();
          this.crop();
        }
      },

      start() {
        const { data } = this;

        if (data.cropped) {
          return;
        }

        this.cropper = new Cropper(this.$refs.image, {
          autoCrop: false,
          dragMode: 'move',
          background: false,

          ready: () => {
            if (this.croppedData) {
              this.cropper
                .crop()
                .setData(this.croppedData)
                .setCanvasData(this.canvasData)
                .setCropBoxData(this.cropBoxData);

              this.croppedData = null;
              this.canvasData = null;
              this.cropBoxData = null;
            }
          },

          crop: ({ detail }) => {
            if (detail.width > 0 && detail.height > 0 && !data.cropping) {
              this.update({
                cropping: true,
              });
            }
          },
        });
      },

      stop() {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = null;
        }
      },

      crop() {
        const { cropper, data } = this;

        if (data.cropping) {
          this.croppedData = cropper.getData();
          this.canvasData = cropper.getCanvasData();
          this.cropBoxData = cropper.getCropBoxData();
          this.update({
            cropped: true,
            cropping: false,
            previousUrl: data.url,
            url: cropper.getCroppedCanvas(data.type === 'image/png' ? {} : {
              fillColor: '#fff',
            }).toDataURL(data.type),
          });
          this.stop();
        }
      },

      clear() {
        if (this.data.cropping) {
          this.cropper.clear();
          this.update({
            cropping: false,
          });
        }
      },

      restore() {
        if (this.data.cropped) {
          this.update({
            cropped: false,
            previousUrl: '',
            url: this.data.previousUrl,
          });
        }
      },

      reset() {
        this.stop();
        this.update({
          cropped: false,
          cropping: false,
          loaded: false,
          name: '',
          previousUrl: '',
          type: '',
          url: '',
        });
      },

      update(data) {
        Object.assign(this.data, data);
      },
    },

    mounted() {
      window.addEventListener('keydown', (this.onKeydown = this.keydown.bind(this)));
    },

    beforeDestroy() {
      window.removeEventListener('keydown', this.onKeydown);
      this.stop();
    },
  };
</script>

<style scoped>
  .editor {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .canvas {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;

    & > img {
      max-height: 100%;
      max-width: 100%;
    }
  }

  .toolbar {
    background: rgba(20, 20, 20, 0.75);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    bottom: 2rem;
    color: #fff;
    height: 3rem;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    padding: 0 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 2015;
  }

  .toolbar__button {
    background-color: transparent;
    border-width: 0;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    margin: 0 0.15rem;

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      transform: scale(1.08);
    }
  }
</style>

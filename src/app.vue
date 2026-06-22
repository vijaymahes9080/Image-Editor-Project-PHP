<template>
  <div class="app">
    <header class="header">
      <span class="title">Photo Editor</span>
      <navbar :data="activeImage || {}" @change="change"></navbar>
    </header>
    <main class="main">
      <div v-if="images.length > 0" class="editor-container">
        <!-- Sidebar/Thumbnail List of uploaded images -->
        <div class="thumbnails-sidebar">
          <div 
            v-for="(img, index) in images" 
            :key="img.url" 
            :class="['thumbnail-item', { active: index === activeIndex }]"
            @click="selectImage(index)"
          >
            <img :src="img.url" :alt="img.name" />
            <button class="thumbnail-close" @click.stop="removeImage(index)" title="Remove image">
              <span class="fa fa-times"></span>
            </button>
          </div>
          <label class="thumbnail-add" title="Upload more images">
            <span class="fa fa-plus"></span>
            <input class="sr-only" type="file" accept="image/*" multiple @change="uploadMore">
          </label>
        </div>

        <div class="active-editor-area">
          <editor ref="editor" :data="activeImage" :key="activeImage.url"></editor>
        </div>
      </div>
      <loader v-else ref="loader" @loaded="handleLoaded"></loader>
    </main>
  </div>
</template>

<script>
  const URL = window.URL || window.webkitURL;

  export default {
    data() {
      return {
        images: [],
        activeIndex: -1,
      };
    },

    computed: {
      activeImage() {
        return this.images[this.activeIndex] || null;
      },
    },

    methods: {
      handleLoaded(newImages) {
        this.images = [...this.images, ...newImages];
        if (this.activeIndex === -1 && this.images.length > 0) {
          this.activeIndex = 0;
        }
      },

      uploadMore({ target }) {
        this.read(target.files).then((newImages) => {
          target.value = '';
          this.handleLoaded(newImages);
        }).catch((e) => {
          target.value = '';
          window.alert(e && e.message ? e.message : e);
        });
      },

      read(files) {
        if (!files || files.length === 0) {
          return Promise.resolve([]);
        }

        const promises = Array.from(files).map((file) => {
          return new Promise((resolve, reject) => {
            if (/^image\/\w+$/.test(file.type)) {
              if (URL) {
                resolve({
                  loaded: true,
                  name: file.name,
                  type: file.type,
                  url: URL.createObjectURL(file),
                  cropped: false,
                  cropping: false,
                  previousUrl: '',
                });
              } else {
                reject(new Error('Your browser is not supported.'));
              }
            } else {
              reject(new Error('Please choose an image file.'));
            }
          });
        });

        return Promise.all(promises);
      },

      selectImage(index) {
        this.activeIndex = index;
      },

      removeImage(index) {
        const img = this.images[index];
        if (img) {
          if (img.url && img.url.startsWith('blob:')) {
            URL.revokeObjectURL(img.url);
          }
          if (img.previousUrl && img.previousUrl.startsWith('blob:')) {
            URL.revokeObjectURL(img.previousUrl);
          }
        }
        
        this.images.splice(index, 1);
        
        if (this.images.length === 0) {
          this.activeIndex = -1;
        } else {
          if (this.activeIndex === index) {
            this.activeIndex = Math.min(index, this.images.length - 1);
          } else if (this.activeIndex > index) {
            this.activeIndex--;
          }
        }
      },

      removeActiveImage() {
        if (this.activeIndex > -1) {
          this.removeImage(this.activeIndex);
        }
      },

      change(action) {
        const { editor } = this.$refs;

        if (!editor) return;

        switch (action) {
          case 'crop':
            editor.crop();
            break;

          case 'clear':
            editor.clear();
            break;

          case 'restore':
            editor.restore();
            break;

          case 'remove':
            this.removeActiveImage();
            break;

          default:
        }
      },
    },
  };
</script>

<style scoped>
  .app {
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    background: linear-gradient(135deg, #111 0%, #222 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    height: 3.5rem;
    overflow: hidden;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    color: #fff;
    font-size: 1.25rem;
    font-weight: 700;
    font-family: 'Outfit', 'Inter', sans-serif;
    letter-spacing: -0.5px;
    background: linear-gradient(45deg, #0074d9, #00d9ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .main {
    background-color: #121212;
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .editor-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }

  .thumbnails-sidebar {
    width: 100px;
    background-color: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(15px);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    gap: 1rem;
    overflow-y: auto;
    z-index: 10;
  }

  .thumbnails-sidebar::-webkit-scrollbar {
    width: 4px;
  }

  .thumbnails-sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }

  .thumbnail-item {
    width: 70px;
    height: 70px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
  }

  .thumbnail-item:hover {
    transform: translateY(-2px) scale(1.03);
    border-color: rgba(0, 116, 217, 0.5);
  }

  .thumbnail-item.active {
    border-color: #0074d9;
    box-shadow: 0 0 15px rgba(0, 116, 217, 0.6);
  }

  .thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumbnail-close {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(255, 65, 54, 0.85);
    border: none;
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .thumbnail-item:hover .thumbnail-close {
    opacity: 1;
  }

  .thumbnail-close:hover {
    background: #ff4136;
    transform: scale(1.1);
  }

  .thumbnail-add {
    width: 70px;
    height: 70px;
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .thumbnail-add:hover {
    border-color: #0074d9;
    color: #0074d9;
    background-color: rgba(0, 116, 217, 0.05);
    transform: translateY(-2px);
  }

  .active-editor-area {
    flex: 1;
    height: 100%;
    position: relative;
  }
</style>

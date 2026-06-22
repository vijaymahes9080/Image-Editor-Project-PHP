<template>
  <div 
    class="loader-container" 
    @dragover.prevent="dragover" 
    @dragenter="dragenter" 
    @dragleave="dragleave" 
    @drop.prevent="drop"
    :class="{ 'is-dragover': isDragOver }"
  >
    <div class="upload-box">
      <div class="icon-container">
        <span class="fa fa-cloud-upload upload-icon"></span>
      </div>
      <h2>Upload your images</h2>
      <p class="subtitle">Drag & drop multiple images here, or click to browse</p>
      <label class="browse-btn">
        Browse Files
        <input class="sr-only" id="file" type="file" accept="image/*" multiple @change="change">
      </label>
      <p class="file-formats">Supports JPEG, PNG, WebP, GIF</p>
    </div>
  </div>
</template>

<script>
  const URL = window.URL || window.webkitURL;

  export default {
    data() {
      return {
        isDragOver: false,
      };
    },

    methods: {
      read(files) {
        return new Promise((resolve, reject) => {
          if (!files || files.length === 0) {
            resolve([]);
            return;
          }

          const promises = Array.from(files).map((file) => {
            return new Promise((res, rej) => {
              if (/^image\/\w+$/.test(file.type)) {
                if (URL) {
                  res({
                    loaded: true,
                    name: file.name,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    cropped: false,
                    cropping: false,
                    previousUrl: '',
                  });
                } else {
                  rej(new Error('Your browser is not supported.'));
                }
              } else {
                rej(new Error('Please choose an image file.'));
              }
            });
          });

          Promise.all(promises).then(resolve).catch(reject);
        });
      },

      change({ target }) {
        this.read(target.files).then((images) => {
          target.value = '';
          this.$emit('loaded', images);
        }).catch((e) => {
          target.value = '';
          this.alert(e);
        });
      },

      dragover(e) {
        e.preventDefault();
      },

      dragenter(e) {
        e.preventDefault();
        this.isDragOver = true;
      },

      dragleave(e) {
        e.preventDefault();
        this.isDragOver = false;
      },

      drop(e) {
        e.preventDefault();
        this.isDragOver = false;
        this.read(e.dataTransfer.files).then((images) => {
          this.$emit('loaded', images);
        }).catch(this.alert);
      },

      alert(e) {
        window.alert(e && e.message ? e.message : e);
      },
    },
  };
</script>

<style scoped>
  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, #222 0%, #111 100%);
    padding: 2rem;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  .loader-container.is-dragover {
    background: radial-gradient(circle at 50% 50%, #2a2a2a 0%, #151515 100%);
  }
  
  .loader-container.is-dragover .upload-box {
    border-color: #0074d9;
    box-shadow: 0 0 30px rgba(0, 116, 217, 0.2);
    transform: scale(1.02);
  }

  .upload-box {
    max-width: 480px;
    width: 100%;
    border: 2px dashed rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .upload-box:hover {
    border-color: rgba(0, 116, 217, 0.4);
    box-shadow: 0 10px 40px rgba(0, 116, 217, 0.08);
  }

  .icon-container {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #0074d9 0%, #001f3f 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 20px rgba(0, 116, 217, 0.3);
  }

  .upload-icon {
    font-size: 2.5rem;
    color: #fff;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  h2 {
    color: #fff;
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    letter-spacing: -0.5px;
    font-family: 'Outfit', 'Inter', sans-serif;
  }

  .subtitle {
    color: #888;
    font-size: 0.95rem;
    margin: 0 0 2rem 0;
    font-family: 'Inter', sans-serif;
  }

  .browse-btn {
    background: linear-gradient(90deg, #0074d9 0%, #008bf8 100%);
    color: #fff;
    padding: 0.75rem 2.5rem;
    border-radius: 30px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 116, 217, 0.4);
    display: inline-block;
    border: none;
    font-family: 'Inter', sans-serif;
  }

  .browse-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 116, 217, 0.5);
    background: linear-gradient(90deg, #008bf8 0%, #00a2ff 100%);
  }

  .browse-btn:active {
    transform: translateY(0);
  }

  .file-formats {
    color: #555;
    font-size: 0.75rem;
    margin: 1.5rem 0 0 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Inter', sans-serif;
  }
</style>

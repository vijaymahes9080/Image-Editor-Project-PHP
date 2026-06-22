# 🎨 Modern Image Editor Project

> A premium, glassmorphic, and highly interactive multi-image editing application powered by **Vue.js**, **Cropper.js**, and **Webpack**.

[![Vue Version](https://img.shields.io/badge/Vue.js-2.6.x-4fc08d?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Cropper.js](https://img.shields.io/badge/Cropper.js-1.4.x-0074d9?style=flat-square)](https://github.com/fengyuanchen/cropperjs)
[![Webpack](https://img.shields.io/badge/Webpack-4.x-8dd6f9?style=flat-square&logo=webpack)](https://webpack.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ Features

Our Modern Image Editor comes packed with professional-grade capabilities:

* **🖼️ Multi-Image Workspace**: Batch-upload multiple images at once via drag-and-drop or browsing. View live-updating thumbnails in a sleek left sidebar gallery.
* **🫧 Glassmorphic Floating Toolbar**: A beautiful, floating pill-shaped toolbar featuring smooth hover animations for precise image manipulation.
* **⚡ Drag & Drop Zone**: A dark-themed radial gradient landing zone with float animations that guides you through uploading files.
* **🔄 Non-Destructive Workflow**: Toggle crop states, undo edits instantly with cached memory state, and switch between images seamlessly.
* **⌨️ Keyboard Support**: Fully optimized hotkeys for quick, desktop-class actions.

---

## ⌨️ Desktop Hotkeys

Boost your editing efficiency with built-in hotkey shortcuts:

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| `M` | **Move Mode** | Enable dragging & panning the image canvas |
| `C` | **Crop Mode** | Enable drawing a crop box over the active image |
| `Enter` | **Apply Crop** | Crop the image to the selected bounds |
| `Esc` | **Cancel Crop** | Exit active cropping mode |
| `Ctrl + Z` | **Undo Crop** | Restore the image to its original state |
| `Delete` | **Remove Image** | Remove the active image from the workspace |
| `I` / `O` | **Zoom In / Out** | Scale the canvas size |
| `L` / `R` | **Rotate** | Rotate the active image 90° Left or Right |
| `H` / `V` | **Flip** | Mirror the image Horizontally or Vertically |
| `←` `→` `↑` `↓` | **Nudge** | Move the active canvas by 1 pixel increments |

---

## 🚀 Getting Started

Follow these steps to run the image editor on your machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Run the local development server:
   ```bash
   npm run dev
   ```

3. Build production assets:
   - *For modern Node.js versions (v17+), configure the OpenSSL legacy provider:*
     ```bash
     $env:NODE_OPTIONS="--openssl-legacy-provider" # Windows PowerShell
     npm run build
     ```
   - *Standard build command:*
     ```bash
     npm run build
     ```

---

> [!TIP]
> Double-clicking inside the active crop box applies the crop selection automatically, similar to hitting `Enter`!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

© 2026 **[Vijay Mahes](https://github.com/vijaymahes9080)**

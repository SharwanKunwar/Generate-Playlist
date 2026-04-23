# 🌬️ Tailwind CSS Setup Guide (React + Vite)

This guide explains how to install and configure Tailwind CSS in a React project using Vite.

---

## 📦 Prerequisites

Make sure you have:
- Node.js installed (LTS recommended)
- npm installed
- A React + Vite project already created

Check versions:
```bash
node -v
npm -v
```
<br><br>

# 🚀 Step 1: Install Tailwind CSS
Install Tailwind CSS with PostCSS and Autoprefixer:

```Bash
npm install -D tailwindcss@3.4.17 postcss autoprefixer
```

<br><br>

# ⚙️ Step 2: Initialize Tailwind Config
Run the following command:

```bash
npx tailwindcss init -p
```
**This will create:**

* tailwind.config.js
* postcss.config.js

<br><br>

# 🧠 Step 3: Configure Tailwind
Open tailwind.config.js and update it:

```javaScript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
<br><br>

# 🎨 Step 4: Add Tailwind to CSS
Open src/index.css and add:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

<br><br>

# 🔌 Step 5: Import CSS in React
Make sure this is in src/main.jsx:
```js
import './index.css'
```

<br><br>

# ▶️ Step 6: Run the Project
Start your development server:
```bash
npm run dev
```

# 🧪 Step 7: Test Tailwind
In App.jsx, test with:

```js
export default function App() {
  return (
    <h1 className="text-3xl font-bold text-blue-500">
      Tailwind is Working 🚀
    </h1>
  )
}
```
<br><br>

# ✅ Done

    If you see styled text in the browser, Tailwind is successfully installed.
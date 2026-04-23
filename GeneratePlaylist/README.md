# 🎬 ShortConcept

A modern React-based web application that transforms long videos into structured, easy-to-navigate playlists by splitting them into fixed time segments like 10 minutes, 30 minutes, or 1 hour.

---

## 🚀 Overview

ShortConcept solves a common problem:

> “I have long educational videos (5–10+ hours) and I want to study them in structured chunks.”

Instead of manually finding timestamps, this app automatically generates a playlist based on user-defined intervals.

### Example:

- Video length: **10 hours**
- User selects: **1 hour split**
- Output: **10 playlist items**

---

## ✨ Features

- 📺 YouTube video integration  
- ⏱️ Automatic video segmentation (10 min / 30 min / 1 hour)  
- 📚 Dynamic playlist generation  
- 🎯 Click-to-seek video navigation  
- ⚡ Instant processing (no backend required)  
- 🎨 Modern UI using Tailwind CSS + Ant Design  
- 🧠 Clean modular React architecture  

---

## 🛠️ Tech Stack

- React (Vite)  
- Tailwind CSS  
- Ant Design (UI components)  
- react-youtube (YouTube player API)  
- JavaScript (ES6+)  

---

## 📁 Project Structure

```bash id="structure1"
shortconcept/
│
├── src/
│   ├── components/
│   │   ├── VideoPlayer.jsx
│   │   ├── Playlist.jsx
│   │
│   ├── pages/
│   │   └── Home.jsx
│   │
│   ├── utils/
│   │   ├── splitVideo.js
│   │   ├── youtube.js
│   │   ├── time.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── README.
```

## ⚙️ How It Works

### 1. User Input
User pastes a YouTube URL.

---

### 2. Video Loading
The app extracts the video ID and loads it in an embedded player.

---

### 3. Duration Detection
The app fetches total video duration using YouTube API.

---

### 4. Splitting Logic

The video is split into equal intervals:

```text id="split1"
10 hours video → 1 hour split
Result → 10 segments
```

### 5. Playlist Generation

Each segment becomes a clickable item:
```
Part 1 → 00:00 - 01:00  
Part 2 → 01:00 - 02:00  
Part 3 → 02:00 - 03:00  
```

### 6. Video Navigation

Clicking a playlist item:

* Seeks video to that timestamp
* Starts playback 

<br><br>

# 🧠 Core Logic

**Video Splitting**

```js
export const splitVideo = (duration, interval) => {
  const segments = [];
  let start = 0;

  while (start < duration) {
    segments.push({
      start,
      end: Math.min(start + interval, duration),
    });
    start += interval;
  }

  return segments;
};
```

## 🎯 Key Use Cases
* 📚 Students learning from long lectures
* 🎓 Udemy / YouTube course breakdown
* 🧑‍💻 Developers watching long tutorials
* 🧠 Better content consumption 


## 💡 Future Improvements
* 🔥 AI-based topic detection (auto chapters)
* 💾 Save playlists in local storage
* 👀 Highlight currently playing segment
* 📊 Progress tracking system
* 🌙 Dark mode UI
* ☁️ Backend + cloud sync


## 📦 Installation

```bash
git clone https://github.com/your-username/shortconcept.git
cd shortconcept
npm install
npm run dev
```

<br><br>

### 👨‍💻 Author

## Built with ❤️ by Mahakal

Backend & full-stack enthusiast exploring React, Spring Boot, and scalable systems.



####  ⭐ Support
## If you like this project:

* ⭐ Star the repository
* 🍴 Fork it
* 🚀 Improve it with your own features

# 🎧 AdvanceSpotify - Full Stack Spotify Clone

A real-time, full-stack Spotify clone with chat, social activity, playback, admin dashboard, and music management features — built with **React**, **Tailwind CSS**, **ShadCN UI**, **MongoDB**, **Express**, and **Socket.io**.

---

## 🚀 Live Demo

> Coming Soon...

---

## ✨ Features

### 🔄 Real-time Features & Socket.io

- Live user status, song activity, and chat using **Socket.io**
- Real-time broadcast of:
  - User connect/disconnect events
  - Chat messages
  - Music playback actions (`play`, `pause`, `next`, etc.)
- Real-time activity feed on the homepage via WebSockets

---

### 🔐 Authentication & User Management

- Auth handled with **Clerk**: supports Google sign-in and user profile management
- `AuthProvider` sets Clerk JWT in Axios headers for secure backend communication
- Protected routes restrict access to authenticated users only

---

### 🧠 State Management

- Powered by **Zustand**
  - Stores for music data, user auth, player state, and chat
- Custom hooks for reusable state management logic

---

### 🎧 Music Playback

- Centralized music player with:
  - Play, pause, next, previous
  - Reusable PlayButton component
- Volume slider synced to player store & HTML audio element

---

### 💬 Chat System

- Real-time 1-on-1 chat system with online indicators
- Chat layout includes:
  - Header (user info, online status)
  - Messages container
  - Input field with typing indicator

---

### 🖼️ Frontend Development

- Built with **React**, **Tailwind CSS**, and **ShadCN UI**
- Responsive 3-column layout (left sidebar, main content, right sidebar)
- Route-based navigation with **React Router** and a 404 fallback page

---

### 🛠️ Backend & Database

- Node.js + Express backend with modular routes:
  - `/api/users`, `/auth`, `/songs`, `/album`, `/admin`, `/stats`
- MongoDB + Mongoose:
  - Models: `User`, `Song`, `Album`, `Message`
- Optimized stats API using `Promise.all` and aggregations

---

### 🧑‍💼 Admin Functionality

- Admin dashboard to:
  - Create new songs & albums
  - Upload media files
  - View analytics (total users, songs, albums, artists)
- Form validation & file upload UI
- Protected routes + Clerk-based role verification

---

### 📦 API & Data Fetching

- Zustand async fetch functions for albums, songs, users, messages
- Global loading/error state handling
- Skeleton UI components for loading states (ShadCN)

---

### 🧱 UI Components

- Custom UI built with:
  - ShadCN: Buttons, Dialogs, Alerts, Calendars
  - Tailwind: Layout, spacing, animations
- Featured sections: Trending, Made For You, Recent
- UserList with avatars and real-time status

---

### 🗑️ Production & Maintenance

- **Node Cron Jobs** to clean up temporary files
- Static file serving of frontend from Express in production
- Handles CORS & same-origin communication
- Supports environment-based API and WebSocket URLs

---

## 📁 Folder Structure
```
AdvanceSpotify/


├──backend/
├── config
│   ├── database.js
│   ├── server.js
│   └── env.js
├── models
│   ├── User.js
│   ├── Song.js
│   └── Album.js
├── controllers
│   ├── userController.js
│   ├── songController.js
│   └── albumController.js
├── routes
│   ├── userRoutes.js
│   ├── songRoutes.js
│   └── albumRoutes.js
├── services
│   ├── userService.js
│   ├── songService.js
│   └── albumService.js
├── utils
│   ├── auth.js
│   ├── errors.js
│   └── ...
├── index.js
└── package.json


|──frontend/
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── Layout.js
│   ├── containers
│   │   ├── App.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   └── Register.js
│   ├── services
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── store.js
│   ├── styles
│   │   ├── global.css
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── README.md
```


---

## ⚙️ Tech Stack

- **Frontend**: React, Tailwind, Zustand, Clerk, Vite, ShadCN UI
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Real-time**: Socket.io
- **Auth**: Clerk
- **Database**: MongoDB Atlas
- **Deployment**: Vercel + Render (suggested)
- **State**: Zustand

---

## ⚙️ Setup and Installation

Follow the steps below to get this project running locally on your machine.

---

### 🧱 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```
### 📦 2. Install Frontend Dependencies
```bash
cd frontend
npm install
# or
yarn install
```

### 📦 3. Install Backend Dependencies
```bash
cd ../backend
npm install
 or
yarn install
```


### 🔐 4. Configure Environment Variables

Create a .env file in the backend/ directory with the following contents:
```bash
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=5000
# Add other necessary environment variables here
```
    🔒 Make sure not to commit .env to version control.




### ▶️ 5. Run the Backend Server
```bash
cd backend
npm start
# or
yarn start
```
### 💻 6. Run the Frontend Development Server
```bash
cd frontend
npm start
# or
yarn start
```
### 🌐 7. Access the App

Open your browser and go to:
```bash
http://localhost:3000

The frontend should be running on port 3000, and will communicate with the backend running on port 5000 (or as defined in your .env).
```
### 🧪 Future Features

    ✅ Voice messages

    ✅ Song reactions

    ✅ Realtime search

    ✅ Chat read receipts

    ⏳ Playlists & libraries

    ⏳ Notifications

    ⏳ Theme toggle (dark/light)
 
### 👨‍💻 Author

Rupak Saini
### 🛡️ License

This project is licensed under the MIT License.

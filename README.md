# 🎧 Syncify - Full Stack Spotify Clone

A real-time, full-stack Spotify clone with chat, social activity, playback, admin dashboard, and music management features — built with **React**, **Tailwind CSS**, **ShadCN UI**, **MongoDB**, **Express**, and **Socket.io**.

---

## 🚀 Live Demo

> https://advancespotify.onrender.com/

---

## 📸 Screenshots

<p align="center">
A showcase of Syncify's user interface, from the main dashboard to the admin panels.
</p>

<table align="center" border="0" cellpadding="10" cellspacing="0">
<!-- Row 1: Home Page (Full Width) -->
<tr>
<td align="center" colspan="2">
<h3>🏠 Home Page</h3>
<img src="https://github.com/user-attachments/assets/8fb2fedb-35b4-4eeb-96e2-3eea47d88adc" alt="Home Page" width="90%"/>
</td>
</tr>

<!-- Row 2: Search and Album Pages -->

<tr>
<td align="center">
<h3>🔍 Search Page</h3>
<img src="https://github.com/user-attachments/assets/95dcfca7-26b9-4cb0-83ba-0a35435f4493" alt="Search Page" width="450"/>
</td>
<td align="center">
<h3>💿 Album Page</h3>
<img src="https://github.com/user-attachments/assets/bffa07d7-0fc5-4113-ae68-52eb51e942c2" alt="Album Page" width="450"/>
</td>
</tr>

<!-- Row 3: Chat Page (Full Width) -->

<tr>
<td align="center" colspan="2">
<h3>💬 Chat System</h3>
<img src="https://github.com/user-attachments/assets/dd1615b3-0770-4d9f-a85f-fbdd334fb01d" alt="Chat Page" width="90%"/>
</td>
</tr>

<!-- Row 4: Admin Dashboard Header -->

<tr>
<td align="center" colspan="2">
<h3>⚙️ Admin Dashboard</h3>
</td>
</tr>

<!-- Row 5: Admin Management Pages -->

<tr>
<td align="center">
<h4>Song Management</h4>
<img src="https://github.com/user-attachments/assets/27ae17f4-0c70-43cd-9637-236289e43ca5" alt="Admin Songs Dashboard" width="450"/>
</td>
<td align="center">
<h4>Album Management</h4>
<img src="https://github.com/user-attachments/assets/3b626da4-b449-49ee-afe3-370718357020" alt="Admin Albums Dashboard" width="450"/>
</td>
</tr>

<!-- Row 6: Content Creation -->

<tr>
<td align="center">
  <h4>Add New Song</h4>
  <img src="https://github.com/user-attachments/assets/7e9ae22c-d3c3-4c56-94ac-07b271298ff2" alt="Add New Song Modal" width="450"/>
</td>
<td align="center">
  <h4>Add New Album</h4>
  <img src="https://github.com/user-attachments/assets/ef783d79-f619-4148-b347-ac29b040a3cc" alt="Add New Album Modal" width="450"/>
</td>

</tr>
</table>

---

## ⚙️ Tech Stack

- **Frontend**: React, Tailwind, Zustand, Clerk, Vite, ShadCN UI
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Real-time**: Socket.io
- **Auth**: Clerk
- **Database**: MongoDB Atlas
- **Deployment**: Render (recommended), Vercel (optional for frontend)
- **State**: Zustand

---

## ✨ Features

### 🔄 Real-time Features & Socket.io

- Live user status, song activity, and chat using **Socket.io**
- Real-time broadcast of:
  - User connect/disconnect events
  - Chat messages
  - Music playback actions (play, pause, next, etc.)
  - **Listen Along**: Sync music playback in real-time with friends
- Real-time activity feed on the homepage via WebSockets

### ✨ Features

- **Full Screen Player Mode**: Enjoy a distraction-free, immersive music experience with a dedicated full screen player for both mobile and desktop.
- **Liquid Glass (Glassmorphism) UI**: Modern glass-like transparency and blur effects applied to the player bar, sidebars, topbar, and all song cards for a sleek, premium look.

---

### 🔐 Authentication & User Management

- Auth handled with **Clerk**: supports Google sign-in and user profile management
- Clerk JWT is set in Axios headers for secure backend communication
- Protected routes restrict access to authenticated users only
- Admin features are protected and only visible to admin users

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
  - **Listen Along**: Join a friend's session and sync playback
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
- Responsive layout for mobile, tablet, and desktop
- Collapsible sidebar and mobile-friendly controls
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
- Modern glassmorphism (liquid glass) effect: Consistent semi-transparent, blurred backgrounds on player bar, sidebars, topbar, and song cards for a visually stunning interface.

---

### 🗑️ Production & Maintenance

- **Node Cron Jobs** to clean up temporary files
- Handles CORS & same-origin communication
- Supports environment-based API and WebSocket URLs
- Render deployment with Node 20.x enforced via `.nvmrc`

---

## 📁 Folder Structure

```
AdvanceSpotify/

├── backend/
│   ├── package.json
│   ├── .nvmrc
│   ├── .npmrc
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── ...
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Song.ts
│   │   │   └── Album.ts
│   │   ├── controllers/
│   │   │   ├── userController.ts
│   │   │   ├── songController.ts
│   │   │   └── albumController.ts
│   │   ├── routes/
│   │   │   ├── user.route.ts
│   │   │   ├── song.route.ts
│   │   │   ├── album.route.ts
│   │   │   └── admin.route.ts
│   │   ├── services/
│   │   │   ├── userService.ts
│   │   │   ├── songService.ts
│   │   │   └── albumService.ts
│   │   ├── utils/
│   │   │   ├── auth.ts
│   │   │   ├── errors.ts
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── socket.js
│   │   └── index.ts
│   └── ...
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── ...
└── README.md
```

---

## ⚙️ Setup and Installation

Follow the steps below to get this project running locally on your machine.

---

### 🧱 1. Clone the Repository

```bash
git clone https://github.com/rupak1005/AdvanceSpotify.git
cd AdvanceSpotify/
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
# or
yarn install
```

### 🔐 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory with the following contents:

```env
PORT=
MONGODB_URI=
ADMIN_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Create a `.env` file in the `frontend/` directory with the following contents:

```env
VITE_CLERK_PUBLISHABLE_KEY=
```

🔒 **Make sure not to commit .env to version control.**

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
npm run dev
# or
yarn dev
```

### 🌐 7. Access the App

Open your browser and go to:

```
http://localhost:3000
```

The frontend should be running on port 3000, and will communicate with the backend running on port 5000 (or as defined in your .env).

---

## 🧪 Future Features

- ⏳ Voice messages
- ⏳ Song reactions
- ⏳ Realtime search
- ⏳ Chat read receipts
- ⏳ Playlists & libraries
- ⏳ Notifications
- ⏳ Theme toggle (dark/light)

---

## 👨‍💻 Author

Rupak Saini

---

## 🛡️ License

This project is licensed under the MIT License.

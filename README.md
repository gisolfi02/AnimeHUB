# 📌 AnimeHUB
<p align="center">
  <img src="https://github.com/user-attachments/assets/cf3415eb-69d1-4261-8d40-1df9854124cd" style="width:300px">
</p>

**AnimeHUB** is a full-stack web application for managing and visualizing a database of anime and reviews. The app allows users to add, edit, view, and delete anime and reviews, as well as access aggregated statistics through join operations between collections. The project was developed using **React + Node.js/Express + MongoDB**.

---

## 👥 Authors
- [Andrea Gisolfi](mailto:a.gisolfi4@studenti.unisa.it)
- [Silvana Cafaro](mailto:s.cafaro7@studenti.unisa.it)

---

## 🛠 Technologies Used
- **Frontend:** React 19, Vite, Axios, React Router, FontAwesome
- **Backend:** Node.js, Express 5, Mongoose 8, MongoDB
- **Others:** dotenv, cors, concurrently

---

## 📂 Project Structure
```
📁 AnimeHUB/
│
├── 📁 client/               # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 api/          # API call functions
│   │   ├── 📁 assets/       # CSS and images
│   │   └── 📁 components/   # React components
│   ├── index.html
│   └── vite.config.js
│
├── 📁 server/               # Node.js Backend
│   ├── 📁 controllers/      # Controllers for Anime and Review
│   ├── 📁 models/           # Mongoose schemas
│   ├── 📁 routes/           # REST API routes
│   ├── server.js         # Server entry point
│   └── .env              # Environment variables
│
└── package.json          # Global scripts
```

---

## 🔹 Main Features

### 📺 Anime
- Add anime with validation.
- Paginated list with search, filters (genre, studio, producer, rating), sorting, inline editing/deletion.
- Filters are dynamically extracted from the database.

### ✍️ Reviews
- Create reviews linked to anime.
- Search by `anime_id`, edit and delete inline.
- Join with anime details and watching status.


---

## 💻 System Requirements
- **Node.js** `v18+`
- **MongoDB** (local or Atlas)
- **npm**

---

## 🚀 Project Setup

### 1️⃣ Clone the Repository
```bash
git clone <repo-url>
```

### 2️⃣ Configure the Backend
```bash
cd server
touch .env
```
Insert in the `.env` file:
```
MONGO_URI=mongodb+srv://<your-user>:<your-password>@<cluster-url>
```

### 3️⃣ Install Dependencies
```bash
npm install         # in root (installs for both client/server)
cd client && npm install
cd ../server && npm install
```

### 4️⃣ Start in Development Mode
```bash
npm run dev
```
- Starts `Express` on **localhost:5000**
- Starts `React` on **localhost:5173**

---

## 🔗 REST API

The APIs are defined in:

- `server/routes/animeRoutes.js`
- `server/routes/reviewRoutes.js`

Examples:
- `GET /api/anime` — List of anime with filters
- `POST /api/anime` — Create a new anime
- `GET /api/review` — List of reviews
- `POST /api/review` — Create a new review
- `GET /api/review/full` — Join reviews + anime

---

## 📜 License

> This project was created for educational purposes at the University of Salerno.  
> All contents are original or demonstrative for teaching purposes.

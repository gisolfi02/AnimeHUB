# 📌 AnimeHUB
<p align="center">
  <img src="https://github.com/user-attachments/assets/cf3415eb-69d1-4261-8d40-1df9854124cd" style="width:300px">
</p>

**AnimeHUB** è una web application full-stack per la gestione e visualizzazione di un database di anime e recensioni. L'app consente agli utenti di aggiungere, modificare, visualizzare ed eliminare anime e recensioni, oltre ad accedere a statistiche aggregate tramite operazioni di join tra collezioni. Il progetto è stato realizzato in **React + Node.js/Express + MongoDB**.

---

## 👥 Autori
- [Andrea Gisolfi](mailto:a.gisolfi4@studenti.unisa.it)
- [Silvana Cafaro](mailto:s.cafaro7@studenti.unisa.it)

---

## 🛠 Tecnologie Utilizzate
- **Frontend:** React 19, Vite, Axios, React Router, FontAwesome
- **Backend:** Node.js, Express 5, Mongoose 8, MongoDB
- **Altro:** dotenv, cors, concurrently

---

## 📂 Struttura del Progetto
```
📂AnimeHUB/
│
├── 📂client/               # Frontend React
│   ├── 📂src/
│   │   ├── 📂api/          # Funzioni per chiamate API
│   │   ├── 📂assets/       # CSS e immagini
│   │   ├── 📂components/   # Componenti React
│   │   └── App.jsx  
│   ├── index.html
│   └── vite.config.js
│
├── 📂server/               # Backend Node.js
│   ├── 📂controllers/      # Controller per Anime e Review
│   ├── 📂models/           # Schemi Mongoose
│   ├── 📂routes/           # Rotte API REST
│   ├── server.js         # Entry point del server
│   └── .env              # Variabili ambiente
│
└── package.json          # Script globali

```

---

## 🔹 Funzionalità Principali

### 📺 Anime
- Inserimento anime con validazione.
- Lista con ricerca, filtri (genere, studio, produttore, rating), ordinamento, modifica/eliminazione inline.
- Estrazione dinamica dei filtri dal database.

### ✍️ Recensioni
- Creazione recensioni legate ad anime.
- Ricerca per `anime_id`, modifica e cancellazione inline.
- Join con informazioni anime e stato di visione.

### 🎨 UI/UX
- Navbar e Footer integrati.
- Design responsivo e moderno.
- Messaggi di successo/errore per ogni operazione.

---

## 💻 Requisiti di Sistema
- **Node.js** `v18+`
- **MongoDB** (locale o Atlas)
- **npm**

---

## 🚀 Setup del Progetto

### 1️⃣ Clona il Repository
```bash
git clone <repo-url>
```

### 2️⃣ Configura il Backend
```bash
cd server
touch .env
```
Inserisci nel file `.env`:
```
MONGO_URI=mongodb+srv://<tuo-utente>:<tua-password>@<cluster-url>
```

### 3️⃣ Installa le Dipendenze
```bash
npm install         # nella root (installa anche client/server)
cd client && npm install
cd ../server && npm install
```

### 4️⃣ Avvia in Modalità Sviluppo
```bash
npm run dev
```
- Avvia `Express` su **localhost:5000**
- Avvia `React` su **localhost:5173**

---

## 🔗 API REST

Le API sono definite nei file:

- `server/routes/animeRoutes.js`
- `server/routes/reviewRoutes.js`

Esempi:
- `GET /api/anime` — Elenco anime con filtri
- `POST /api/anime` — Crea un nuovo anime
- `GET /api/review` — Elenco recensioni
- `POST /api/review` — Aggiunge una recensione
- `GET /api/review/full` — Join recensioni + anime

---

## 📜 Licenza

> Questo progetto è stato realizzato per fini didattici presso l’Università degli Studi di Salerno.  
> Tutti i contenuti sono originali o a scopo dimostrativo per l'insegnamento.

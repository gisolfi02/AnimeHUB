
# AnimeHUB
<p align="center">
  <img src="https://github.com/user-attachments/assets/cf3415eb-69d1-4261-8d40-1df9854124cd" style="width:300px">
</p>

AnimeHUB è una web application full-stack per la gestione di un database di anime e recensioni. Permette agli utenti di aggiungere, visualizzare, modificare ed eliminare anime e recensioni, oltre a consultare informazioni aggregate tramite join tra le tabelle. Il progetto è suddiviso in due parti principali: **client** (frontend React) e **server** (backend Node.js/Express + MongoDB).

---

## Struttura del progetto

```
AnimeHUB/
│
├── client/         # Frontend React (Vite)
│   ├── src/
│   │   ├── api/            # Funzioni per chiamate API REST
│   │   ├── assets/         # CSS e immagini
│   │   └── components/     # Componenti React (liste, form, navbar, footer, ecc.)
│   ├── index.html
│   └── vite.config.js
│
├── server/         # Backend Node.js/Express
│   ├── controllers/        # Logica dei controller per Anime e Review
│   ├── models/             # Schemi Mongoose per Anime e Review
│   ├── routes/             # Definizione delle rotte API REST
│   ├── server.js           # Entry point del server
│   └── .env                # Variabili ambiente (es. MONGO_URI)
│
├── package.json    # Script globali per avvio client/server
└── README.md       # Questo file
```

---

## Funzionalità principali

### Anime
- **Aggiungi Anime:** Inserimento di nuovi anime con validazione dei campi.
- **Visualizza/Modifica/Elimina Anime:** Lista paginata, ricerca per nome, filtri avanzati (genere, produttore, studio, valutazione), ordinamento e modifica/eliminazione inline.
- **Filtri dinamici:** Generi, produttori, studi e rating sono estratti dinamicamente dal database.

### Recensioni
- **Aggiungi Review:** Inserimento di una recensione per un anime da parte di un utente, con controlli su duplicati e validità degli ID.
- **Visualizza/Modifica/Elimina Review:** Lista paginata, ricerca per anime_id, ordinamento, modifica/eliminazione inline.
- **Join Avanzato:** Visualizzazione aggregata di recensioni con dettagli anime e stato di visione tramite join MongoDB.

### UI/UX
- **Navbar e Footer:** Navigazione semplice, branding e contatti.
- **Responsive Design:** Layout adattivo e moderno, con uso di FontAwesome per le icone.
- **Feedback utente:** Messaggi di errore e successo per tutte le operazioni.

---

## Stack Tecnologico

- **Frontend:** React 19, Vite, Axios, React Router, FontAwesome
- **Backend:** Node.js, Express 5, Mongoose 8, MongoDB
- **Altro:** dotenv, cors, concurrently (per sviluppo)

---

## Avvio del progetto

### Prerequisiti

- Node.js (v18+)
- MongoDB (istanza locale o Atlas)
- npm

### Setup

1. **Clona il repository**
2. **Configura il backend**
   - Vai in `server/`
   - Crea un file `.env` con la variabile `MONGO_URI` per la tua connessione MongoDB
3. **Installa le dipendenze**
   - `npm install` nella root (installa anche le dipendenze di client/server)
   - `cd client && npm install`
   - `cd ../server && npm install`
4. **Avvia in modalità sviluppo**
   - Dalla root: `npm run dev`
   - Questo comando avvia sia il server Express (porta 5000) che il client React (porta 5173)
5. **Accedi all'app**
   - Apri [http://localhost:5173](http://localhost:5173) nel browser

---

## API REST

Le API sono documentate tramite le route in [server/routes/animeRoutes.js](server/routes/animeRoutes.js) e [server/routes/reviewRoutes.js](server/routes/reviewRoutes.js).

Esempi:
- `GET /api/anime` — Lista anime con filtri, paginazione e ordinamento
- `POST /api/anime` — Crea nuovo anime
- `GET /api/review` — Lista recensioni
- `POST /api/review` — Crea nuova recensione
- `GET /api/review/full` — Join recensioni + dettagli anime

---

## Autori

- Andrea Gisolfi — [a.gisolfi4@studenti.unisa.it](mailto:a.gisolfi4@studenti.unisa.it)
- Silvana Cafaro — [s.cafaro7@studenti.unisa.it](mailto:s.cafaro7@studenti.unisa.it)

---

## Licenza

Questo progetto è realizzato per scopi didattici presso l'Università degli Studi di Salerno.

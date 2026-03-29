# FitTrack

FitTrack is a modern, responsive personal fitness companion application built with Vue 3, Vite, and Pinia. It helps users track workouts, browse a comprehensive exercise library, and stay updated with fitness news.

## Features

- **Exercise Library:** Integrated with the ExerciseDB RapidAPI to browse and search thousands of exercises by body part, equipment, or target muscle.
- **Workout Logging:** Track your daily activities, sets, reps, and weights with an interactive workout log.
- **Personalised Dashboard:** View your progress and health metrics in a clean, intuitive dashboard interface.
- **News Feed:** Stay updated with curated fitness articles.
- **Community:** Share your gains and interact with other users' posts.

---

## 🚀 How to Run the App Locally

Follow these instructions to set up and run FitTrack on your local machine.

### 1. Prerequisites
You must have **Node.js** (v18 or newer recommended) and **npm** installed on your computer.

### 2. Install Dependencies
Open your terminal, navigate to the project directory (`FitTrack_Project`), and run:

```bash
npm install
```

### 3. Setup Environment Variables
This project requires access to the **ExerciseDB API** from RapidAPI.

1. Create a new file in the root of the project named `.env`.
2. Add the following lines to the `.env` file, replacing `your_rapidapi_key_here` with your actual key:

```env
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_RAPIDAPI_HOST=exercisedb.p.rapidapi.com
```

*(Note: If you do not provide an API key, the app will gracefully fall back to a smaller set of offline demonstration data).*

### 4. Start the Development Server
Once dependencies are installed and the environment is configured, start the app:

```bash
npm run dev
```

### 5. Open in Browser
The terminal will provide a local URL (usually `http://localhost:5173/`).
`CTRL + Click` the link in your terminal to open the application in your browser.

---

## 🛠️ Built With

- **Vue 3** (Composition API `<script setup>`)
- **Vite** (Next Generation Frontend Tooling)
- **Pinia** (State Management)
- **Bootstrap 5** (CSS Framework & Layout)
- **bcryptjs** (Password hashing simulation)

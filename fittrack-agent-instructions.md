# FitTrack — Full Project Instructions (AI Agent)

> **Course**: COS30043 Interface Design and Development
> **Stack**: Vue 3 + Vite + Vue Router + Bootstrap 5 + Pinia
> **External API**: ExerciseDB via RapidAPI
> **Stages**: Stage 1 → Stage 2 → Stage 3 (Pinia)

---

## How to Use This Document

Read every section in order before writing any code. Each stage builds on the previous one. Do not skip ahead. Use **Vue 3 Composition API** with `<script setup>` syntax throughout. Use **Bootstrap 5** classes for all layout and UI — do not write custom CSS unless specified.

---

## Final Folder Structure

This is the complete structure you are building toward. Match it exactly.

```
FitTrack_Project/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── exerciseApi.js          ← ExerciseDB RapidAPI calls
│   ├── assets/
│   │   └── images/
│   │       ├── hero.jpg
│   │       ├── mountain.jpg
│   │       └── ocean.jpg
│   ├── components/
│   │   ├── NavBar.vue
│   │   ├── WorkoutCard.vue
│   │   ├── ExerciseCard.vue
│   │   └── PostCard.vue
│   ├── pages/
│   │   ├── Home.vue
│   │   ├── News.vue
│   │   ├── About.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Dashboard.vue
│   │   ├── Exercises.vue
│   │   ├── WorkoutLog.vue
│   │   └── Community.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/                     ← create this folder in Stage 2
│   │   ├── authStore.js
│   │   └── workoutStore.js
│   ├── data/                       ← create this folder in Stage 1
│   │   ├── news.json
│   │   └── exercises.json          ← fallback data if API fails
│   ├── directives/                 ← create this folder in Stage 2
│   │   └── index.js
│   ├── composables/                ← create this folder in Stage 1
│   │   └── usePagination.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env                            ← create this, add RapidAPI key
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Environment Setup

### Install dependencies

```bash
npm install vue-router@4 pinia bootstrap@5
```

### `.env` file (project root)

Create this file. Never commit it to git.

```
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_RAPIDAPI_HOST=exercisedb.p.rapidapi.com
```

Add `.env` to `.gitignore`.

---

## Design System

Use these Bootstrap conventions consistently across all pages.

| Element | Bootstrap Class |
|---|---|
| Primary action button | `btn btn-success` |
| Secondary action button | `btn btn-outline-secondary` |
| Danger action (delete) | `btn btn-outline-danger btn-sm` |
| Edit action | `btn btn-outline-primary btn-sm` |
| Page wrapper | `container py-5` |
| Card | `card shadow-sm` |
| Card with form | `card shadow-sm p-4` |
| Section heading | `fw-bold mb-4` |
| Muted helper text | `text-muted small` |
| Responsive grid | `row g-4` with `col-12 col-sm-6 col-lg-4` |
| Badge — category | `badge bg-success` |
| Badge — type | `badge bg-secondary` |
| Badge — neutral | `badge bg-light text-dark border` |
| Invalid field | add `is-invalid` class to input |
| Error message | `invalid-feedback` div below input |
| Alert success | `alert alert-success` |
| Alert danger | `alert alert-danger` |
| Alert info | `alert alert-light border` |

**Colour palette** — use only these Bootstrap contextual colours:

- Green (`success`) — primary brand colour, main CTAs, workout stats
- Dark (`dark`) — navbar background
- Secondary — badges, secondary labels
- Light (`light`) — subtle backgrounds, neutral cards
- Danger (`danger`) — delete actions only

**Navbar**: always `navbar-dark bg-dark`. Active route link gets `active` class via `RouterLink`.

**Responsive breakpoints** — every page must have a distinct layout at:
- Mobile: < 576px — single column, stacked content
- Tablet: 576px–991px — two columns where appropriate
- Desktop: ≥ 992px — multi-column grid

---

## Stage 1 — Project Setup

### Goal

Build the three base pages (Home, News, About), set up routing, and establish the project skeleton. No authentication required yet.

---

### `src/main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

createApp(App).use(router).mount('#app')
```

---

### `src/App.vue`

```vue
<template>
  <NavBar />
  <RouterView />
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>
```

---

### `src/router/index.js` — Stage 1

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import About from '../pages/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/news', component: News },
  { path: '/about', component: About }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
```

> Use `createWebHashHistory()` so the app works on Mercury without server rewrite rules.

---

### `src/components/NavBar.vue` — Stage 1

```vue
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">
        💪 FitTrack
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/news">News</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">About</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
```

---

### `src/pages/Home.vue`

Requirements: title, welcome paragraph, two images, responsive layout.

**Design layout:**

```
[ Dark hero banner — full width ]
  Big headline: "Track Your Gains"
  Subheading paragraph
  Two CTA buttons: Get Started | Browse Exercises

[ Two-column section ]
  Left: hero.jpg image
  Right: "Why FitTrack?" bullet list

[ Card grid section — light background ]
  Card 1: mountain.jpg + "Outdoor Training"
  Card 2: ocean.jpg + "Water Sports"
```

**Implementation notes:**
- Hero section: `class="py-5 text-center bg-dark text-white"`
- Two-column: `col-12 col-md-6` — image left, text right
- Card grid: `col-12 col-sm-6 col-lg-4 offset-lg-2` — two cards centred
- Both images use `img-fluid rounded shadow`
- CTA buttons link to `/register` and `/exercises` (routes added in Stage 2 — use `href="#"` for now)

---

### `src/data/news.json`

Create 15+ items with this exact shape. More items = better pagination demo.

```json
[
  {
    "id": 1,
    "date": "2025-01-05",
    "title": "The Science of Progressive Overload",
    "content": "Progressive overload is the gradual increase of stress placed on the body during exercise. Studies confirm it is the single most important factor in building strength and muscle mass over time.",
    "category": "Strength"
  },
  {
    "id": 2,
    "date": "2025-01-12",
    "title": "Why You Should Prioritise Sleep for Recovery",
    "content": "Sleep is when the body repairs muscle tissue and consolidates motor skills. Athletes who sleep less than 7 hours show significantly slower strength gains and higher injury rates.",
    "category": "Recovery"
  },
  {
    "id": 3,
    "date": "2025-01-20",
    "title": "Nutrition Timing: Does It Matter?",
    "content": "Research on nutrient timing suggests consuming protein within two hours of training can improve muscle protein synthesis. Total daily intake remains the most critical factor.",
    "category": "Nutrition"
  },
  {
    "id": 4,
    "date": "2025-02-03",
    "title": "Zone 2 Cardio Explained",
    "content": "Zone 2 training targets 60–70% of maximum heart rate. It builds aerobic base, improves fat oxidation, and is increasingly popular among endurance athletes.",
    "category": "Cardio"
  },
  {
    "id": 5,
    "date": "2025-02-11",
    "title": "The Benefits of Cold Water Immersion",
    "content": "Cold water immersion after intense training can reduce delayed onset muscle soreness. However, it may blunt hypertrophy when used immediately post-strength session.",
    "category": "Recovery"
  },
  {
    "id": 6,
    "date": "2025-02-18",
    "title": "How to Structure a Push Pull Legs Routine",
    "content": "Push Pull Legs splits training into three movement patterns. This allows each muscle group 48–72 hours of recovery while maintaining high weekly training volume.",
    "category": "Strength"
  },
  {
    "id": 7,
    "date": "2025-03-01",
    "title": "Creatine: What the Research Says",
    "content": "Creatine monohydrate remains the most studied sports supplement. It increases phosphocreatine stores, directly improving performance in short high-intensity efforts.",
    "category": "Nutrition"
  },
  {
    "id": 8,
    "date": "2025-03-10",
    "title": "Mobility Work for Lifters",
    "content": "Improving hip and thoracic mobility unlocks deeper squats and safer pressing mechanics. Daily mobility practice of 10–15 minutes significantly reduces injury risk.",
    "category": "Flexibility"
  },
  {
    "id": 9,
    "date": "2025-03-18",
    "title": "The Truth About HIIT Training",
    "content": "High-intensity interval training burns significant calories in short sessions but requires adequate recovery. Combining HIIT with Zone 2 work yields the best cardiovascular improvements.",
    "category": "Cardio"
  },
  {
    "id": 10,
    "date": "2025-03-25",
    "title": "Building Habit Loops for Consistent Training",
    "content": "Attaching workouts to existing routines greatly improves adherence. Consistent cues and rewards are more powerful than motivation alone.",
    "category": "Mindset"
  },
  {
    "id": 11,
    "date": "2025-04-02",
    "title": "Foam Rolling: Useful or Overrated?",
    "content": "Foam rolling increases short-term range of motion and reduces perceived soreness. It is a useful warm-up tool before intense sessions.",
    "category": "Recovery"
  },
  {
    "id": 12,
    "date": "2025-04-09",
    "title": "Protein Requirements for Muscle Growth",
    "content": "Current evidence suggests 1.6–2.2g of protein per kg of bodyweight is optimal for muscle hypertrophy. Spreading intake across four to five meals maximises synthesis.",
    "category": "Nutrition"
  },
  {
    "id": 13,
    "date": "2025-04-15",
    "title": "Training to Failure: Pros and Cons",
    "content": "Training to muscular failure can maximise motor unit recruitment but increases fatigue and recovery time. Most experts recommend leaving 1–3 reps in reserve.",
    "category": "Strength"
  },
  {
    "id": 14,
    "date": "2025-04-22",
    "title": "Running Economy and How to Improve It",
    "content": "Running economy refers to oxygen cost at a given pace. Strength training, plyometrics, and proper running form all contribute to measurable improvements.",
    "category": "Cardio"
  },
  {
    "id": 15,
    "date": "2025-05-01",
    "title": "Mental Health Benefits of Regular Exercise",
    "content": "Exercise consistently reduces symptoms of anxiety and depression. Even 30 minutes of moderate activity three times per week produces significant improvements in mood.",
    "category": "Mindset"
  }
]
```

---

### `src/composables/usePagination.js`

Reusable pagination logic. Used by News.vue and Exercises.vue.

**What it does:** Takes a reactive array ref and items-per-page count. Returns the current page slice, total pages, current page number, and a `goTo(page)` function.

**Implementation notes:**
- Accept `items` as a `computed` or `ref`
- `currentPage` starts at 1
- `paginated` returns `items.value.slice(start, start + perPage)`
- `totalPages` is `Math.ceil(items.value.length / perPage)`
- `goTo(page)` clamps between 1 and totalPages

---

### `src/pages/News.vue`

Requirements: load from `news.json`, search on all four fields, pagination, category filter.

**Design layout:**

```
[ Page heading: "Fitness News & Tips" ]

[ Filter bar — row ]
  Col 1 (md-6): text input — search title, content, category
  Col 2 (md-3): date input — filter by exact date
  Col 3 (md-3): select dropdown — filter by category

[ Result count: "Showing X result(s)" — muted small text ]

[ News list ]
  Each item = card with:
    - Title (left) + category badge (right)
    - Date below title in muted small text
    - Content paragraph

[ Pagination controls — centred ]
  Previous | 1 | 2 | 3 | Next
  Disabled when at first/last page
  Active page highlighted
```

**Implementation notes:**
- Import `news.json` directly: `import newsData from '../data/news.json'`
- Use `usePagination` composable with 5 items per page
- `filtered` is a computed that chains text search + date match + category match
- Call `goTo(1)` whenever any filter changes (use `@input` / `@change`)
- Categories dropdown is derived from unique values in the data
- Use `v-model` on all filter inputs
- Use `v-for` on `paginated` for the list
- Use `v-if` on each card's data — no empty renders

---

### `src/pages/About.vue`

Requirements: app paragraph, first + last name inputs with welcome message, two radio buttons that swap an image.

**Design layout:**

```
[ Heading: "About FitTrack" ]
[ Short paragraph about the app ]

[ Card: "Personalise Your Experience" ]
  First Name input (label + id + aria)
  Last Name input (label + id + aria)
  Welcome message: shown with v-if when either name is filled
  "Welcome, [Full Name]! Ready to crush your goals?"

[ Card: "Choose Your Environment" ]
  Radio: Mountain Training
  Radio: Ocean Training
  Image: shown with v-if — mountain.jpg or ocean.jpg
```

**Implementation notes:**
- `fullName` is a computed from trimmed firstName + lastName
- Show welcome message only when `fullName` is non-empty — use `v-if`
- Image swap uses `v-if="environment === 'mountain'"` and `v-if="environment === 'ocean'"`
- Both cards use `card shadow-sm p-4`
- Wrap both cards in `col-12 col-md-8 col-lg-6 mx-auto`

---

## Stage 2 — Application Logic

### Goal

Extend Stage 1 into a real fitness application. Add authentication, workout CRUD, exercise browser (ExerciseDB API), community feed, and dashboard. Expand the router with navigation guards.

---

### New folders to create

```
src/stores/       ← Pinia stores
src/directives/   ← custom Vue directives
```

---

### Update `src/main.js`

Add Pinia and custom directives:

```
imports: createApp, createPinia, App, router, vFocus, vHighlight, bootstrap css/js, style.css
register: pinia, router, v-focus directive, v-highlight directive
mount: #app
```

**Order matters:** register Pinia before router, because the router's navigation guard reads from a Pinia store.

---

### `src/directives/index.js`

Define two custom directives:

**`vFocus`** — auto-focuses the element when it mounts. Used on the first input of every form (Register, Login, WorkoutLog).

**`vHighlight`** — applies a background colour to the element. Accepts a colour string as the binding value (e.g. `v-highlight="'#e8f5e9'"`). Used on workout exercise name labels in WorkoutLog.vue. Sets `backgroundColor`, `borderRadius: 4px`, `padding: 2px 4px`.

---

### `src/api/exerciseApi.js`

This file centralises all ExerciseDB RapidAPI calls. All fetch logic lives here — pages import functions from this file, not raw fetch calls.

**RapidAPI endpoint base:** `https://exercisedb.p.rapidapi.com`

**Headers required on every request:**
```
X-RapidAPI-Key:  import.meta.env.VITE_RAPIDAPI_KEY
X-RapidAPI-Host: import.meta.env.VITE_RAPIDAPI_HOST
```

**Functions to implement:**

`fetchExercises(limit, offset)`
- Endpoint: `GET /exercises?limit={limit}&offset={offset}`
- Default: limit 100, offset 0
- Returns: array of exercise objects
- On error: return empty array and log to console

`fetchExercisesByBodyPart(bodyPart, limit, offset)`
- Endpoint: `GET /exercises/bodyPart/{bodyPart}?limit={limit}&offset={offset}`
- Returns: filtered array

`fetchBodyPartList()`
- Endpoint: `GET /exercises/bodyPartList`
- Returns: array of body part strings (e.g. `["back", "chest", "waist", ...]`)
- Used to populate the filter dropdown in Exercises.vue

**Each function must:**
- Wrap the fetch in a try/catch
- Return an empty array on failure (do not throw)
- Be an `async` function that returns a Promise

**Fallback:** If the API key is missing (`!import.meta.env.VITE_RAPIDAPI_KEY`), import and return `../data/exercises.json` immediately without making a network request.

---

### `src/data/exercises.json` — fallback data

20+ items with this shape (used when API key is absent or API call fails):

```json
[
  { "id": "0001", "name": "barbell bench press", "target": "pectorals", "bodyPart": "chest", "equipment": "barbell", "gifUrl": "", "secondaryMuscles": ["triceps", "delts"], "instructions": ["Lie flat on bench", "Lower bar to chest", "Press upward"] },
  { "id": "0002", "name": "pull up", "target": "lats", "bodyPart": "back", "equipment": "body weight", "gifUrl": "", "secondaryMuscles": ["biceps"], "instructions": ["Hang from bar", "Pull chest to bar", "Lower with control"] },
  { "id": "0003", "name": "squat", "target": "quads", "bodyPart": "upper legs", "equipment": "barbell", "gifUrl": "", "secondaryMuscles": ["glutes", "hamstrings"], "instructions": ["Stand with bar on traps", "Descend until thighs are parallel", "Drive through heels"] },
  { "id": "0004", "name": "deadlift", "target": "glutes", "bodyPart": "upper legs", "equipment": "barbell", "gifUrl": "", "secondaryMuscles": ["hamstrings", "lats"], "instructions": ["Stand with feet hip-width", "Hinge at hip, grip bar", "Drive hips forward to stand"] },
  { "id": "0005", "name": "overhead press", "target": "delts", "bodyPart": "shoulders", "equipment": "barbell", "gifUrl": "", "secondaryMuscles": ["triceps"], "instructions": ["Hold bar at shoulder height", "Press overhead to lockout", "Lower with control"] },
  { "id": "0006", "name": "dumbbell curl", "target": "biceps", "bodyPart": "upper arms", "equipment": "dumbbell", "gifUrl": "", "secondaryMuscles": ["forearms"], "instructions": ["Hold dumbbells at sides", "Curl to shoulder height", "Lower slowly"] },
  { "id": "0007", "name": "tricep dip", "target": "triceps", "bodyPart": "upper arms", "equipment": "body weight", "gifUrl": "", "secondaryMuscles": ["chest"], "instructions": ["Grip parallel bars", "Lower body by bending elbows", "Push back to start"] },
  { "id": "0008", "name": "plank", "target": "abs", "bodyPart": "waist", "equipment": "body weight", "gifUrl": "", "secondaryMuscles": ["shoulders"], "instructions": ["Forearms on floor", "Keep body straight", "Hold position"] },
  { "id": "0009", "name": "lunges", "target": "quads", "bodyPart": "upper legs", "equipment": "body weight", "gifUrl": "", "secondaryMuscles": ["glutes"], "instructions": ["Step forward", "Lower back knee toward floor", "Return to standing"] },
  { "id": "0010", "name": "lat pulldown", "target": "lats", "bodyPart": "back", "equipment": "cable", "gifUrl": "", "secondaryMuscles": ["biceps"], "instructions": ["Grip bar wide", "Pull to upper chest", "Return slowly"] },
  { "id": "0011", "name": "leg press", "target": "quads", "bodyPart": "upper legs", "equipment": "leverage machine", "gifUrl": "", "secondaryMuscles": ["glutes"], "instructions": ["Sit in machine", "Push plate away", "Return under control"] },
  { "id": "0012", "name": "cable row", "target": "lats", "bodyPart": "back", "equipment": "cable", "gifUrl": "", "secondaryMuscles": ["biceps"], "instructions": ["Sit at cable row", "Pull handle to abdomen", "Extend arms fully"] },
  { "id": "0013", "name": "dumbbell fly", "target": "pectorals", "bodyPart": "chest", "equipment": "dumbbell", "gifUrl": "", "secondaryMuscles": ["delts"], "instructions": ["Lie on bench", "Open arms wide", "Bring dumbbells together"] },
  { "id": "0014", "name": "face pull", "target": "delts", "bodyPart": "shoulders", "equipment": "cable", "gifUrl": "", "secondaryMuscles": ["rotator cuff"], "instructions": ["Set cable at face height", "Pull rope to forehead", "Squeeze rear delts"] },
  { "id": "0015", "name": "hip thrust", "target": "glutes", "bodyPart": "upper legs", "equipment": "barbell", "gifUrl": "", "secondaryMuscles": ["hamstrings"], "instructions": ["Sit against bench", "Drive hips up", "Squeeze at top"] },
  { "id": "0016", "name": "calf raise", "target": "calves", "bodyPart": "lower legs", "equipment": "body weight", "gifUrl": "", "secondaryMuscles": [], "instructions": ["Stand on edge of step", "Rise on toes", "Lower slowly"] },
  { "id": "0017", "name": "russian twist", "target": "abs", "bodyPart": "waist", "equipment": "body weight", "gifUrl": "", "secondaryMuscles": ["obliques"], "instructions": ["Sit with knees bent", "Lean back slightly", "Rotate torso side to side"] },
  { "id": "0018", "name": "incline dumbbell press", "target": "pectorals", "bodyPart": "chest", "equipment": "dumbbell", "gifUrl": "", "secondaryMuscles": ["triceps"], "instructions": ["Set bench to 30–45°", "Press dumbbells from shoulder", "Lower with control"] },
  { "id": "0019", "name": "romanian deadlift", "target": "hamstrings", "bodyPart": "upper legs", "equipment": "barbell", "gifUrl": "", "secondaryMuscles": ["glutes"], "instructions": ["Hold bar at hips", "Hinge forward keeping back flat", "Return to standing"] },
  { "id": "0020", "name": "push up", "target": "pectorals", "bodyPart": "chest", "equipment": "body weight", "gifUrl": "", "secondaryMuscles": ["triceps", "delts"], "instructions": ["Place hands shoulder-width", "Lower chest to floor", "Press back up"] }
]
```

---

### `src/stores/authStore.js`

Use `defineStore` with the **Composition API** syntax (`defineStore('auth', () => { ... })`).

**State:**
- `user` — ref, initialised from `localStorage.getItem('fittrack_user')` (parse JSON, default null)
- `users` — ref, initialised from `localStorage.getItem('fittrack_users')` (parse JSON, default `[]`)

**Getters (computed):**
- `isLoggedIn` — `user.value !== null`
- `isAdmin` — `user.value?.role === 'admin'`

**Actions:**

`register(firstName, lastName, email, password)`
- Check if email already exists in `users` → return `{ success: false, message: '...' }`
- Create user object with `id: Date.now()`, role `'admin'` if first user else `'user'`
- Push to `users`, save to localStorage
- Return `{ success: true }`

`login(email, password)`
- Find matching user in `users`
- If not found → return `{ success: false, message: '...' }`
- Set `user.value`, save to localStorage
- Return `{ success: true }`

`logout()`
- Set `user.value = null`
- Remove `fittrack_user` from localStorage

---

### `src/stores/workoutStore.js`

Use `defineStore` with Composition API syntax.

**State:**
- `workouts` — ref, from localStorage `fittrack_workouts`, default `[]`
- `posts` — ref, from localStorage `fittrack_posts`, default `[]`
- `filter` — ref object `{ type: '', muscle: '', search: '' }`

**Getters (computed):**

`filteredUserWorkouts`
- Requires `useAuthStore()` called inside this getter
- Filter `workouts` where `userId === auth.user.id`
- Then apply `filter.value.search` (match name), `filter.value.type`, `filter.value.muscle`

`statsByType`
- Returns an object like `{ Strength: 5, Cardio: 3 }` for the current user's workouts

`weeklyVolume`
- Sum of `sets × reps` for current user's workouts in the last 7 days

**Actions:**

`addWorkout(workout)` — unshift with `id: Date.now()`, persist

`updateWorkout(id, updated)` — find by id, replace, persist

`deleteWorkout(id)` — filter out, persist

`setFilter(partial)` — `Object.assign(filter.value, partial)`

`resetFilter()` — reset filter to all-empty

`addPost(post)` — unshift with id, empty `likes: []`, persist

`toggleLike(postId, userId)` — toggle userId in `post.likes`, persist

`deletePost(postId)` — filter out, persist

**Persist helpers:** two private functions `persist()` and `persistPosts()` that write to localStorage.

---

### `src/router/index.js` — Stage 2

Add all new routes and a navigation guard:

**Routes to add:**

| Path | Component | Auth required |
|---|---|---|
| `/login` | Login.vue | No |
| `/register` | Register.vue | No |
| `/dashboard` | Dashboard.vue | Yes |
| `/exercises` | Exercises.vue | No |
| `/workouts` | WorkoutLog.vue | Yes |
| `/community` | Community.vue | No |

**Navigation guard** (`router.beforeEach`):
- Import `useAuthStore` inside the guard function (not at top level — avoids Pinia-before-app error)
- If `to.meta.requiresAuth` and `!auth.isLoggedIn` → redirect to `'/login'`

---

### `src/components/NavBar.vue` — Stage 2

Update to show different links based on auth state.

**When logged out:**
```
Home | News | Exercises | Community | About | Login | [Register button]
```

**When logged in:**
```
Home | News | Exercises | Community | About | Dashboard | My Workouts | [Logout button]
```

**Implementation notes:**
- Use `v-if="auth.isLoggedIn"` / `v-else` with `<template>` wrappers
- Logout button calls `auth.logout()` then `router.push('/')`
- Register and Logout use `btn btn-success btn-sm` and `btn btn-outline-light btn-sm`
- Import `useAuthStore` and `useRouter`

---

### `src/pages/Register.vue`

**Design layout:**

```
[ Centred card — col-12 col-md-6 col-lg-5 mx-auto ]
  Heading: "Create Account"
  Error alert (v-if)
  Success alert (v-if)

  Form fields (all with label + id + aria-describedby):
    First Name  ← v-focus directive on this field
    Last Name
    Email
    Password (min 6 characters)
    Confirm Password

  Submit button: "Register" — full width btn-success
  Link: "Already have an account? Login here"
```

**Validation rules (run on submit, before calling store):**
- First name: required
- Last name: required
- Email: must contain `@`
- Password: minimum 6 characters
- Confirm: must match password

**On validation fail:** show `is-invalid` on the relevant input and `invalid-feedback` message below it.

**On success:** show success alert, redirect to `/login` after 1.5 seconds.

---

### `src/pages/Login.vue`

**Design layout:**

```
[ Centred card — col-12 col-md-6 col-lg-5 mx-auto ]
  Heading: "Login"
  Error alert (v-if)

  Email input   ← v-focus directive
  Password input

  Submit button: "Login" — full width btn-success
  Link: "No account? Register here"
```

**On success:** redirect to `/dashboard`.

---

### `src/pages/Dashboard.vue`

**Design layout:**

```
[ Heading: "Welcome back, [firstName]!" ]
[ Subtext: "Here is your fitness overview." ]

[ Stats row — 4 cards, col-12 col-sm-6 col-lg-3 ]
  Card 1: Workouts Logged (green border)
  Card 2: Total Sets (blue border)
  Card 3: Total Reps (yellow border)
  Card 4: Muscle Groups Hit (cyan border)

[ Workouts by Type — card ]
  Badge for each type: "Strength: 5", "Cardio: 3" etc.
  Weekly volume text: "Weekly volume: X total reps"

[ Recent Workouts — heading + list ]
  Last 5 workouts — card per workout
  If none: info alert with link to /workouts

[ Buttons ]
  "Log Workout" → /workouts
  "Browse Exercises" → /exercises
```

**Implementation notes:**
- Use `storeToRefs(workoutStore)` to destructure `statsByType` and `weeklyVolume` reactively
- `userWorkouts` = computed filter of `workoutStore.workouts` by `auth.user.id`
- `recentWorkouts` = first 5 of userWorkouts
- Stats card numbers use Bootstrap display heading classes (`display-6 fw-bold`)

---

### `src/pages/WorkoutLog.vue`

**Design layout:**

```
[ Heading: "My Workout Log" ]

[ Form card: "Log New Workout" / "Edit Workout" ]
  Row 1: Exercise Name (col-md-6) | Date (col-md-3) | Type select (col-md-3)
  Row 2: Sets (col-6 col-md-2) | Reps (col-6 col-md-2) | Weight kg (col-6 col-md-2) | Muscle Group select (col-md-6)
  Row 3: Notes textarea — full width
  Buttons: "Add Workout" / "Update" + "Cancel" (only shown when editing)

[ Filter bar ]
  Text search | Type select | "Clear Filters" button

[ Workout list — TransitionGroup animated ]
  Each workout = card with:
    Left: exercise name (v-highlight directive) + date · type · muscle group
    Right: sets×reps badge + weight badge + Edit button + Delete button
    Notes (v-if notes exist)
```

**Validation rules:**
- Exercise name: required
- Date: required
- Sets: required, minimum 1
- Reps: required, minimum 1

**Implementation notes:**
- Use `storeToRefs(workoutStore)` to get `filteredUserWorkouts` reactively
- Filter inputs call `workoutStore.setFilter({ search: ... })` and `workoutStore.setFilter({ type: ... })`
- "Clear Filters" calls `workoutStore.resetFilter()`
- Edit: populate form with workout data, set `editingId`
- Cancel: clear form and set `editingId = null`
- `v-highlight="'#e8f5e9'"` on the exercise name element
- `v-focus` on the Exercise Name input

**`<TransitionGroup>` animation:**

Wrap the workout list in `<TransitionGroup name="workout-list" tag="div">`.

CSS transitions (add to `<style scoped>`):
```
.workout-list-enter-active, .workout-list-leave-active → transition: all 0.35s ease
.workout-list-enter-from → opacity: 0, transform: translateY(-10px)
.workout-list-leave-to   → opacity: 0, transform: translateX(20px)
```

---

### `src/api/exerciseApi.js` — full usage in Exercises.vue

### `src/pages/Exercises.vue`

**Design layout:**

```
[ Heading: "Exercise Library" ]
[ Subtext: "Powered by ExerciseDB API" ]

[ Filter bar ]
  Text search (col-md-5) | Body part dropdown (col-md-4) — populated from fetchBodyPartList()

[ Loading spinner — shown while fetching ]
  Bootstrap spinner: div.spinner-border.text-success

[ Result count: "Showing X exercises" ]

[ Exercise grid — row g-3 ]
  Each exercise = ExerciseCard component (col-12 col-sm-6 col-lg-4)

[ Pagination ]
  12 items per page
  Previous | page numbers | Next
```

**Implementation notes:**
- Call `fetchBodyPartList()` on `onMounted` to fill the dropdown
- Call `fetchExercises(100, 0)` on `onMounted` to load exercises — store in local `ref`
- When body part filter changes, call `fetchExercisesByBodyPart(bodyPart)` instead
- Show spinner while `loading.value === true`
- Text search filters by `name` and `target` (client-side, no extra API call)
- Use `usePagination` composable with 12 items per page
- Pass each exercise object to `ExerciseCard` as a prop

---

### `src/components/ExerciseCard.vue`

**Props:** `exercise` (Object)

**Design layout:**

```
[ card h-100 shadow-sm ]
  [ GIF image — if gifUrl exists ]
    img: height 140px, object-fit contain, centred
  [ card-body ]
    Name: fw-bold text-capitalize
    Badges: target muscle (bg-success) + equipment (bg-secondary)
    Body part: small text-muted
```

**Implementation notes:**
- Show image only with `v-if="exercise.gifUrl"`
- Use `v-bind:src` and `v-bind:alt`
- Name is `text-capitalize` since API returns lowercase

---

### `src/pages/Community.vue`

**Design layout:**

```
[ Heading: "Community Feed" ]

[ Post form card — shown only when logged in (v-if) ]
  Heading: "Share Your Workout"
  Textarea: "What did you train today?"
  Post button: btn-success

[ Info alert — shown when NOT logged in ]
  "Login to post and like updates."

[ Post list ]
  Each post = PostCard component
```

---

### `src/components/PostCard.vue`

**Props:** `post` (Object)

**Design layout:**

```
[ card shadow-sm ]
  [ card-body ]
    Top row: Author name (bold) + date (muted) | Delete button (v-if canDelete)
    Content paragraph
    Like button: "❤ X Likes"
      → btn-success when current user has liked
      → btn-outline-success when not liked
      → disabled when not logged in
```

**Implementation notes:**
- `canDelete` = `auth.isAdmin || post.authorId === auth.user?.id`
- `hasLiked` = `auth.isLoggedIn && post.likes.includes(auth.user.id)`
- Like button click calls `workoutStore.toggleLike(post.id, auth.user.id)`
- Delete button calls `workoutStore.deletePost(post.id)`
- Import both `useAuthStore` and `useWorkoutStore` inside the component

---

### `src/components/WorkoutCard.vue`

**Props:** `workout` (Object), emit: `edit`, `delete`

Used optionally in Dashboard recent workouts list.

**Design layout:**

```
[ card mb-2 shadow-sm ]
  [ card-body d-flex justify-content-between flex-wrap ]
    Left: workout name (bold) + date (muted small) + type badge
    Right: sets×reps badge + Edit button + Delete button
```

---

## Stage 3 — Advanced Pinia (Video Tutorial Topic)

### Goal

Significantly deepen the Pinia implementation to demonstrate advanced features. The existing Stage 2 stores are already using Composition API syntax — Stage 3 enhances them with `storeToRefs`, complex computed getters, centralised filter state, and cross-store composition.

### What is already in place from Stage 2

- `authStore.js` and `workoutStore.js` use `defineStore` with Composition API
- `workoutStore` has `filteredUserWorkouts`, `statsByType`, `weeklyVolume` getters
- `WorkoutLog.vue` uses `storeToRefs` and `setFilter` / `resetFilter`
- `Dashboard.vue` uses `storeToRefs` for reactive getter destructuring

### What Stage 3 adds or emphasises

These are the specific Pinia features to demonstrate in your video:

**1. `storeToRefs` — why it exists and when to use it**

Explain the problem: if you destructure a Pinia store directly (`const { workouts } = store`), the variable loses reactivity. Show this breaking in the browser. Then show `storeToRefs` fixing it. Used in WorkoutLog.vue and Dashboard.vue.

**2. Cross-store composition**

`workoutStore` calls `useAuthStore()` inside its computed getters (`filteredUserWorkouts`, `statsByType`, `weeklyVolume`). Explain why this is valid in Pinia (stores are plain functions, not singletons locked at setup time) and why you call it inside the getter rather than at the top of the store.

**3. Centralised filter state**

The filter object (`{ type, muscle, search }`) lives inside `workoutStore`, not in the component. Demonstrate that multiple components can read and mutate the same filter without props or emits. `setFilter(partial)` uses `Object.assign` for partial updates. `resetFilter()` resets to defaults.

**4. Persistence pattern**

Show how `persist()` is called after every mutation (not in a watcher), keeping localStorage always in sync. Demonstrate that refreshing the page restores all workouts and posts.

**5. `<TransitionGroup>` integration**

Demonstrate that when Pinia state changes (add or delete a workout), the `<TransitionGroup>` in WorkoutLog.vue animates the list automatically — no extra code in the component because the list is a store getter.

### Video structure suggestion (3–20 minutes)

```
0:00  Intro — what Pinia is, why it replaces Vuex
1:00  Show the store files — explain state / getters / actions
3:00  Demo storeToRefs — break reactivity, fix with storeToRefs
6:00  Demo cross-store composition — workoutStore calling authStore
9:00  Demo centralised filter — change filter from WorkoutLog, show Dashboard update
12:00 Demo persistence — refresh page, data survives
14:00 Demo TransitionGroup — add and delete workouts, watch animation
16:00 Summary — when to use Pinia vs local state
```

---

## Submission Checklist

### Stage 1 — 20 marks

- [ ] Project created with Vite, `vue-router` installed
- [ ] `createWebHashHistory` used (Mercury compatibility)
- [ ] `Home.vue`: title, welcome paragraph, two images present
- [ ] `News.vue`: JSON loaded, all four search fields work, pagination works
- [ ] `About.vue`: name inputs show welcome message, radio buttons swap image
- [ ] App is responsive at mobile / tablet / desktop breakpoints
- [ ] NavBar collapses to hamburger on mobile

### Stage 2 — 25 marks

- [ ] All Stage 1 requirements still working
- [ ] `authStore.js` and `workoutStore.js` created with Composition API syntax
- [ ] `vFocus` and `vHighlight` directives registered in `main.js` and used in pages
- [ ] `v-bind`, `v-model`, `v-if`, `v-for`, `v-on` all demonstrably used
- [ ] Register form validates all five fields before submitting
- [ ] Login redirects to `/dashboard` on success
- [ ] Navigation guard blocks `/dashboard` and `/workouts` when not logged in
- [ ] WorkoutLog: create, edit, delete all working for logged-in user
- [ ] Exercises page loads from ExerciseDB API (with fallback to local JSON)
- [ ] Body part filter calls `fetchExercisesByBodyPart` API endpoint
- [ ] Exercises page pagination works (12 per page)
- [ ] Community feed: post, like/unlike, delete (own post or admin) all working
- [ ] Data persists after browser refresh (localStorage)
- [ ] Differentiated content: unauthenticated users cannot see post form or dashboard
- [ ] Dashboard shows stats, workouts-by-type, and recent workouts
- [ ] `usePagination` composable shared between News and Exercises
- [ ] All forms have `label`, `id`, and `aria` attributes for accessibility
- [ ] Project report written (4 sections)

### Stage 3 — 20 marks

- [ ] `storeToRefs` used in at least WorkoutLog.vue and Dashboard.vue
- [ ] Cross-store composition demonstrated (`workoutStore` uses `authStore` inside getters)
- [ ] Filter state (`setFilter`, `resetFilter`) managed entirely inside `workoutStore`
- [ ] `<TransitionGroup>` animation on workout list enter and leave
- [ ] `weeklyVolume` and `statsByType` getters displayed on Dashboard
- [ ] `src/api/exerciseApi.js` uses env variables for API key (not hardcoded)
- [ ] `.env` file excluded from git (in `.gitignore`)
- [ ] Video recorded: 3–20 minutes, face visible throughout
- [ ] Live coding shown in video (not just slides)
- [ ] Video uploaded to YouTube or cloud drive with public/link access
- [ ] Source code zipped and submitted to Canvas
- [ ] Mercury URL in Canvas comments
- [ ] Video URL in Canvas comments

---

## Deployment to Mercury

```bash
npm run build
```

Upload the entire contents of the `dist/` folder to your Mercury server directory.

Because the router uses `createWebHashHistory()`, all routes are hash-based (`/#/dashboard`) and no server configuration is needed. The app will work directly from a static file server.

---

## Notes for AI Agent

- Do not change the folder structure. All pages go in `src/pages/`, all reusable components in `src/components/`, all API calls in `src/api/`.
- Do not hardcode the RapidAPI key anywhere. Always read from `import.meta.env.VITE_RAPIDAPI_KEY`.
- Do not use the Options API. All components use `<script setup>` with Composition API.
- Do not use `createWebHistory`. Use `createWebHashHistory` for Mercury compatibility.
- Do not install axios. Use the native `fetch` API in `exerciseApi.js`.
- Bootstrap classes only — do not write layout CSS from scratch.
- Every form input must have a matching `<label>` with `for` attribute equal to the input's `id`.

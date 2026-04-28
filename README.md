# Task Manager — Django + React

A simple full-stack CRUD app. Django REST Framework powers the API; React + Vite handles the UI.

---

## 📁 Project Structure

```
taskmanager/
├── backend/          ← Django project
│   ├── manage.py
│   ├── requirements.txt
│   ├── myproject/    ← settings, urls, wsgi
│   └── tasks/        ← model, serializer, views, urls
└── frontend/         ← React + Vite project
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── index.css
```

---

## 🚀 Setup & Run

### 1 — Backend (Django)

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations & start server
python manage.py migrate
python manage.py runserver      # → http://localhost:8000
```

**API Endpoints:**
| Method | URL | Action |
|--------|-----|--------|
| GET | `/api/tasks/` | List all tasks |
| POST | `/api/tasks/` | Create a task |
| PATCH | `/api/tasks/<id>/` | Update a task |
| DELETE | `/api/tasks/<id>/` | Delete a task |

---

### 2 — Frontend (React)

```bash
cd frontend

npm install
npm run dev                     # → http://localhost:5173
```

Vite proxies `/api/*` requests to `http://localhost:8000`, so no CORS issues in dev.

---

## 🔧 How It Works

- **Task model** has `title`, `completed` (bool), and `created_at`.
- **Django REST Framework** provides the API with `ListCreateAPIView` and `RetrieveUpdateDestroyAPIView` — no custom view code needed.
- **React** fetches tasks on mount, and handles add / toggle / delete with `axios`.
- **django-cors-headers** allows the React dev server to call the Django API freely.

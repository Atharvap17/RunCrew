# RunCrew — Marathon Event Management Platform

A full-stack web application for managing marathon events, participant registrations, payments, and race results. Built as a portfolio-grade project with a modern user-facing UI and an admin dashboard.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Leaflet Maps, Axios |
| Backend | Django 6, Django REST Framework, SimpleJWT |
| Database | SQLite (default) / MySQL (configurable) |
| Auth | JWT with refresh tokens |

## Features

### User Facing
- Browse featured & upcoming marathon events
- Event details with interactive route maps (OpenStreetMap)
- User registration, login, forgot password with OTP
- Event registration with form validation
- Secure payment flow (demo mode)
- Payment confirmation with email notification
- User profile with registration history
- Public race results leaderboard
- About & Contact pages
- Responsive design (mobile, tablet, desktop)

### Admin Dashboard (Volt-inspired)
- Dashboard with stats overview
- User management (CRUD)
- Event management (create, delete)
- Registration management
- Payment records
- Race results management

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend Setup

```bash
cd backend
python -m venv env
env\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@runcrew.com | admin123 |
| Runner | runner@runcrew.com | runner123 |

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Users | `/api/users/register/`, `/api/users/login/`, `/api/users/profile/`, `/api/users/forgot-password/`, `/api/users/verify-otp/`, `/api/users/reset-password/` |
| Events | `/api/events/`, `/api/events/<id>/`, `/api/events/<id>/participants/` |
| Registrations | `/api/registrations/`, `/api/registrations/<id>/`, `/api/registrations/<id>/cancel/` |
| Payments | `/api/payments/`, `/api/payments/<id>/` |
| Results | `/api/results/`, `/api/results/<id>/` |
| Dashboard | `/api/dashboard/stats/` |

## Project Structure

```
RunCrew/
├── backend/
│   ├── config/          # Django settings & URLs
│   ├── users/           # Auth, profiles, OTP
│   ├── events/          # Marathon events
│   ├── registrations/   # Event registrations
│   ├── payments/        # Payment processing
│   └── results/         # Race results
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # Auth state (React Context)
        ├── pages/       # User & admin pages
        ├── services/    # API integration
        └── routes/      # React Router config
```

## License

MIT

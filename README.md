# Clinic Appointment Website

This project is a full-stack appointment booking system for clinics, built with React.js (frontend), Node.js/Express (backend), and MongoDB (database).
Authors: Mr.Savio David<br>Mr.Sasank Kolluru

## Structure
- `frontend/` — React.js app (with Tailwind CSS)
- `backend/` — Node.js/Express API server

## Quick Start

### 1. Backend Setup
- Go to `backend/`
- Install dependencies: `npm install`
- Create a `.env` file with your MongoDB URI and JWT secret
- Start server: `npx nodemon src/app.js`

### 2. Frontend Setup
- Go to `frontend/`
- Install dependencies: `npm install`
- Start React app: `npm start`

---

## Features
- User authentication (patients, doctors, admins)
- Doctor/clinic profiles
- Appointment booking
- Dashboards
- Search/filter
- Notifications (email/SMS)
- Payment integration (Stripe/Razorpay)

---

## Environment Variables

### Backend `.env` example:
```
MONGO_URI=mongodb://localhost:27017/clinicdb
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_FROM=your_from_email@example.com
```

### Frontend `.env` example (if needed):
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## Testing

### Backend
- Go to `backend/`
- Run tests: `npm test`
- Example test file: `backend/tests/appointment.test.js`

### Frontend
- Go to `frontend/`
- Run: `npm test` (if tests are present)

---

## Production Deployment

### Backend
- Set all environment variables in your production environment.
- Build and run with: `npm run build` (if applicable) or `node src/app.js`
- Use a process manager (e.g., PM2) for reliability.

### Frontend
- Run: `npm run build` to create a production build.
- Deploy the contents of `frontend/build/` to Netlify, Vercel, or your web server.

---

See each folder's README for more details.

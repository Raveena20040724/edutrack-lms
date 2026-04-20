# EduTrack LMS

A full-stack Learner Management System built with React + Django REST Framework.

## Project Structure

```
EduTrack/
├── frontend/        → React.js (Student, Trainer, Admin portals)
├── backend/         → Django REST Framework (API + Database)
├── .gitignore
└── README.md
```

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js                          |
| Backend    | Django REST Framework             |
| Database   | PostgreSQL                        |
| Auth       | JWT (SimpleJWT)                   |
| Storage    | Cloudinary                        |
| Deployment | Render / Railway                  |

---

## Team Setup (Every Member Does This)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/EduTrack.git
cd EduTrack
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file inside `backend/` folder:
```
SECRET_KEY=anyrandomsecretkey123456789
DEBUG=True
DB_NAME=edutrack_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:3000
```

Create database in pgAdmin:
```sql
CREATE DATABASE edutrack_db;
```

Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

---

### 3. Setup Frontend
Open a **new terminal**:
```bash
cd frontend
```

Create `.env` file inside `frontend/` folder:
```
REACT_APP_API_URL=http://localhost:8000/api
```

Run:
```bash
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## Login Credentials (after seed_data)

| Role    | Username | Password    |
|---------|----------|-------------|
| Admin   | admin    | Admin123!   |
| Trainer | maria    | Trainer123! |
| Student | alex     | Student123! |

---

## API Endpoints

| Method | Endpoint                        | Description            |
|--------|---------------------------------|------------------------|
| POST   | `/api/auth/register/`           | Register               |
| POST   | `/api/auth/login/`              | Login (returns JWT)    |
| GET    | `/api/auth/profile/`            | Get profile            |
| GET    | `/api/courses/`                 | List all courses       |
| POST   | `/api/courses/`                 | Create course          |
| POST   | `/api/courses/<id>/enroll/`     | Enroll in course       |
| GET    | `/api/courses/my-enrollments/`  | My enrolled courses    |
| POST   | `/api/assignments/<id>/submit/` | Submit assignment      |
| POST   | `/api/assignments/submissions/<id>/grade/` | Grade submission |

---

## Git Workflow for Team

```bash
# Before starting work
git pull origin main

# After making changes
git add .
git commit -m "your message here"
git push origin main
```

### Branches (recommended)
```bash
git checkout -b feature/your-feature-name
# work on your feature
git push origin feature/your-feature-name
# then create Pull Request on GitHub
```

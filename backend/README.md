# EduTrack LMS — Backend Setup Guide

## Tech Stack
- **Backend**: Django 4.2 + Django REST Framework
- **Auth**: JWT (SimpleJWT)
- **Database**: PostgreSQL
- **File Storage**: Cloudinary
- **Frontend**: React.js

---

## Step 1 — PostgreSQL Setup

Install PostgreSQL and create the database:

```sql
-- Open psql and run:
CREATE DATABASE edutrack_db;
CREATE USER edutrack_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE edutrack_db TO edutrack_user;
```

---

## Step 2 — Backend Setup

```bash
# 1. Go into the backend folder
cd backend

# 2. Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env
# Edit .env with your DB credentials and secret key

# 5. Run migrations
python manage.py makemigrations
python manage.py migrate

# 6. Create superuser (for Django Admin)
python manage.py createsuperuser

# 7. Seed sample data
python manage.py seed_data

# 8. Start the server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
Django Admin: **http://localhost:8000/admin/**

---

## Step 3 — Frontend Setup

```bash
# 1. Go into the frontend folder
cd EduTrack   (or wherever your React project is)

# 2. Create .env file in React root
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# 3. Copy the new API files:
#    - Copy backend/frontend_api_service/api.js         → src/services/api.js
#    - Copy backend/frontend_api_service/AuthContext.jsx → src/context/AuthContext.jsx

# 4. Install and start
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## API Endpoints Reference

### Auth  `/api/auth/`
| Method | Endpoint             | Description          | Access  |
|--------|----------------------|----------------------|---------|
| POST   | `/register/`         | Register new user    | Public  |
| POST   | `/login/`            | Login → JWT tokens   | Public  |
| POST   | `/logout/`           | Logout               | Any     |
| POST   | `/token/refresh/`    | Refresh access token | Any     |
| GET    | `/profile/`          | Get own profile      | Any     |
| PATCH  | `/profile/`          | Update own profile   | Any     |
| POST   | `/change-password/`  | Change password      | Any     |
| GET    | `/users/`            | List all users       | Admin   |
| DELETE | `/users/<id>/`       | Delete user          | Admin   |

### Courses  `/api/courses/`
| Method | Endpoint                              | Description               | Access         |
|--------|---------------------------------------|---------------------------|----------------|
| GET    | `/`                                   | List all courses          | Any            |
| POST   | `/`                                   | Create course             | Trainer/Admin  |
| GET    | `/<id>/`                              | Course detail + lessons   | Any            |
| PATCH  | `/<id>/`                              | Update course             | Trainer/Admin  |
| DELETE | `/<id>/`                              | Delete course             | Admin          |
| GET    | `/<id>/lessons/`                      | List lessons              | Any            |
| POST   | `/<id>/lessons/`                      | Upload lesson + video     | Trainer/Admin  |
| POST   | `/<id>/lessons/<lid>/complete/`       | Mark lesson done          | Student        |
| POST   | `/<id>/enroll/`                       | Enroll in course          | Student        |
| DELETE | `/<id>/unenroll/`                     | Unenroll                  | Student        |
| GET    | `/my-enrollments/`                    | Student's enrolled courses| Student        |
| GET    | `/my-courses/`                        | Trainer's courses         | Trainer        |
| GET    | `/<id>/students/`                     | Students in a course      | Trainer/Admin  |
| GET    | `/admin/all/`                         | All courses               | Admin          |

### Assignments  `/api/assignments/`
| Method | Endpoint                              | Description               | Access         |
|--------|---------------------------------------|---------------------------|----------------|
| GET    | `/`                                   | List assignments          | Any            |
| POST   | `/`                                   | Create assignment         | Trainer/Admin  |
| POST   | `/<id>/submit/`                       | Submit assignment file    | Student        |
| GET    | `/my-submissions/`                    | Student's submissions     | Student        |
| GET    | `/results/`                           | Student's scores          | Student        |
| GET    | `/<id>/submissions/`                  | All submissions           | Trainer        |
| POST   | `/submissions/<id>/grade/`            | Grade submission          | Trainer        |
| GET    | `/analytics/`                         | Trainer analytics         | Trainer        |
| GET    | `/admin/analytics/`                   | Platform analytics        | Admin          |

---

## Cloudinary Setup (File Storage)

1. Create free account at https://cloudinary.com
2. Get Cloud Name, API Key, API Secret from dashboard
3. Add to your `.env` file

---

## Deployment (Render / Railway)

### Backend on Render:
1. Push backend folder to GitHub
2. Create new Web Service on Render
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn edutrack_backend.wsgi:application`
5. Add all environment variables from `.env`

### Frontend on Render/Vercel:
1. Push React project to GitHub
2. Set `REACT_APP_API_URL` to your backend URL
3. Build command: `npm run build`

---

## Login Credentials (after seed_data)
| Role    | Username | Password     |
|---------|----------|--------------|
| Admin   | admin    | Admin123!    |
| Trainer | maria    | Trainer123!  |
| Student | alex     | Student123!  |

# Vanier Exam Scheduler

Are you a Vanier student frustrated with the tedious process of sifting through exam PDFs each finals season to find your exams and manually add them to your calendar? 

**Vanier Exam Scheduler** is here to save your time! This project allows you to easily search for your exams and export them to your calendar.

The project is built with:
- **PostgreSQL** for storing exam schedules and related information
- **Django** for the backend
- **HTML/CSS** and **JavaScript** for the frontend

![Vanier Exam Scheduler Preview](https://github.com/user-attachments/assets/216afe91-c342-4433-92ad-66a0d6028c22)

---

## 🚀 Visit The Site
Explore the scheduler here: [Vanier Exam Scheduler](https://vanier-scheduler-production.up.railway.app/)

---

## 🛠 Prerequisites

Before running this project locally, ensure you have the following installed:

- **Python 3** (for the backend logic)
- **Django** (web framework)
- **PostgreSQL** (optional, for database functionality)
- **pip** (Python package installer)

---

## 🔧 Setup and Usage

Follow these steps to run the project locally:
### 1. **Clone the repository**
### 2. Set up a virtual environment (optional but recommended)
- `python -m venv venv`
- `source venv/bin/activate   # On Windows: venv\Scripts\activate`
### 3. Configure the database
Update settings.py in the Django project to configure your PostgreSQL database. Replace placeholders with your database information:
- `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}`
- Or use Django's built in SQLite database: `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}`
### 4. Run migrations
Apply the database migrations to set up the required tables:
- `python manage.py makemigrations`
- `python manage.py migrate`

### 5. Load exam data
- `python manage.py import_exams A24FinalExam-nov12-2024.csv`

### 6. Run the development server
Start the Django server locally:
- `python manage.py runserver`

### 7. Access the application
Open your browser and go to:
- `http://127.0.0.1:8000/`

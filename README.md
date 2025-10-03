Career Comeback Compass

A complete web application designed for professionals navigating a career change or returning to the workforce after an extended career break. It provides a full suite of tools ,from personalized planning and story development to job tracking and AI-powered guidance—to help users relaunch their careers with confidence.

Key Features
The application is split into public pages and a secure, personalized dashboard:

Public Features
Secure Authentication: User registration and login using JWT (JSON Web Tokens).

Global Theming: Dark Mode/Light Mode toggle controlled via React Context.

Dashboard Modules
Action Planner (Task Management): Create, track, and manage personal goals and subtasks with scheduling/reminders.

Job Application Tracker: Log and track the status of job applications (Applied, Interviewing, Rejected, Offer).

Gap Story Builder: A multi-step guided form to help users articulate their career gap and turn it into a positive narrative.

Resources Hub: Curated, categorized links and articles for resume building, networking, and mentorship.

AI Chatbot: An interactive assistant providing instant, contextual career coaching and advice (via LLM API proxy).

Tech Stack
This project utilizes a modern, decoupled full-stack architecture.

Frontend
Technology Description
React Core JavaScript library for the user interface.
React Router v6 handles client-side routing, protected routes, and nested layouts (DashboardLayout).
Tailwind CSS is a Utility-first framework for rapid and dynamic styling (supports Dark Mode).
Axios HTTP client for making API requests to the backend.
Context API manages global state (User Auth, Dark Mode).

Backend
Technology Description
FastAPI is a High-performance Python web framework for handling API endpoints.
PostgreSQL Robust, scalable relational database used for persistent storage.
SQLAlchemy Python SQL toolkit and Object Relational Mapper (ORM) used to interact with PostgreSQL.
JWT (PyJWT & FastAPI Security) handles secure, stateless authentication and authorization.
Passlib (bcrypt) used for secure password hashing and verification.

Installation and Setup

Prerequisites
You must have the following installed:

Python 3.9+

Node.js and npm (or yarn)

PostgreSQL running locally or via a service.

Clone :

git clone https://github.com/ReshmaJohnDev/CareerCombackCompassNew

1. Backend Setup

# Navigate to backend directory

cd Backend

# Create and activate a virtual environment

python -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`

# Install Python dependencies

pip install -r requirements.txt

# Create a .env file in the file path mentioned below

File Path : /CareerCombackCompass/Backend/config

BACKEND - .env file
DATABASE_URI = 'postgresql://user:password@host:port/database_name'
JWT_SECRET_KEY= YOUR_SECURE_RANDOM_KEY
COHERE_API_KEY=YOUR_SECURE_RANDOM_KEY
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=YOUR_SMTP_USERNAME
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
SENDER_EMAIL=YOUR_SENDER_EMAIL

# Run the FastAPI server

uvicorn main:app --reload --port 8000
The backend API will be running at http://localhost:8000.

---

2. Frontend Setup

# Navigate to frotend directory

cd Frontend

# Install Node dependencies

npm install

# Create a .env file for the frontend directory path

CareerCombackCompass/Frontend/.env

# VITE_API_URL=http://localhost:8000

# Start the React development server

npm run dev
The frontend application will be running at http://localhost:3000.

Authentication & Security Flow
The system uses a stateless JWT-based authentication flow:

Login: User submits credentials to POST /auth/login.

Verification: FastAPI verifies the password hash (bcrypt) against the database.

Token Issuance: FastAPI generates a JWT (containing the user ID) and sends it to the frontend.

Authorization: The React app stores the token in localStorage and includes it in the Authorization Header of every subsequent request to protected routes.

Protection: The backend's get_current_user dependency validates the token's signature and expiration before executing the API endpoint logic.

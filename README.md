# 🚀 InterviewAI – AI-Powered Mock Interview Platform

**InterviewAI** is a modern AI-powered mock interview platform that helps students and job seekers prepare for technical, HR, core subject, and rapid-fire interviews. It provides an interactive interview experience with a clean UI, secure authentication, and real-time AI-generated questions.

🌐 **Live Demo:** https://interv-ai-mm5n.vercel.app/

---

## 📖 Overview

InterviewAI is designed to simulate real interview experiences, allowing users to practice anytime and improve their confidence before actual placement or job interviews.

The platform supports multiple interview modes, user authentication using Firebase, and a responsive interface built with React and Tailwind CSS.

---

## ✨ Features

* 🔐 Secure Authentication using Firebase
* 👤 User Registration and Login
* 🔑 Forgot Password functionality
* 🤖 AI-Powered Mock Interviews
* 💻 Technical Interview Practice
* 📚 Core Subject Interviews

  * DBMS
  * Operating Systems
  * Computer Networks
  * Object-Oriented Programming
* 🗣️ HR Interview Preparation
* ⚡ Rapid Fire Question Round
* 📱 Fully Responsive Design
* 🎨 Modern UI with Smooth Animations
* 🔒 Protected Routes using React Router
* 🚀 Fast Deployment on Vercel

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Framer Motion
* React Icons

### Backend / Services

* Firebase Authentication
* Firebase Hosting (Authentication Service)

### Deployment

* Vercel

---

## 📂 Project Structure

```
src
│
├── components
├── firebase
│   └── firebase.js
├── pages
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── Home.jsx
│   ├── Interview.jsx
│   └── RapidFire.jsx
│
├── App.jsx
└── main.jsx
```

---

## 🔑 Authentication

The application uses Firebase Authentication to provide:

* Email & Password Sign Up
* Login
* Password Reset
* Persistent User Sessions
* Route Protection

Unauthenticated users are automatically redirected to the login page before accessing protected routes.

---

## 🎯 Interview Categories

### 💻 Technical Interviews

Practice coding, DSA, algorithms, and software engineering concepts.

### 📚 Core Subjects

Strengthen your understanding of:

* DBMS
* Operating Systems
* Computer Networks
* OOP

### 👥 HR Interviews

Prepare answers for behavioral and communication-based interview questions.

### ⚡ Rapid Fire

Answer quick AI-generated questions under time pressure to improve confidence and speed.

---

## 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate to the project

```bash
cd InterviewAI
```

Install dependencies

```bash
npm install
```

Create a `.env` file and add your Firebase configuration.

Run the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:5173
```

---

## 🌍 Deployment

The application is deployed on **Vercel**.

Live URL:

https://interv-ai-mm5n.vercel.app/

---

## 🔮 Future Improvements

* AI Voice Interviews
* Resume Analysis
* Interview Performance Dashboard
* AI Feedback and Suggestions
* Coding Playground
* Company-Specific Interview Sets
* Progress Tracking
* Leaderboard
* Interview History
* Multi-language Support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Abhay Kumar Yadav**

B.Tech Information Technology Student

Passionate about Full Stack Development, Artificial Intelligence, and Software Engineering.

---

⭐ If you found this project useful, don't forget to **Star** the repository!

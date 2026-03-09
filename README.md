# TaskMate AI 🚀

TaskMate AI is a modern productivity web application that combines task management with AI-powered planning.

Users can create tasks, break them into subtasks, track progress, and automatically generate task steps using Google's Gemini AI.

---

## ✨ Features

- Create and manage tasks
- Add subtasks to each task
- Track subtask progress automatically
- AI-powered task breakdown
- Data saved in browser using LocalStorage
- Node.js backend for secure AI API usage
- Clean and simple productivity interface

---

## 🧠 AI Feature

TaskMate AI uses the **Google Gemini API** to automatically generate actionable subtasks for any task.

Example:

Input task:
```
Build portfolio website
```

AI-generated steps:
```
Choose design inspiration
Create wireframe
Build HTML structure
Add CSS styling
Deploy website
```

This helps users quickly plan tasks without manually thinking about every step.

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### AI
- Google Gemini API

---

## 📁 Project Structure

```
TaskMate
│
├── index.html
├── style.css
├── app.js
│
└── server
    ├── server.js
    └── package.json
```

---

## ⚙️ How to Run the Project

### 1. Download or Clone the Project

Clone the repository:

```
git clone https://github.com/yourusername/taskmate-ai.git
```

or download the ZIP and extract it.

---

### 2. Install Backend Dependencies

Open a terminal and navigate to the server folder:

```
cd server
```

Install required packages:

```
npm install express cors node-fetch
```

---

### 3. Add Your Gemini API Key

Open `server/server.js` and replace:

```
const API_KEY = "YOUR_GEMINI_KEY";
```

with your Gemini API key from **Google AI Studio**.

---

### 4. Start the Backend Server

Run:

```
node server.js
```

You should see:

```
Server running on http://localhost:5000
```

---

### 5. Open the Frontend

Simply open:

```
index.html
```

in your browser.

---

## 🔄 How AI Integration Works

1. User enters a task title
2. User clicks **Generate Steps with AI**
3. The frontend sends the task title to the backend
4. The backend sends the request to the Gemini API
5. Gemini generates structured steps
6. The backend returns the steps to the frontend
7. The steps automatically appear as subtasks

---

## 📈 Future Improvements

Possible upgrades for TaskMate AI:

- AI daily planner
- Kanban drag-and-drop board
- Calendar integration
- User authentication
- Cloud database (Firebase or Supabase)
- Mobile responsive UI improvements

---

## 👨‍💻 Author

Created by **Your Name**

A productivity-focused web application built with modern JavaScript and AI integration.

---

## ⭐ If you like this project

Give the repository a star on GitHub!
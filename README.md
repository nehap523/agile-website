# 🌐 Agile Web Foundations Project

This project is a multi-page interactive web application developed as part of the **CITS5505 Agile Web Development** unit at The University of Western Australia.

The application demonstrates core front-end development concepts using **HTML, CSS, and JavaScript**, with dynamic behaviour implemented using AJAX and browser storage.

---

## 📌 Project Overview

The website is designed as a learning and assessment platform that guides users through:

1. Learning web development concepts  
2. Testing knowledge via an interactive quiz  
3. Tracking performance over time  
4. Reflecting on AI usage in development  
5. Showcasing a personalised CV  

The application maintains a **consistent design and navigation structure** across all pages, creating a cohesive user experience.

---

## 🧩 Features

### 📘 Tutorial Page
- Explains **HTML, CSS, and JavaScript fundamentals**
- Includes structured content with examples
- Provides **interactive demonstrations** to improve understanding
- Navigation link to quiz page

---

### 📝 Quiz Page
- Loads questions dynamically from a **local JSON file using AJAX (`fetch()`)**
- Questions are **randomised** on each load
- Fully rendered using **JavaScript DOM manipulation**
- Prevents accidental exit using **beforeunload warning**
- Validates unanswered questions before submission
- Displays:
  - Score
  - Percentage
  - Pass/Fail result
- Fetches **reward content from a public API** if user passes
- Stores quiz attempts using **localStorage**
- Displays previous attempts with timestamp
- Option to clear history

---

### 🤖 AI Reflection Page
- Documents how AI tools were used during development
- Includes:
  - Example prompts
  - AI-generated outputs
  - Corrections and improvements made
- Critically evaluates:
  - Limitations of AI
  - Risks of over-reliance
  - Ethical considerations

---

### 💼 Personalised CV Page
- Professional CV-style layout (~500 words)
- Includes:
  - Personal introduction
  - Skills and experience
- Uses:
  - **Responsive design**
  - Interactive JavaScript features (animations, toggles)
- Includes **reference section** following UWA guidelines

---

## 🛠️ Technologies Used

- **HTML5** – structure and semantic layout  
- **CSS3** – styling and responsiveness  
- **Bootstrap (via CDN)** – layout, components, responsiveness  
- **JavaScript (ES6)** – application logic and interactivity  
- **Fetch API (AJAX)** – dynamic data loading  
- **LocalStorage API** – persistent data storage  
- **Public API** – reward content on quiz success  

---

## 📂 Project Structure
project-root/
│
├── index.html
├── quiz.html
├── reflection.html
├── cv.html
│
├── css/
│ ├── style.css
│ ├── tutorial.css
│ ├── quiz.css
│ ├── reflection.css
│ └── cv.css
│
├── js/
│ ├── main.js
│ ├── tutorial.js
│ ├── quiz.js
│ └── cv.js
│
├── data/
│ └── questions.json
│
├── images/
│ └── profile-placeholder.jpg


---

## ▶️ How to Run the Project

⚠️ **Important:** The quiz uses `fetch()` to load JSON, so it must be run using a local server.

### Option 1: Python Server

```bash
python3 -m http.server 8000

Open in browser:

http://localhost:8000

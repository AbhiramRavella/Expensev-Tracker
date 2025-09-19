# 💰 Expense Tracker  

An easy-to-use Expense Tracker web application to manage and track daily expenses. The project is built with a **frontend (HTML, CSS, JavaScript)** and a **backend (JSON server)** for storing expense data.  

## 📂 Project Structure  
EXPENSE-TRACKER
│── backend
│ └── db.json # JSON server database for storing expenses
│
│── frontend
│ ├── index.html # Main HTML file
│ ├── script.js # JavaScript for handling logic
│ └── style.css # Styling file
│
│── node_modules # Dependencies (auto-generated)
│── package.json # Project metadata & dependencies
│── package-lock.json # Dependency lock file

## 🚀 Features  

- Add new expenses with description and amount  
- View a list of all recorded expenses  
- Delete expenses easily  
- Data persistence using **JSON Server**  
- Simple and responsive UI  

---

## 🛠️ Installation & Setup  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

2️⃣ Install dependencies
npm install

3️⃣ Start the backend (JSON Server)
npx json-server --watch backend/db.json --port 3000
4️⃣ Run the frontend

Simply open the frontend/index.html file in your browser.

📌 Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: JSON Server (Node.js)

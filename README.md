# 📚 Student Record Management System (SRMS)

A simple web-based Student Record Management System built using **Node.js, Express, and EJS**.

---

## 📂 Project Folder Structure

```
SRMS2/
│
├── src/
│   ├── app.js
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── controllers/
│   │   └── studentController.js
│   ├── models/
│   │   └── studentModel.js
│   └── views/
│       ├── home.ejs
│       ├── search.ejs
│       ├── add.ejs
│       ├── update.ejs
│       └── partials/
│           ├── header.ejs
│           └── footer.ejs
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Requirements

- Node.js (v18 or above)
- npm

---

## 🚀 How to Run This Project

```bash
npm install
node src/app.js
```

Then open your browser and go to:

```
http://localhost:3000
```

---

## 🛠 Features

- Add student records  
- Search student records  
- Update student data  
- Delete student records  
- EJS templating  
- Express routing  

---

## 📌 Important View Path Setup

In `app.js`:

```js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
```

---

## ❗ Common Errors & Fixes

### ❌ "Failed to lookup view"
✅ Make sure your file exists at:
```
src/views/filename.ejs
```

### ❌ "student is not defined" in EJS
✅ Pass data properly:
```js
res.render("search", { student });
```

---

## 🧑‍💻 Author

Built by:<br>
KISHOR GUNITHI<br>
PATURU V N S GANESH CHARAN<br>
DOGGA YASHWANTH<br>
R.NITHIN<br>
ANAND GOKUL KOTA<br>
Tech Stack: Node.js, Express, EJS, HTML, CSS, JS

---

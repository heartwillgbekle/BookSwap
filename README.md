# 📚 BookSwap - Student Textbook Exchange

**BookSwap** is a full-stack web application designed to help students buy and sell textbooks directly with one another. It eliminates the middleman, allowing students to list their used books and connect with buyers on campus.



## 🚀 Live Demo
**Website:** [https://swaphub.me](https://swaphub.me)  
*(Hosted on DigitalOcean App Platform)*

---

## ✨ Key Features

* **📖 Browse & Search:** View all available textbooks with real-time filtering by category (STEM, Humanities, Business, etc.) and search by title or author.
* **🔐 User Authentication:** Secure Login and Signup system using JWT (JSON Web Tokens).
* **📝 Create Listings:** Authenticated users can list books for sale with details like condition, ISBN, price, and cover image.
* **👤 Seller Profiles:** View your own listings and manage your account.
* **📧 Direct Contact:** Integrated "Contact Seller" button that generates pre-filled emails to facilitate meetups.
* **🛡️ Robust Error Handling:** "Safe Mode" rendering ensures the app never crashes, even if book data is incomplete or missing.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Shadcn/UI
* **State Management:** TanStack Query (React Query)
* **Routing:** React Router DOM
* **Icons:** Lucide React

### **Backend**
* **Framework:** Django + Django REST Framework (DRF)
* **Authentication:** Dj-Rest-Auth (Token-based auth)
* **Database:** PostgreSQL
* **CORS:** Django-CORS-Headers

### **Infrastructure**
* **Hosting:** DigitalOcean App Platform
* **Storage:** Whitenoise (Static files)

---

## 📂 Project Structure

```bash
├── backend/                # Django Backend
│   ├── core/               # Main app (models, views, serializers)
│   ├── book_exchange/      # Project settings
│   ├── manage.py           # Django entry point
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── components/     # Reusable UI components (Navbar, Cards)
    │   ├── lib/            # API client (api.ts) & utils
    │   ├── pages/          # Full pages (Index, Login, BookDetails)
    │   └── App.tsx         # Main router
    ├── package.json        # JS dependencies
    └── vite.config.ts      # Build configuration

```

---

## ⚡ Local Development Setup

Follow these steps to run BookSwap on your local machine.

### 1. Backend Setup (Django)

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the server
python manage.py runserver

```

*The backend will run at `http://127.0.0.1:8000*`

### 2. Frontend Setup (React)

Open a new terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

```

*The frontend will run at `http://localhost:5173*`

> **Note:** For local development, ensure your `frontend/src/lib/api.ts` points to localhost (`http://127.0.0.1:8000`) instead of the production URL.

---

## 🚀 Deployment (DigitalOcean)

This project is configured for **DigitalOcean App Platform**.

### **Configuration Notes:**

1. **Build Command (Backend):** `pip install -r requirements.txt && python manage.py collectstatic --noinput`
2. **Run Command (Backend):** `gunicorn book_exchange.wsgi:application`
3. **Environment Variables:**
* `DATABASE_URL`
* `DJANGO_SECRET_KEY`
* `DEBUG`


4. **HTTP Routes:**
* Ensure **"Strip Prefix"** is **UNCHECKED** for the backend service to prevent 404/500 errors on API calls.



---

## 🔧 Troubleshooting / Common Fixes

### **1. Database Errors (500)**

If you change a model (e.g., increase author character limit) and get a 500 error:

* Run `python manage.py makemigrations` locally.
* Commit the new migration file to GitHub.
* Run `python manage.py migrate` in the DigitalOcean console.

### **2. Blank Screen on Frontend**

If the frontend shows a blank screen:

* Open the browser console (Right Click -> Inspect -> Console).
* If you see "Unexpected token <", check that **Strip Prefix** is disabled in DigitalOcean.
* If you see "cannot read property of undefined", ensure `BookDetails.tsx` is using the "Safe Rendering" checks.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

### 📬 Contact

Created by **Heartwill Gbekle**.

Project Link: [https://github.com/heartwillgbekle/BookSwap](https://github.com/heartwillgbekle/BookSwap)

```

```
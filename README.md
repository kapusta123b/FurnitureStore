# 🛋️ F Store

A furniture e-commerce shop built with Django. Started as a learning project, but seriously aiming to become something good.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|---|
| **Backend** | Django 5.x, Python 3.11+ |
| **Database** | PostgreSQL 12+ |
| **Frontend** | HTML5, CSS3 (SCSS), Vanilla JS |
| **Build** | SASS, Django SASS Processor |

---

## ✨ What's Inside

- 🔍 Product catalog with search & filters
- 🔐 User accounts (register, login, logout)
- 🛒 Shopping cart & checkout
- 📦 Order management
- 👤 User dashboard with order history
- 🌍 English & Russian support
- 📱 Mobile-friendly design
- ✉️ Sending email (partially done)
- 🤖 CAPTCHA — Protection against bots

---

## 🚀 Getting Started

### 📋 You Need

- Python 3.11+
- PostgreSQL 12+ (installed & running)
- A virtual environment

### 📥 Installation

**1. Clone the repo**
```bash
git clone https://github.com/Phonkmasti/FurnitureStore.git
cd FurnitureStore
```

**2. Set up virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Configure your database**
If you want something other than PostgreSQL, edit `app/settings.py`

**5. Run migrations**
```bash
python manage.py migrate
```

**6. Create admin user**
```bash
python manage.py createsuperuser
```

**7. Start the dev server**
```bash
python manage.py runserver
```

Open: **http://127.0.0.1:8000/**

---

## 📂 Project Layout

```
FurnitureStore/
├── app/                    # Django config
├── main/                   # Homepage & static pages
├── goods/                  # Product catalog
├── carts/                  # Shopping cart
├── orders/                 # Order handling
├── users/                  # Auth & profiles
├── templates/              # HTML templates
├── static/
│   └── deps/
│       ├── css/           # SCSS styles
│       ├── js/            # JavaScript files
│       ├── svg/           # SVG icons
│       └── favicon/       # Favicon stuff
├── media/                 # Uploads
├── fixtures/              # Initial data
├── manage.py
├── requirements.txt
└── README.md
```

---

## 🗄️ Database Models

| Model | What It Does |
|-------|---|
| **User** | Extended user profile with avatar & subscription |
| **Product** | Items with prices, discounts, stock |
| **Cart** | Items in user's/session's cart |
| **Order** | Orders with shipping info |
| **OrderItem** | Individual items in an order |

---

## 💡 Development Tips

- SASS compiles automatically
- Admin panel at `/admin/`
- This project is constantly evolving

---

## 📝 Quick Notes

- Make sure PostgreSQL is actually running before you start
- Collect static files: `python manage.py collectstatic`

---

## 🗺️ What's Coming Next

Planned features:

- ☎️ **Phone Verification** — SMS confirmation on signup
- ⚡ **Redis Caching** — Speed things up
- 🐳 **Docker & AWS** — Containerized, ready for production with Nginx
- 🔑 **Social Login** — Sign in with Google, GitHub, Facebook
# Furniture-Store-aws

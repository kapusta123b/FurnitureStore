# 🛋️ Furniture Store

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python Version">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django Version">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
</p>




A **E-commerce platform** specialized in furniture, built with **Django 5**. This project is fully containerized with **Docker**, using **Nginx** as a reverse proxy and **PostgreSQL** for data persistence.

---

## 🚀 Quick Start (Production)

Follow these steps to deploy the application on your server.

### 1. Clone the Repository
```bash
git clone https://github.com/Phonkmasti/FurnitureStore.git
cd FurnitureStore
```

### 2. Configure Production Secrets
The project uses a secure mechanism for handling sensitive data through the `sets/` directory.

1.  **Database Password**: Create or edit `./sets/pg_secret_password.txt` and put your database password inside (no spaces):
    ```bash
    echo "your_secure_password" > ./sets/pg_secret_password.txt
    ```

2.  **Environment Variables**: Edit `./sets/set_env.sh` to match your server details:
    ```bash
    nano ./sets/set_env.sh
    ```
    Update the following:
    - `ALLOWED_HOSTS`: Your domain or server IP.
    - `CSRF_TRUSTED_ORIGINS`: `http://your_ip` or `https://your_domain`.

3.  **Apply Variables**: Source the script to export variables to your current shell:
    ```bash
    source ./sets/set_env.sh
    ```

### 3. Nginx Configuration
Edit `./conf.d/nginx.conf` and replace the placeholders with your server's IP or DNS name:
```nginx
server {
    listen 80;
    server_name your_public_ipv4_adress your_public_DNS_adress; # <--- CHANGE THIS
    ...
}
```

### 4. Launch with Docker
Run the following command to build and start all services in detached mode:
```bash
docker compose up -d --build
```

---

## 🛠️ Post-Deployment

### Create Admin User
To access the Django admin panel (`/admin/`), create a superuser inside the running container:
```bash
docker compose exec web python manage.py createsuperuser
```

### Load Demo Data
The system automatically loads category and product fixtures during the first start via `entrypoint.sh`. If you need to reload them:
```bash
docker compose exec web python manage.py loaddata fixtures/goods/goods_Category.json
docker compose exec web python manage.py loaddata fixtures/goods/goods_Products.json
```

---

## 🏗️ Project Architecture

```mermaid
graph TD
    subgraph Client[External Access]
        N[Nginx Reverse Proxy]
    end

    subgraph App[Django Application]
        G[Gunicorn WSGI]
        D[Django Core]
        S[Sass Processor]
    end

    subgraph Services[Backend Services]
        DB[(PostgreSQL 16)]
        M(Media Storage)
        ST(Static Files)
    end

    N --> G
    G --> D
    D --> S
    D --> DB
    D --> M
    D --> ST
```

---

## 📂 Deployment Components

- **`backend/`**: Django source code and Dockerfile.
- **`conf.d/`**: Nginx configuration files.
- **`sets/`**: Scripts and files for managing production environment variables and secrets.
- **`compose.yml`**: Main orchestration file.

---


## 🤝 Connect

<p align="center">
  <a href="https://t.me/kapusta123b">
    <img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" />
  </a>
  <a href="mailto:fartuchoknik22@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
</p>

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=60&section=footer" width="100%"/>
</p>

# compuroom

![CI](https://github.com/Worxchit/compuroom/actions/workflows/ci.yml/badge.svg)

ระบบทะเบียนครุภัณฑ์คอมพิวเตอร์ประจำห้องแล็บ (Computer Lab Equipment Registry) — ระบบ CRUD สำหรับติดตามครุภัณฑ์คอมพิวเตอร์ (รหัสครุภัณฑ์, ยี่ห้อ/รุ่น, สเปก CPU/RAM, ห้องที่ตั้ง และสถานะการใช้งาน)

## ข้อมูลนักศึกษา

| หัวข้อ | ข้อมูล |
|---|---|
| ชื่อ-นามสกุล | นาย วรชิต ดีไร่ |
| รหัสนักศึกษา | 68319010028 |
| ห้อง/กลุ่มเรียน | 30901-2008 กลุ่ม 2 |
| รายวิชา | DevOps 30901-2008 — Midterm Practical Exam |

## เทคโนโลยีที่ใช้

- **Backend:** Node.js, Express, PostgreSQL (`pg`)
- **Frontend:** HTML + Vanilla JavaScript
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Registry:** Docker Hub

## โครงสร้างโปรเจกต์

```
compuroom/
├── backend/                 # Express REST API
│   ├── src/
│   │   ├── config/db.js     # PostgreSQL connection pool
│   │   ├── controllers/     # ตัวจัดการ route (business logic)
│   │   ├── routes/          # Express routers
│   │   ├── db/init.sql      # Schema + ข้อมูลตัวอย่าง
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/                # ชุดทดสอบ Jest/Supertest
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/                 # หน้าเว็บ HTML/JS
│   ├── public/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── app.js
│   ├── config.js.template    # แทนที่ค่า env ตอนรัน container (API_BASE_URL)
│   ├── docker-entrypoint.sh
│   └── Dockerfile
├── .github/workflows/ci.yml  # pipeline lint -> test -> build
├── docker-compose.yml         # สำหรับ development (3 services)
├── docker-compose.prod.yml    # สำหรับ production (ดึง image จาก Docker Hub)
└── README.md
```

## API Endpoints

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/health` | ตรวจสอบสถานะระบบ |
| GET | `/api/assets` | ดูรายการครุภัณฑ์ทั้งหมด |
| GET | `/api/assets/:id` | ดูครุภัณฑ์ตาม ID |
| POST | `/api/assets` | เพิ่มครุภัณฑ์ใหม่ |
| PUT | `/api/assets/:id` | แก้ไขข้อมูลครุภัณฑ์ |
| DELETE | `/api/assets/:id` | ลบครุภัณฑ์ |

### ฟิลด์ข้อมูลครุภัณฑ์

| ฟิลด์ | ชนิดข้อมูล | หมายเหตุ |
|---|---|---|
| `asset_code` | string | ห้ามซ้ำ, จำเป็นต้องกรอก |
| `brand` | string | จำเป็นต้องกรอก |
| `model` | string | จำเป็นต้องกรอก |
| `cpu` | string | ไม่บังคับ |
| `ram` | string | ไม่บังคับ |
| `room` | string | จำเป็นต้องกรอก |
| `status` | string | `active` \| `repair` \| `disposed` (ค่าเริ่มต้น `active`) |

## รันด้วย Docker Compose (แนะนำ)

```bash
git clone https://github.com/Worxchit/compuroom.git
cd compuroom
docker compose up -d --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

ข้อมูลจะถูกเก็บไว้ใน volume ชื่อ `db_data` ไม่หายแม้ปิด/เปิด container ใหม่

## รันแบบ Production (ดึง image จาก Docker Hub)

```bash
docker compose -f docker-compose.prod.yml up -d
```

ดึง image ที่ build ไว้แล้วมาใช้แทนการ build จาก source:

- Backend: [`kanompungz/compuroom-api`](https://hub.docker.com/r/kanompungz/compuroom-api) (tag: `latest`, `v1.0.0`)
- Frontend: [`kanompungz/compuroom-web`](https://hub.docker.com/r/kanompungz/compuroom-web) (tag: `latest`, `v1.0.0`)

## รันโดยไม่ใช้ Docker

**Backend**

```bash
cd backend
cp .env.example .env   # แก้ค่า PG* ให้ชี้ไปที่ PostgreSQL ของเครื่องตัวเอง
npm install
npm run dev
```

**Frontend**

เปิด `frontend/public` ด้วย static file server ตัวไหนก็ได้ (เช่น `npx http-server frontend/public`) และตรวจสอบให้ `config.js` ตั้งค่า `window.API_BASE_URL` ชี้ไปที่ backend ให้ถูกต้อง

## Tests & Linting

```bash
cd backend
npm run lint   # ESLint
npm test       # Jest + Supertest
```

## CI/CD Pipeline

ทุกครั้งที่มีการ push หรือเปิด pull request จะรัน GitHub Actions pipeline 3 ขั้นตอนตามลำดับ:

1. **Lint** — ตรวจสอบโค้ดด้วย ESLint ใน `backend/src`
2. **Test** — รันชุดทดสอบ Jest/Supertest (6 test cases ครอบคลุม health check และ CRUD ครุภัณฑ์)
3. **Build** — build Docker image ทั้ง backend และ frontend

## Git Workflow

- `main` — branch หลักสำหรับ release ที่เสถียร
- `develop` — branch สำหรับรวมงานระหว่างพัฒนา
- `feature/*` — branch แยกตามฟีเจอร์ ทำเสร็จแล้ว merge เข้า `develop` ผ่าน Pull Request

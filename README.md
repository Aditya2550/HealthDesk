# 🏥 HealthDesk - Doctor Appointment Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Express](https://img.shields.io/badge/Backend-Express.js-lightgrey)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB)
![Node](https://img.shields.io/badge/Runtime-Node.js-green)

> A full-stack Doctor Appointment Management System built with the MERN Stack as part of the Advanced Database Management System (ADBMS) Mini Project.

---

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)

---

## 📌 About

**HealthDesk** is a web-based Doctor Appointment Management System that allows patients to book appointments with doctors, doctors to manage their schedules, and admins to oversee the entire system.

This project was built as a Mini Project for the **Advanced Database Management System (ADBMS)** lab, demonstrating core database concepts like CRUD operations, relationships, aggregation pipelines, and multi-document transactions.

---

## ✨ Features

### 👤 Patient
- Register and login securely
- Browse available doctors
- Book appointment slots
- View and cancel appointments

### 👨‍⚕️ Doctor
- Login to personal dashboard
- View assigned appointments
- Update appointment status

### 🔑 Admin
- Add, update, delete doctors
- Manage all appointments
- View system statistics

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI Framework |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Axios | API calls |
| Context API | State Management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB Atlas | Cloud Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |

---

## 📁 Project Structure

```bash
healthdesk/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   └── slotController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   └── Slot.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── slotRoutes.js
│   └── server.js
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── App.jsx
└── README.md
```


## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/healthdesk.git
cd healthdesk
```

**2. Setup Backend**
```bash
cd server
npm install
```

**3. Create `.env` file in `/server`**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthdesk
JWT_SECRET=your_jwt_secret_key
```

**4. Run Backend**
```bash
npm run dev
```

**5. Setup Frontend**
```bash
cd ../client
npm install
npm start
```

---

## 🔌 API Routes

### Auth
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Doctors
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/doctors` | Get all doctors | Public |
| POST | `/api/doctors` | Add a doctor | Admin |
| PUT | `/api/doctors/:id` | Update doctor | Admin |
| DELETE | `/api/doctors/:id` | Delete doctor | Admin |

### Slots
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/slots/:doctorId` | Get doctor slots | Public |
| POST | `/api/slots` | Add a slot | Admin |

### Appointments
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/appointments` | Get appointments | Private |
| POST | `/api/appointments/book` | Book appointment | Patient |
| PUT | `/api/appointments/:id` | Update status | Doctor/Admin |
| DELETE | `/api/appointments/:id` | Cancel appointment | Patient |

---

## 🗃️ Database Schema

### User
```json
{
  "name": "String",
  "email": "String",
  "password": "String (hashed)",
  "role": "admin | doctor | patient",
  "phone": "String",
  "gender": "male | female | other",
  "specialization": "String (doctor only)",
  "experience": "Number (doctor only)",
  "fees": "Number (doctor only)"
}
```

### Appointment
```json
{
  "patientId": "ObjectId → User",
  "doctorId": "ObjectId → User",
  "slotId": "ObjectId → Slot",
  "status": "pending | confirmed | completed | cancelled",
  "notes": "String"
}
```

### Slot
```json
{
  "doctorId": "ObjectId → User",
  "date": "Date",
  "time": "String",
  "isBooked": "Boolean"
}
```

<!-- ---

## 👨‍💻 Developer

**Aditya** — Solo Developer
- GitHub: [@yourusername](https://github.com/yourusername)

--- -->

## 📄 License
This project is for educational purposes as part of ADBMS Mini Project.

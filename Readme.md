# 🏝️ PH Tour Management System – Backend  

🔗 **Live API Base URL:** [https://backend-ph-tour-management-system-eight.vercel.app/](https://backend-ph-tour-management-system-eight.vercel.app/)  

## 🚀 Project Overview
The **PH Tour Management System** is a comprehensive backend service that powers a tour booking platform for Bangladesh. It supports **user authentication**, **tour listings**, **bookings**, **payments**, and **admin management** with role-based access control.  
This backend is built with **Node.js, Express.js, MongoDB, and Redis**, and is designed for **performance, scalability, and security**.

---

## 🛠 Technologies Used

### **Backend**
- **Node.js & Express.js** – High-performance REST API framework.
- **TypeScript** – Strong typing for maintainable code.
- **MongoDB** – NoSQL database for storing users, tours, and bookings.
- **Redis** – Fast in-memory storage for OTPs and caching.
- **JWT (JSON Web Token)** – Authentication and authorization.
- **Passport.js** – Local and Google OAuth authentication.
- **Cloudinary** – Image storage and management.
- **Multer** – File uploads.
- **SSLCommerz** – Payment gateway integration.

---

## 🌟 Key Features

1. **Secure User Authentication**
   - Email/password and Google login.
   - OTP verification during registration.
   - JWT-based session handling.

2. **Tour Management**
   - Create, update, delete, and view tours.
   - Tour types, categories, and filtering.

3. **Booking System**
   - Tour bookings with selected dates.
   - Booking status management (Pending, Confirmed, Cancelled).
   - View booking history.

4. **Payment Integration**
   - SSLCommerz payment gateway.
   - Payment verification via IPN.
   - Automatic booking status updates.

5. **Admin Features**
   - Manage users, bookings, and tours.
   - Approve or reject guides.
   - Assign guides to tours.

6. **Statistics Dashboard**
   - Bookings, users, payments, and tours statistics.

7. **Performance & Security**
   - Response time under 500ms for most requests.
   - Scalable architecture with horizontal scaling support.
   - Role-Based Access Control (RBAC).

---

## 📦 Core Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `express` | ^5.1.0 | Web server framework |
| `mongoose` | ^8.16.3 | MongoDB ODM |
| `redis` | ^5.7.0 | Caching and OTP storage |
| `bcryptjs` | ^3.0.2 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | Authentication |
| `passport` | ^0.7.0 | Authentication middleware |
| `passport-google-oauth20` | ^2.0.0 | Google OAuth |
| `multer` | ^2.0.2 | File uploads |
| `cloudinary` | ^1.41.3 | Image hosting |
| `nodemailer` | ^7.0.5 | Email sending |
| `pdfkit` | ^0.17.1 | PDF generation |
| `zod` | ^4.0.5 | Schema validation |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |

---

## 🔗 API Modules & Endpoints

### **Authentication**
- `POST /api/v1/auth/login` – Login
- `POST /api/v1/auth/logout` – Logout
- `POST /api/v1/auth/refresh-token` – Refresh JWT
- `POST /api/v1/auth/set-password` – Set password
- `POST /api/v1/auth/forgot-password` – Request password reset
- `POST /api/v1/auth/reset-password` – Reset password

### **OTP**
- `POST /api/v1/otp/send` – Send OTP
- `POST /api/v1/otp/verify` – Verify OTP

### **Users**
- `POST /api/v1/user/register` – Register user
- `GET /api/v1/user/me` – Get current user
- `PATCH /api/v1/user/:id` – Update user

### **Admin**
- `GET /api/v1/user` – Get all users
- `GET /api/v1/guide` – Get all guides
- `POST /api/v1/guide/approve/:guideId` – Approve guide

### **Tours**
- `POST /api/v1/tour/create-tour-type` – Create tour type
- `GET /api/v1/tour/tour-types` – Get tour types
- `POST /api/v1/tour/create` – Create tour
- `GET /api/v1/tour` – Get all tours
- `PATCH /api/v1/tour/:id` – Update tour
- `DELETE /api/v1/tour/:id` – Delete tour

### **Bookings**
- `POST /api/v1/booking` – Create booking
- `GET /api/v1/booking/my-bookings` – My bookings
- `PATCH /api/v1/booking/:bookingId/status` – Update booking status

### **Payments**
- `POST /api/v1/payment/init-payment/:paymentId` – Initialize payment
- `GET /api/v1/payment/ipn` – Verify payment
- `GET /api/v1/payment/stats` – Payment stats

### **Statistics**
- `GET /api/v1/stats/booking` – Booking stats
- `GET /api/v1/stats/payment` – Payment stats
- `GET /api/v1/stats/user` – User stats
- `GET /api/v1/stats/tour` – Tour stats

---

## 🖼️ System Architecture
- **Frontend:** React/Next.js (separate project)
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB Atlas
- **Cache:** Redis Cloud
- **Auth:** JWT + OTP + Google OAuth
- **Payments:** SSLCommerz
- **Hosting:** Vercel, AWS, or DigitalOcean

---

## 🏗 Running the Project Locally

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/backend_ph_tour_management_system.git
cd backend_ph_tour_management_system
npm install
npm run dev

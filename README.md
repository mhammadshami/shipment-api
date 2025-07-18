# 📦 Shipping Management System API

**Built with NestJS, Prisma, PostgresSQL, JWT Authentication, Swagger**

---

## Project Description

An advanced REST API for managing shipping API:

- User management with roles (Admin, Manager, Driver, Client)
- Shipments CRUD operations
- Driver assignments to shipments
- Shipment tracking with history
- Invoice generation
- Access control with JWT + Roles
- Dashboard statics and insights

---

## 🚀 Getting Started

### Installation
```bash
git clone https://github.com/mhammadshami/shipment-api.git
cd shipment-api
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```
### Environment Variables
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/shipping_db
JWT_SECRET=your_jwt_secret
```

---

## 🔐 Authentication & Authorization
- ✅ Access Token + Refresh Token sytem
- ✅ Role-Based Access Control with Guards
- ✅ Protected Endpoints

---

## 📖 API Documentation (Swagger)
Access via:
``` 
http://localhost:3000/api-docs
```
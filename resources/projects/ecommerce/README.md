# 🛍️ E-Commerce Backend API

A full-featured e-commerce backend built with Node.js, Express, and PostgreSQL. Designed for teaching backend development, covering authentication, payment processing, and order management.

## 🚀 Features

### **1. User Management**
- ✅ **JWT Authentication**  
- ✅ **Email OTP Verification** (Registration/Password Reset)  
- ✅ **Role-Based Access Control** (Customer, Admin)  
- ✅ **Profile Management** (CRUD Operations)  

### **2. Product Catalog**
- ✅ **Product CRUD** (Create, Read, Update, Delete)  
- ✅ **Category Management**  
- ✅ **Inventory Tracking** (Real-time Stock Updates)  
- ✅ **Search & Filtering** (Full-Text Search, Price Range)  
- ✅ **Pagination & Sorting**  

### **3. Cart & Order System**
- 🛒 **Cart Management** (Add/Remove Items)  
- 💳 **Checkout Flow** (Idempotent API Design)  
- 📦 **Order State Machine**  (Pending → PROCESSING → SHIPPED → DELIVERED/CANCELLED)


### **4. Payment Integration**
- 💰 **Stripe Hosted Checkout** (PCI-Compliant)  
- 🔔 **Webhook Handling** (Payment Status Updates)  

### **5. Notifications**
- 📧 **Transactional Emails** (Order Confirmations)  
- ⚠️ **Admin Alerts** (Failed Payments)  

### **6. DevOps Ready**
- 📊 **Logging** (ELK Stack)  
- 🚨 **Monitoring** (Prometheus/Grafana)  

---

## 🛠️ Tech Stack
| Component       | Technology       |
|-----------------|------------------|
| **Backend**     | Node.js, Express |
| **Database**    | MySQL, Prisma    |
| **Auth**        | JWT, Bcrypt      |
| **Caching**     | Redis            |
| **Payments**    | Stripe API       |
| **Emails**      | SendGrid/Mailgun |
| **Search**      | Elasticsearch    |

---

## 📂 Project Structure
```bash
prisma/
src/
├── config/       # Configuration files
├── controllers/  # Route handlers
├── errors/       # Custom error classes
├── middlewares/  # Auth, error handling
├── models/       # Database models
├── routes/       # API endpoints
├── services/     # Business logic
├── utils/        # Helpers (API responses)
└── validations/  # Request validation
tests/        # Integration/unit tests
```


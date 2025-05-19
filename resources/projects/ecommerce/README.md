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
- 📧 **Transactional Emails** (Order Confirmations, Order Shipped)  
- ⚠️ **Admin Notifications** (Order Paid)  

### **6. DevOps Ready**
- 📦 **Dockerize the app** (Dockerfile)
- 📊 **Logging & Monitoring** (ELK Stack)

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

## 🚀 Getting Started

### 🐳 Docker Setup

1. **Build and Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access Services**
   - Application: http://localhost:3000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379
   - Kibana (optional): http://localhost:5601

3. **Development Mode**
   For development with hot-reloading:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up
   ```

4. **Stop Services**
   ```bash
   docker-compose down
   ```

### 📦 Local Setup (Alternative)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

3. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the Application**
   ```bash
   npm run dev
   ```

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


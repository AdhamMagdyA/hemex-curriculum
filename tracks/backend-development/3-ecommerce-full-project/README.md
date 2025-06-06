# Level 3: E-commerce Full Project

## Overview
This level guides students through building a complete e-commerce application, applying all previously learned concepts in a real-world scenario.

## Prerequisites
- Completion of Level 2
- Strong understanding of Node.js
- Experience with databases and APIs

## Level Objectives
By the end of this level, students will:
- Build a full e-commerce platform
- Implement advanced backend features
- Handle complex business logic
- Deploy and maintain the application

# Teaching steps (to be converted into lessons):

## 📚 1: Understanding Client Needs
When working with clients you will need to understand what they need for their project. Interviewing them will help you understand their needs, and based on that we can create the user stories to help us list the features we need for each user of the system.

here is an example of user stories:

### 👥 User Stories

#### Authentication & User Management
1. As a customer, I want to register with email/OTP so I can access my account securely
2. As a user, I want to log in with JWT tokens so I can access protected endpoints
3. As an admin, I want to create users and assign them roles so I can restrict sensitive operations
4. As a user, I want to update my profile so I can keep my information current

#### Product Catalog
5. As a customer, I want to browse products so I can shop and buy them  
6. As a customer, I want to filter by category/price so I can find relevant items
7. As an admin, I want to CRUD product operations so I can manage inventory

#### Cart & Orders
9. As a customer, I want a persistent cart so I can save items for later  
10. As a customer, I want to checkout idempotently so I avoid duplicate charges
11. As an admin, I want to view all orders so I can manage fulfillment

#### Payments
13. As a customer, I want to have the option to pay online

#### Notifications
15. As a customer, I want order confirmation emails so I have purchase records
16. As an admin, I want payment failure alerts so I can follow up promptly

---

then we can translate the user stories into real features in our app:
See the [project README](../resources/projects/ecommerce/README.md) for full feature details.

## 📚 2: Building the ERD
Based on the features build the ERD step by step with students
[View the database schema](../../../resources/projects/ecommerce/docs/schema.dbml)
![Database Schema Diagram](../../../resources/projects/ecommerce/docs/ecommerce_subdb.png)

## 📚 3: Building the schema as Prisma shcema
setup the project structure of the nodejs app and add the prisma schema

### Prisma Schema

1. **Initialize Prisma**:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Configure Database Connection**:
   Edit `.env` with your database URL:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/db_name"
   ```

3. **Define Models**:
   Add models to `prisma/schema.prisma` based on your ERD
   (Example: User, Product, Order models with relations)

4. **Generate Client**:
   ```bash
   npx prisma generate
   ```

5. **First Migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Apply to Production**:
   ```bash
   npx prisma migrate deploy
   ```

explain the difference between production and dev migrate
(explain migrations in general)

7. **View Data**:
   ```bash
   npx prisma studio
   ```

Key Points:
- Always run `prisma generate` after schema changes
- Use `migrate dev` for development, `migrate deploy` for production
- The schema.prisma file is the single source of truth for your database structure

## 📚 4: Building the Auth Functionalities

1. **login and registration**
use jwt to generate tokens

2. **add password encryption using bcrypt**

3. **add API validation with joi**

4. **add email verification**
- prepare the verify-email endpoint that will be used to verify the user's email
- prepare an email service to send verification emails
- complete flow of sending emails that direct user to the verify-email
- don't forget to go through the email configurations (.env variables)
- prepare a seperate folder that contains html templates for email verification or verification error

5. **add password reset**
- using speakeasy to generate OTP
- prepare the request-password-reset endpoint that will be used to request a password reset
- prepare the verify-reset-otp endpoint that will be used to verify the OTP
- prepare the reset-password endpoint that will be used to reset the password based on the resetVerified, resetVerifiedExpiry

**Challenge**: add a rate limiter to limit the OTP requests

6. **add user profile management**
7. **add user CRUD for admin to manage**


## 📚 5: Building the User CRUD Operations
1. **add user profile update and get**

2. **add user CRUD for admin to manage**

- ***side activity***: create a script that lists all endpoints existing in the express app using express-list-endpoints

## 📚 6: Building the Product & Category functionalities

1. **add product CRUD for admin to manage**

2. **add product and category view routes for customer to manage**

- see product and category controller in the project files

3. **validate product and category endpoints**
- create validation schemas using joi
- add validation middleware
- apply validation middleware to the endpoints

***challenge***: make the students detect and handle edge cases that produce error like product or category not found or unique field is being duplicated in db

4. **add functionalities to facilitate navigation**
- pagination with introducting the concepts of limit and skip
- sorting by any of the products' fields
- filtering by category id and a range of price (minPricea and maxPrice)

5. **add search functionality**
- search by name and description of the product

## 📚 7: Cart and Ordering scenario
- build a sequence diagram that shows exaclty how the scenario of ordering a product should work
![Ordering Sequence Diagram](../../../resources/projects/ecommerce/docs/ordering_products_sequence_diagram.png)

- build a stat machine diagram to introduce the concepts of state machine and how to track an entity's states
![Ordering State Machine Diagram](../../../resources/projects/ecommerce/docs/order_states.png)

- begin by building the cart management APIs add to cart, remove from cart, and clear cart

- build the order management APIs checkout, get orders, update order status (without payment for now)

## 📚 8: Building the Payment functionality

- register an account to stripe and adding the environment variables

- create the paymentService

- edit the checkout api to handle payment service inside of it

- add an api for paying an old (pending) order

- now the admin can change the status of the order after the payment is done as needed

- implemenet a webhook to store payment data info after completed (go through stripe webhooks)

- use ngrok to test the webhook

- don't use the secret signature of the webhook because it introduces errors and might confuse the students (will look into it again because it's not a good practice)

## 📚 9: Notifications

- create a service that stores notifications in the db and send them through email

- use it in the payment webhook to notify the admin & customer about the payment

- use it in the order update to notify the user about the delivery


## 📚 10: Dockerizing the app

- introduction about docker and explain the docker concepts

- dockerize the app

- deploy the app to a free cloud platform like gcp or aws

# Golden Tower

A full-stack e-commerce platform for Golden Tower, designed for managing and selling tiles, ceramics, and building materials.

The platform provides a complete shopping experience for customers while offering administrative tools for managing products, categories, brands, users, orders, payments, content, and store settings.

---

## Overview

Golden Tower is built as a full-stack web application with a separate frontend and backend architecture.

The system includes:

* Customer authentication with phone number and OTP
* JWT-based authentication
* Role-based access control
* Product and category management
* Brand management
* Shopping cart
* Guest and authenticated carts
* Address management
* Order management
* Online payment integration
* Article and content management
* Admin dashboard functionality
* Product image management
* Store settings
* Backend validation and business logic
* Database transactions for critical operations

---

## Architecture

The project is organized into two main applications:

```text
goldentower/
│
├── back_end/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── router/
│   ├── service/
│   ├── validator/
│   ├── utilities/
│   └── ...
│
├── front_end/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

### Application Flow

```text
                    Golden Tower
                         │
              ┌──────────┴──────────┐
              │                     │
          Frontend                Backend
              │                     │
              │        REST API     │
              └─────────────────────┘
                         │
                      MySQL
```

The frontend communicates with the backend through RESTful APIs.

The backend is responsible for authentication, authorization, validation, business logic, database operations, and payment processing.

---

## Tech Stack

### Frontend

* React
* JavaScript
* REST API
* Responsive UI
* Client-side state management
* API integration

### Backend

* Node.js
* Express.js
* Sequelize
* MySQL
* JWT
* OTP Authentication
* express-validator
* Multer
* Axios
* ZarinPal

### Architecture

* RESTful API
* Service-based business logic
* Role-based access control
* Database transactions
* UUID-based public resource identification

---

## Core Features

### Authentication

Users authenticate using their phone number and OTP instead of traditional passwords.

```text
Phone Number
     ↓
Request OTP
     ↓
Verify OTP
     ↓
Generate JWT
     ↓
Authenticated User
```

JWT tokens are used to protect authenticated resources and identify users across API requests.

---

### Role-Based Access Control

The system separates access based on user roles and permissions.

Protected administrative resources require authentication and appropriate authorization.

---

### Product Management

Products can contain information such as:

* Name
* Model
* Description
* Price
* Original price
* Discount
* Stock
* Category
* Brand
* Images
* Size
* Featured status
* Product specifications

Product availability, pricing, and stock are validated on the backend.

---

### Categories & Brands

Products can be organized through categories and brands.

This allows the platform to provide structured product browsing and administration.

---

## Shopping Cart

The platform supports both guest and authenticated shopping carts.

### Guest Cart

Guest cart information can be maintained locally on the client.

### Authenticated Cart

Authenticated users have their cart stored in the backend database.

When required, cart data can be synchronized between the client and the authenticated user's account.

The backend revalidates product prices and stock during cart operations.

---

## Address Management

Authenticated users can manage their delivery addresses.

When an order is created, the selected address is stored as part of the order data.

This creates an address snapshot so that future changes to the user's address do not modify historical orders.

---

## Order Management

The order system manages:

* Customer information
* Order items
* Product references
* Quantities
* Unit prices
* Total amounts
* Delivery address
* Order status
* Payment status

### Order Flow

```text
Cart
 ↓
Validate Products
 ↓
Validate Stock
 ↓
Calculate Total
 ↓
Create Order
 ↓
Create Order Items
 ↓
Payment
 ↓
Payment Verification
 ↓
Update Order
 ↓
Update Stock
 ↓
Complete Purchase
```

All important calculations are performed on the backend rather than being trusted from the frontend.

---

## Online Payment

The platform integrates with **ZarinPal** for online payments.

The payment workflow is handled by the backend to ensure that the final amount and order state are validated securely.

```text
Frontend
   ↓
Create Order
   ↓
Backend
   ↓
Payment Request
   ↓
ZarinPal
   ↓
Payment Gateway
   ↓
Callback
   ↓
Payment Verification
   ↓
Update Order
```

---

## Content Management

The platform includes content management functionality for store articles and related content.

Content can be managed through administrative endpoints and can have different publication states.

---

## Image Management

Product images are handled by the backend using file upload middleware.

Supported image formats include:

```text
JPG
JPEG
PNG
WEBP
```

Uploaded files use generated filenames to reduce naming conflicts and predictable file paths.

---

## Database

The application uses **MySQL** as its primary relational database with **Sequelize** as the ORM.

The database contains entities for areas such as:

```text
Users
Products
Categories
Brands
Carts
Cart Items
Addresses
Orders
Order Items
Payments
Articles
Settings
```

### Main Relationships

```text
User
 ├── Cart
 ├── Address
 └── Order
      ├── OrderItem
      │     └── Product
      └── Payment

Category
 └── Product

Brand
 └── Product

Cart
 └── CartItem
       └── Product
```

---

## API

The backend exposes RESTful endpoints for the main application modules.

Examples include:

```text
/api/auth
/api/products
/api/categories
/api/brands
/api/carts
/api/addresses
/api/payment
/api/articles
/api/settings
/api/admin
```

Authenticated endpoints use JWT authentication:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Backend Architecture

The backend separates HTTP handling, business logic, validation, and data access.

```text
Request
  ↓
Router
  ↓
Middleware
  ↓
Validator
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MySQL
```

This structure helps keep business logic independent from HTTP controllers and makes the application easier to maintain and extend.

---

## Frontend Architecture

The frontend is responsible for:

* User interface
* Product browsing
* Product details
* Authentication flows
* Shopping cart
* Checkout
* Order interaction
* API communication
* Responsive user experience

The frontend does not directly access the database and communicates with the backend exclusively through the API.

---

## Security

Security considerations include:

* JWT authentication
* Role-based authorization
* OTP authentication
* Input validation
* Resource ownership validation
* Backend-side price calculation
* Stock validation
* File validation
* File size restrictions
* Database transactions
* Protected administrative endpoints
* Environment-based secret management

Sensitive credentials and API keys are stored in environment variables and should never be committed to the repository.

---

## Installation

### Requirements

* Node.js 18+
* MySQL 8+
* npm

### Clone Repository

```bash
git clone https://github.com/Mohammad5831/goldentower.git
cd goldentower
```

---

### Backend Setup

```bash
cd back_end
npm install
```

Create a `.env` file and configure the required environment variables:

```env
PORT=3000

DB_NAME=your_database
DB_USER=your_user
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=3306

JWT_SECRET=your_secret

MERCHANT_ID=your_merchant_id
CALLBACK_URL=your_callback_url
```

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

---

### Frontend Setup

Open a second terminal:

```bash
cd front_end
npm install
```

Configure the frontend API URL according to your environment.

Then start the frontend using the project's configured development script.

---

## Development Workflow

A typical local development environment consists of:

```text
Frontend
   │
   │ HTTP / REST API
   ▼
Backend
   │
   │ Sequelize
   ▼
MySQL
```

The frontend and backend can be developed independently while communicating through a clearly defined API layer.

---

## Project Structure

```text
goldentower/
│
├── back_end/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── router/
│   ├── service/
│   ├── validator/
│   ├── utilities/
│   └── ...
│
├── front_end/
│   ├── src/
│   ├── public/
│   └── ...
│
├── README.md
└── .gitignore
```

---

## Development Principles

The project follows several core principles:

* Keep frontend and backend responsibilities separated.
* Keep controllers lightweight.
* Keep business logic inside services.
* Validate external input.
* Never trust client-side prices or stock values.
* Validate resource ownership.
* Use transactions for critical multi-step operations.
* Protect administrative resources.
* Keep secrets outside the repository.
* Keep API contracts between frontend and backend explicit.

---

## Future Improvements

Potential improvements include:

* Advanced inventory management
* Product reviews and ratings
* Wishlist
* Coupon and discount system
* Shipping management
* Refund management
* Notification system
* Admin analytics
* Background jobs
* Caching
* Advanced reporting
* Improved search and filtering

---

## Project Status

Golden Tower is a full-stack e-commerce platform combining a React-based frontend with a Node.js/Express backend and MySQL database.

The project demonstrates the implementation of a complete e-commerce workflow from product discovery and authentication to cart management, order processing, and online payment.

---

## License

This project is proprietary software developed for Golden Tower.

The source code is provided for portfolio and development reference purposes only. Unauthorized copying, modification, distribution, or commercial use is not permitted without permission.

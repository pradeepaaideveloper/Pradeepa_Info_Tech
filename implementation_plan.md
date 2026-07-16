# Pradeepa Info Tech - Web Application Implementation Plan

This document outlines the architecture, database schema, folder structure, API endpoints, user flows, and project milestones for building a production-ready web application for **Pradeepa Info Tech** (computer training institute & e-commerce store).

---

## Technical Architecture Overview

The system is designed with a decoupled frontend and backend:
- **Frontend**: A React application built with TypeScript and Tailwind CSS using Vite. It will include translation support (English/Tamil) via `react-i18next` and state management via React Context or a lightweight library.
- **Backend**: A FastAPI (Python) service that handles REST API requests, database operations via SQLAlchemy, authentication using JWT, PDF GST invoice generation, and AI chatbot inquiries.
- **Database**: A relational MySQL database storing information about users, students, courses, products, cart items, orders, reviews, and gallery items.
- **Storage**: Cloudinary integrated into the backend for image upload (courses and products).
- **Payment Integration**: Razorpay API and UPI deep-linking support.

---

## User Review Required

> [!IMPORTANT]
> Please review the database schema, especially table fields, and ensure they meet your business needs (e.g., GST rates, course status, payment verification details).
> We have designed GST calculation into the order items table with SGST, CGST, and IGST breakdowns.

> [!NOTE]
> For the AI Chatbot, we can implement an integration with Google's Gemini API (or a custom prompt engine) using an API key provided in the environment variables, falling back to a structured rule-based handler if the API key is not configured.

---

## Open Questions

1. **GST Calculation Rule**: Should all products have a flat 18% GST rate, or do specific stationery/accessory categories have different GST rates (e.g., 5%, 12%, 18%)? *Default plan: Support category-level or product-level GST percentage fields.*
2. **AI Chatbot Knowledge**: What specific queries should the AI chatbot prioritize? (e.g., course fees, duration, location, store timings, stock availability). *Default plan: Equip the chatbot with context about courses, store products, timings, and contact info.*
3. **SMS/WhatsApp Notifications**: Do you have a premium SMS/WhatsApp API gateway (like Twilio, Gupshup) or should we generate WhatsApp direct links for the user to send messages easily? *Default plan: Frontend generates pre-filled WhatsApp click-to-chat links, and backend handles email notifications via SMTP.*

---

## Proposed Changes

### Component 1: Database Schema

We will use SQLAlchemy models for defining the MySQL tables. Here is the relational schema:

```mermaid
erDiagram
    USERS ||--o| STUDENTS : "is_a"
    USERS ||--o{ CARTS : "has"
    USERS ||--o{ WISHLISTS : "has"
    USERS ||--o{ ORDERS : "places"
    COURSES ||--o{ STUDENT_COURSES : "enrolls"
    STUDENTS ||--o{ STUDENT_COURSES : "enrolled_in"
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered_in"
    PRODUCTS ||--o{ CART_ITEMS : "added_to"
    CARTS ||--o{ CART_ITEMS : "contains"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    USERS ||--o{ REVIEWS : "writes"
    COURSES ||--o{ REVIEWS : "about_course"
    PRODUCTS ||--o{ REVIEWS : "about_product"

    USERS {
        int id PK
        string email UNIQUE
        string password_hash
        string full_name
        string phone
        string role "admin / student / customer"
        datetime created_at
    }

    STUDENTS {
        int id PK
        int user_id FK
        string father_name
        date dob
        string gender
        string address
        string qualification
        string registration_no UNIQUE
        string status "active / completed / discontinued"
    }

    COURSES {
        int id PK
        string title
        string title_ta "Tamil title"
        string code UNIQUE
        string description
        string description_ta
        decimal price
        int duration_months
        string syllabus "JSON array"
        boolean is_active
        string image_url
    }

    STUDENT_COURSES {
        int id PK
        int student_id FK
        int course_id FK
        date enrollment_date
        decimal amount_paid
        string payment_status "pending / partially_paid / fully_paid"
        string status "enrolled / ongoing / completed"
    }

    PRODUCTS {
        int id PK
        string name
        string name_ta
        string description
        string description_ta
        string category "stationery / accessories / electronics"
        decimal price
        decimal gst_rate "e.g., 0.18"
        int stock_quantity
        string image_url
        boolean is_active
    }

    CARTS {
        int id PK
        int user_id FK
        datetime updated_at
    }

    CART_ITEMS {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
    }

    WISHLISTS {
        int id PK
        int user_id FK
        int product_id FK
    }

    ORDERS {
        int id PK
        int user_id FK
        string order_number UNIQUE
        decimal subtotal
        decimal gst_total
        decimal total_amount
        string payment_status "pending / paid / failed / refunded"
        string payment_method "upi / card / netbanking / cash"
        string razorpay_order_id
        string razorpay_payment_id
        string shipping_address
        string order_status "placed / processing / shipped / delivered / cancelled"
        datetime created_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
        decimal gst_rate
        decimal gst_amount
    }

    REVIEWS {
        int id PK
        int user_id FK
        int course_id FK "nullable"
        int product_id FK "nullable"
        int rating
        string comment
        boolean is_approved
        datetime created_at
    }

    GALLERY {
        int id PK
        string title
        string title_ta
        string image_url
        string category "infrastructure / events / training"
        datetime created_at
    }
```

---

### Component 2: Backend Folder Structure

We will lay out the FastAPI application modularly:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Environment configuration & settings
│   ├── database.py             # Database session manager & engines
│   ├── models/                 # SQLAlchemy Database Models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── student.py
│   │   ├── interaction.py      # Reviews, Gallery, Contact
│   ├── schemas/                # Pydantic schemas (Request/Response validation)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── student.py
│   │   └── interaction.py
│   ├── routers/                # API Routers (Endpoint mappings)
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── courses.py
│   │   ├── products.py
│   │   ├── students.py
│   │   ├── orders.py
│   │   ├── interactions.py
│   │   └── chatbot.py
│   ├── services/               # Business logic helpers
│   │   ├── auth_service.py     # JWT generation and validation
│   │   ├── payment_service.py  # Razorpay order processing
│   │   ├── invoice_service.py  # ReportLab PDF GST Invoice generation
│   │   ├── image_service.py    # Cloudinary image uploader
│   │   └── chatbot_service.py  # AI query execution
│   └── tests/                  # Integration and Unit Tests
│       ├── test_auth.py
│       ├── test_courses.py
│       └── test_products.py
├── requirements.txt
├── alembic.ini                 # DB Migrations configuration (optional/optional execution)
└── Dockerfile                  # Deployment configuration
```

---

### Component 3: Frontend Folder Structure

We will lay out the React + Vite + TS + Tailwind CSS application using standard practices:

```
frontend/
├── public/
│   ├── locales/                # Multi-language translations
│   │   ├── en/
│   │   │   └── translation.json
│   │   └── ta/
│   │       └── translation.json
│   └── favicon.ico
├── src/
│   ├── assets/                 # Images, logos, SVG files
│   ├── components/             # Reusable UI Components
│   │   ├── common/             # Navbar, Footer, Input, Button, Card, Dropdown
│   │   ├── shop/               # ProductCard, CartItem, OrderSummary
│   │   ├── academy/            # CourseCard, SyllabusAccordion
│   │   ├── dashboard/          # Sidebar, StatCard, ChartView
│   │   └── chatbot/            # ChatWidget, FloatingButton
│   ├── context/                # Context Providers
│   │   ├── AuthContext.tsx     # Global Authentication State
│   │   ├── CartContext.tsx     # Shopping Cart & Wishlist State
│   │   └── LanguageContext.tsx # Language switching state
│   ├── hooks/                  # Custom Hooks (useAuth, useCart, useApi)
│   ├── pages/                  # Page-level components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Courses.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── Store.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── StudentRegister.tsx
│   │   ├── StudentPortal.tsx   # Enrolled courses, payment receipt, status
│   │   ├── OrderTracking.tsx
│   │   ├── Contact.tsx
│   │   ├── Gallery.tsx
│   │   └── admin/              # Admin pages
│   │       ├── Dashboard.tsx
│   │       ├── CoursesManager.tsx
│   │       ├── ProductsManager.tsx
│   │       ├── StudentsManager.tsx
│   │       └── OrdersManager.tsx
│   ├── services/               # API clients
│   │   ├── api.ts              # Axios wrapper with interceptors
│   │   └── endpoints.ts        # Modularized API service calls
│   ├── utils/                  # Helper utilities (formatting, calculations)
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css               # Tailwind & global styles
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

### Component 4: Required APIs List

#### 1. Authentication & Users
- `POST /api/auth/register` - Register a standard customer.
- `POST /api/auth/login` - Login to receive JWT token.
- `GET /api/auth/me` - Get current authenticated user details.
- `PUT /api/auth/profile` - Update profile information.

#### 2. Courses & Student Registration
- `GET /api/courses` - Fetch active courses (supports query by language).
- `GET /api/courses/{id}` - Fetch details of a single course.
- `POST /api/courses` - Create course (Admin only).
- `PUT /api/courses/{id}` - Update course details (Admin only).
- `POST /api/students/register` - Submit student registration form & link to account.
- `GET /api/students/enrollments` - Fetch course enrollments for the student.
- `POST /api/students/enroll` - Enroll a student in a course (triggers manual/partial payment).
- `GET /api/admin/students` - View all registered students (Admin only).
- `PUT /api/admin/students/{id}/status` - Update enrollment status/payment (Admin only).

#### 3. E-commerce Store (Stationery & Accessories)
- `GET /api/products` - Fetch list of items (categories: stationery, accessories, electronics).
- `GET /api/products/{id}` - Fetch single product.
- `POST /api/products` - Create product (Admin only).
- `PUT /api/products/{id}` - Update product (Admin only).
- `DELETE /api/products/{id}` - Disable/delete product (Admin only).

#### 4. Cart & Wishlist
- `GET /api/cart` - Get user's active shopping cart items.
- `POST /api/cart/items` - Add item to cart.
- `PUT /api/cart/items/{id}` - Update quantity in cart.
- `DELETE /api/cart/items/{id}` - Delete item from cart.
- `GET /api/wishlist` - Get wishlist items.
- `POST /api/wishlist` - Toggle wishlist status for a product.

#### 5. Checkout & Orders
- `POST /api/orders` - Create an order (returns Razorpay Order ID or UPI payload).
- `POST /api/orders/verify-payment` - Confirm Razorpay payment signature & process order.
- `GET /api/orders` - View current user's order history.
- `GET /api/orders/{id}` - View specific order details.
- `GET /api/orders/{id}/invoice` - Generate and download PDF GST Invoice.
- `GET /api/admin/orders` - View all store orders (Admin only).
- `PUT /api/admin/orders/{id}/status` - Update delivery status (Admin only).

#### 6. Reviews, Gallery & Contact
- `GET /api/reviews` - Fetch approved reviews.
- `POST /api/reviews` - Post a rating & review (approved by default or pending admin toggle).
- `GET /api/gallery` - Fetch photos grouped by category.
- `POST /api/gallery` - Upload photos (Admin only).
- `POST /api/contact` - Submit contact form & trigger email notification.

#### 7. AI Chatbot
- `POST /api/chatbot/query` - NLP chatbot query matching courses, inventory, fees, timings.

---

### Component 5: User Flows

#### A. Student Flow (Course Registration & Learning)
1. **Explore**: Student visits Homepage -> navigates to **Computer Courses**.
2. **Switch Language**: Toggles between Tamil & English to read course details and syllabus.
3. **Register**: Clicks **Register Online** -> fills details (DOB, Qualification, Address, Phone, Photo).
4. **Portal**: Student is prompted to login or automatically create an account. They can check their dashboard showing enrollment status, course progress, and print fees receipt.

#### B. Customer Flow (E-commerce Purchase)
1. **Browse**: Customer visits Store page -> filters by "Stationery" or "Computer Accessories".
2. **Cart & Wishlist**: Adds items to cart/wishlist. Toggles wishlist state.
3. **Checkout**: Cart summary displays cost breakdown with CGST and SGST. Enters shipping details.
4. **Payment**: Selects Payment Method (Razorpay gateway popup or UPI QR Code scan).
5. **Success & Invoice**: Payment verification triggers confirmation, generates order number, sends email receipt, and makes the **GST PDF Invoice** available for download.
6. **Track**: Navigates to **Order Tracking** page using the order number to view delivery updates.

#### C. Admin Flow (Inventory & Student Management)
1. **Login**: Admin logs in via `/login` credentials (protected route).
2. **Dashboard**: Views visual reports on sales, new course enrollments, and inventory warnings (e.g. products with low stock).
3. **Course Manager**: Adds or updates courses, including the syllabus structure.
4. **Product/Inventory Manager**: Updates stock quantities, adds new stationery items, uploads pictures.
5. **Student Manager**: Approves online registrations, updates student course progress, marks payment completions.

---

## Project Milestones

- [ ] **Milestone 1: Project Setup & Core Configurations**
  - Setup Python virtual environment, install FastAPI packages.
  - Setup Vite + React + TS + Tailwind CSS frontend.
  - Configure PostgreSQL/MySQL connectivity and write database base structures.
  - Setup basic boilerplate layouts (Navbar, Footer, routing, i18next).

- [ ] **Milestone 2: Database Schema & Authentication System**
  - Implement SQLAlchemy models.
  - Setup JWT Token generation, authentication middleware, and registration/login endpoints.
  - Build AuthContext on the frontend with Login, Registration, and Profile settings pages.

- [ ] **Milestone 3: Course Catalog & Student Registration**
  - Build Course model APIs (Create, Read, Update).
  - Implement Student Registration form backend endpoints with data validation.
  - Build course presentation page (with English/Tamil translations) and student sign-up forms.
  - Set up student dashboard.

- [ ] **Milestone 4: E-Commerce Store (Products, Catalog, Cart, Wishlist)**
  - Implement Product API with categories (Stationery, Computer Accessories, Electronics).
  - Build local storage or synced database Cart & Wishlist features.
  - Design e-commerce store UI with filtering, search, and dynamic responsive cards.

- [ ] **Milestone 5: Checkout, Razorpay/UPI & GST Invoice Generation**
  - Build Order creation and item mapping backend tables.
  - Mock and integrate payment gateway (Razorpay API / UPI deep links).
  - Write PDF Invoice generation using python `reportlab` producing standard GST tax invoices (GSTIN, CGST, SGST breakdown).
  - Design checkout user interfaces, payment response handling, and order receipt pages.

- [ ] **Milestone 6: Portal Enhancements (Chatbot, Reviews, Gallery, Contact)**
  - Implement AI Chatbot route using Gemini SDK (or a comprehensive rule-based system for backup).
  - Build Student reviews catalog with admin moderation flag.
  - Build Gallery category filter and Contact page (email submission & direct click-to-WhatsApp link).

- [ ] **Milestone 7: Admin Dashboard Control Panel**
  - Build Admin visual summaries (total revenue, active students, low-stock items).
  - Create tables for managing courses, products (stock update), students (enrollment status), and orders (shipped/delivered).

- [ ] **Milestone 8: Final Testing, Polish & Deployment Guidelines**
  - Conduct integration tests for core modules (Auth, Cart, Checkout).
  - Write detailed configurations for deploying to Vercel (frontend), Render (backend), and Railway (MySQL).

---

## Verification Plan

### Automated Tests
We will write tests in the `backend/app/tests` folder:
- **Auth**: Test user sign-up, JWT generation, access control.
- **Store**: Test adding items to cart, order placement math (checking correct CGST, SGST calculations).
- **Course**: Test course creation and student enrollment verification.
- Run tests via `pytest`.

### Manual Verification
- **Language Toggling**: Toggle language switcher and verify all menu items, course descriptions, and store headings translate smoothly.
- **Cart flow**: Complete a mock transaction, download the generated PDF invoice, verify invoice layout has correct GSTIN details and alignment.
- **Responsive Layout**: Run local dev server, inspect with Chrome DevTools in Mobile, Tablet, and Desktop resolutions.
- **Chatbot interaction**: Message chatbot with "tell me about computer courses" and verify relevant course details are suggested.

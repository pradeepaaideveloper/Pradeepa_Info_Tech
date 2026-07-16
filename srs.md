# Software Requirements Specification (SRS)
## Project: Pradeepa Info Tech Web Application & POS System

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Pradeepa Info Tech integrated web application. This application includes an educational portal, an e-commerce platform for stationery and accessories, an in-store Point of Sale (POS) billing system, student management utilities, and an AI recommendation chatbot.

### 1.2 Scope
The application will serve as both a public-facing website and an internal business tool. It will facilitate:
- Online course listings, registrations, student portals, attendance tracking, fee receipts, digital student ID cards, and course completion certificates.
- Multi-category e-commerce catalog featuring search, cart, wishlist, coupon integration, and Razorpay/UPI payments.
- Cashier POS screen supporting high-speed barcode scanning, customer profile binding, and inventory updates.
- Real-time inventory tracking with supplier metrics, cost-margin calculations, and low-stock indicators.
- Automated email verifications, password resets, database backup jobs, and security audit logging.
- AI Chatbot supporting course and product recommendations based on user prompts.

### 1.3 Definitions, Acronyms, and Abbreviations
- **MSME**: Micro, Small & Medium Enterprises.
- **GST**: Goods and Services Tax (divided into CGST and SGST for local transactions, IGST for interstate).
- **POS**: Point of Sale.
- **PWA**: Progressive Web App.
- **JWT**: JSON Web Token (used for secure, stateless user sessions).
- **API**: Application Programming Interface.
- **SRS**: Software Requirements Specification.
- **Syllabus Accordion**: Expandable web component listing chapters, topics, and durations of a course.

### 1.4 Intended Audience
This document is written for business administrators of Pradeepa Info Tech, quality assurance testers, backend and frontend developers, and deployment engineers.

---

## 2. Overall Description

### 2.1 Product Perspective
The system is divided into two major components: a mobile-ready Single Page Application (React) acting as the client, and a scalable REST API (FastAPI) acting as the server.
- The client app works as both a public responsive storefront and a PWA capable of caching static shells for offline or low-connectivity access.
- The server processes all business logic, interacts with a MySQL instance, logs security events, and handles external APIs (Razorpay, Cloudinary, SMTP).

```
 +-------------------------------------------------------------------+
 |                       Client App (React, PWA)                     |
 |        Public Store & Academy  |  Student Portal  |  POS & Admin  |
 +----------------------------------+--------------------------------+
                                    | HTTPS / JSON
                                    v
 +-------------------------------------------------------------------+
 |                        API Server (FastAPI)                       |
 |    Auth  |  POS  |  E-Commerce  |  Academy  |  AI Chatbot  |  PDF |
 +----------------------------------+--------------------------------+
                                    | SQL Queries
                                    v
 +-------------------------------------------------------------------+
 |                          MySQL Database                           |
 +-------------------------------------------------------------------+
```

### 2.2 Product Functions
- **Storefront & POS**: Dual e-commerce checkout and physical store cash register, synchronizing inventory counts in real time.
- **Student Tracker**: Attendance logging, payment invoices, automatic PDF certificate generation with digital signature, and barcode-encoded ID cards.
- **Financial Registry**: Custom receipt layouts with automatic GST breakdown, purchase price margin tracker, and sales summaries.
- **Security Guard**: JWT validation, security audit logging for administrative edits, and verified signup cycles.

### 2.3 User Classes and Characteristics
1. **Guest**: Can browse course syllabi, search store inventory, read reviews, interact with the AI chatbot, and add items to a local shopping cart.
2. **Customer / Student**: Can verify accounts, complete checkout via online gateways, track orders, view enrolled courses, download PDF invoices, check attendance records, and download ID cards or completion certificates.
3. **Cashier**: Accesses the POS terminal, scans physical barcodes, enters customer contact numbers, accepts card/cash/UPI, and prints receipts.
4. **Admin**: Has full configuration access: course creator, product pricing/stock updater, supplier detail modifier, student attendance recorder, coupon creator, and system log inspector.

### 2.4 Design and Implementation Constraints
- **Hardware Integration**: The POS checkout interface must integrate with generic USB/Bluetooth barcode scanners operating via keyboard emulation.
- **Locale Support**: Complete localization (English and Tamil) must be switchable in real time without refreshing the active session state.
- **Database Architecture**: Must run reliably on standard MySQL configurations (compatible with Railway hosting).

---

## 3. System Features (Functional Requirements)

### 3.1 User Authentication & Profile Lifecycle
- **Req-1.1 (Register & Verify)**: Customers must register with their email, phone, and name. The system sends a verification link that expires in 24 hours. The account remains inactive for checkout/portal access until verified.
- **Req-1.2 (Secure JWT Login)**: Session tokens must use encrypted payloads containing user ID, role, and expiration (15-minute access, 7-day refresh).
- **Req-1.3 (Password Recovery)**: Users can request a secure reset email containing an encrypted, short-lived token (1 hour) to change their password securely.
- **Req-1.4 (Referrals)**: New users registering through a referral link get a sign-up coupon. Once they place their first order, the referrer's account is credited with a reward coupon.

### 3.2 Course & Academic Management
- **Req-2.1 (Online Course Listing)**: Public syllabus details, modules, durations, and course fees must display with Tamil translation toggles.
- **Req-2.2 (Student Enrollment)**: Enrolled students must supply registration metrics (photo, DOB, qualification, address).
- **Req-2.3 (Student Attendance)**: Teachers must be able to mark student attendance daily. Students can view their attendance logs directly on their dashboard.
- **Req-2.4 (Fee Records & CGST/SGST receipts)**: System must record course fee payments (full/partial), calculate appropriate tax values, and generate PDF fee receipts.
- **Req-2.5 (ID Card Generator)**: Generates a digital ID card (PDF) with the student's name, course, registration number, profile picture, and registration barcode.
- **Req-2.6 (Certificate Generator)**: Auto-creates a completion certificate (PDF) containing a unique QR verification code pointing to the site's verification portal.

### 3.3 Store & Point-of-Sale (POS) System
- **Req-3.1 (E-Commerce Store)**: Dynamic filters for "Stationery", "Accessories", and "Electronics". Includes product detail layouts, user wishlists, and cart synchronization.
- **Req-3.2 (POS Register Interface)**: Cashier page optimized for fast checkout, supporting search-by-barcode and auto-addition to cart.
- **Req-3.3 (Barcode Scans)**: The page must catch input from barcode readers (keyboard emulation) and add items instantly without manual keyboard typing.
- **Req-3.4 (GST Invoicing)**: Every POS sale or online order must generate a legally compliant invoice showing Pradeepa Info Tech's GSTIN, CGST, and SGST breakdowns.

### 3.4 Inventory Management
- **Req-4.1 (Cost Tracking)**: Products must save `purchase_price`, `selling_price`, and `margin_percent`. Changing purchase price or selling price must auto-calculate the target profit margin.
- **Req-4.2 (Low Stock Alerts)**: If product `stock_quantity` drops below the `min_stock_level` threshold, a visible alarm appears in the Admin Inventory dashboard.
- **Req-4.3 (Supplier Mapping)**: Track supplier names and contact numbers directly against product profiles for streamlined restock workflows.

### 3.5 AI Chatbot
- **Req-5.1 (Natural Interface)**: Dynamic floating chat widget responsive on mobile and desktop.
- **Req-5.2 (Course Advice)**: Analyzes questions like "Which programming course is best for beginners?" and highlights Python or office suites.
- **Req-5.3 (Product Recommendations)**: Offers store suggestions when user asks about writing stationery, mouse models, or cables, linking directly to the product detail page.

### 3.6 System Auditing & Backups
- **Req-6.1 (Security Audit Logs)**: Every creation, modification, or deletion of courses, products, students, or coupon settings must write to the `audit_logs` table (detailing cashier/admin ID, IP, user-agent, and changed attributes).
- **Req-6.2 (Automated Backups)**: A nightly script must back up the database schema and values, compressing the file and writing it to a secure storage folder.

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- **Responsive Layout**: Designed using CSS flexbox/grid for seamless display on desktops, tablets, and smartphones.
- **PWA Capabilities**: Service worker implementation for prompt installation on home screens, offline caching of primary pages, and asset pre-caching.
- **Analytics Visuals**: Integrating Chart.js or Recharts to visualize sales curves and course registration counts in the Admin view.

### 4.2 Hardware Interfaces
- **USB/Bluetooth Barcode Readers**: Web application must read standard keyboard wedge inputs from scanners and parse the scanned sequence as a product search query.

### 4.3 Software Interfaces
- **Payment Gateway (Razorpay)**: Secure JS SDK script load on client, backend order generation, and secure callback signature validation.
- **Cloudinary Storage**: Multipart file transfer for student photos and product assets.
- **FastAPI-Mail Service**: SSL/TLS integration with SMTP configurations for system emails.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Response Time**: REST API endpoints must reply within 300ms for common database queries.
- **Optimization**: Frontend bundle sizes must be minified, assets optimized, and database tables indexed on `barcode`, `email`, `order_number`, and `registration_no`.

### 5.2 Security
- **Data Protection**: Store passwords using strong, modern hashing algorithms (e.g., bcrypt).
- **CORS Config**: REST API must configure specific domain white-listing (Vercel deployment) to block unauthorized domains.
- **Input Validation**: Complete Pydantic payload checks on the backend to block SQL injection and cross-site scripting (XSS) vectors.

### 5.3 Reliability
- **Backup Integrity**: Automated backup cycles must test database restore scripts weekly.
- **Offline Reliability**: The app's service worker must handle transient network drops gracefully, retaining checkout items in localStorage.

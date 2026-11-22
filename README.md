# FixMate – Smart Device & Home Appliance Repair Service Platform

FixMate is a full-stack web application that connects customers with technicians for smart device and home appliance repair services. Customers can browse services, submit repair requests, track booking progress, and make payments. Technicians can manage their services and repair requests, while administrators manage users, services, bookings, and payments.

## Live Website

**Live URL:** https://ass9-client.vercel.app/

## Project Repositories

- **Client Repository:** https://github.com/muntasirfahimgeorge/ass9-client
- **Server Repository:** https://github.com/muntasirfahimgeorge/ass9-server

## Main Features

### Customer
- Register and sign in securely.
- Browse available repair services.
- Search, filter, and sort services.
- View service details.
- Submit repair booking requests.
- Track booking status.
- View booking and payment history.
- Pay for completed repair services through Stripe Checkout.
- Manage profile information.

### Technician
- Access the technician dashboard.
- Create and manage repair services.
- Manage incoming booking requests.
- Accept or reject repair requests.
- Update repair progress.
- Mark repair jobs as completed and set the final amount.

### Administrator
- Access the admin dashboard.
- Manage users and user roles.
- Approve and manage repair services.
- Manage bookings.
- Monitor payment transactions.

## Technology Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Better Auth
- MongoDB
- Recharts
- Lucide React
- Shadcn-related UI components

### Backend
- Node.js
- Express.js
- MongoDB
- JWT-based role authorization
- Stripe Checkout
- ImgBB image hosting

## Local Installation

### 1. Clone the client repository

```bash
git clone https://github.com/muntasirfahimgeorge/ass9-client.git
cd ass9-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the client project root and configure the required environment variables.

Refer to the project's `.env.example` file for the exact variable names and required configuration.

Do not commit private API keys, database credentials, authentication secrets, or payment secrets to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build for production

```bash
npm run build
```

### 6. Run the production server

```bash
npm run start
```

## Backend Setup

The backend source code is maintained in a separate repository:

https://github.com/muntasirfahimgeorge/ass9-server

Clone the server repository, install its dependencies, configure its environment variables using its `.env.example` file, and start the backend according to its project scripts.

## Authentication & User Roles

FixMate supports three user roles:

- **Customer:** Books repair services and makes payments.
- **Technician:** Provides repair services and manages assigned jobs.
- **Admin:** Manages the platform and its users, services, bookings, and payments.

Role-based authorization protects dashboard features and restricted operations.

## Payment Integration

FixMate integrates Stripe Checkout in test mode.

Customers can proceed to payment after their repair job has been completed and the final amount has been set.

## Test Accounts

Working Admin, Technician, and Customer test account credentials are provided separately for assignment evaluation.

For security reasons, passwords and private credentials are not published in this public repository.

## Project Purpose

The purpose of FixMate is to provide a convenient and organized platform for customers seeking device and home appliance repair services, while helping technicians manage their repair work and administrators oversee the complete service workflow.
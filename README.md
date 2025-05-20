# Attendance Management System

A modern, full-stack web application for managing and analyzing student attendance records. This system provides educators and administrators with powerful tools to track, analyze, and report on student attendance efficiently.

---

## Features

- **User Authentication**: Secure login for authorized access.
- **Dashboard Overview**: Visual summary of total students, attendance sessions, and quick links to logs and attendance.
- **Attendance Management**: Mark, view, and manage attendance records with real-time updates.
- **Student Management**: Add, view, and analyze student records and their attendance statistics.
- **Analytics & Reporting**: Visual analytics for attendance trends, top/bottom students, and exportable reports.
- **Issue Reporting**: Built-in form to report bugs, feature requests, or improvements.
- **Responsive UI**: Clean, modern, and mobile-friendly interface.

---

## Screenshots

### Login Page
![Login](read/Screenshot%202025-05-20%20103216.png)

### Dashboard
![Dashboard](read/Screenshot%202025-05-20%20103649.png)

### Attendance Logs
![Attendance Logs](read/Screenshot%202025-05-20%20103712.png)

### Student List
![Student List](read/Screenshot%202025-05-20%20103724.png)

### Report Issue
![Report Issue](read/Screenshot%202025-05-20%20103734.png)

---

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Radix UI, Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **APIs**: RESTful endpoints for authentication, students, attendance, analytics, and reports

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or pnpm
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd attendance-management-system
   ```
2. **Install backend dependencies:**
   ```bash
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   # or pnpm install
   ```
4. **Configure environment variables:**
   - Create a `.env` file in the root and set up your MongoDB URI and other secrets as needed.

5. **Run the backend server:**
   ```bash
   npm run dev
   ```
6. **Run the frontend app:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## Folder Structure

```
attendance-management-system/
├── frontend/         # Next.js frontend
├── models/           # Mongoose models
├── routes/           # Express API routes
├── middleware/       # Express middleware
├── config/           # DB and environment config
├── read/             # Screenshots and documentation images
├── server.js         # Express server entry point
└── README.md         # Project documentation
```

---

## About

The Attendance Management System is designed to streamline attendance tracking, provide actionable insights, and reduce administrative workload for educational institutions.

**Created BY AJ**

***NOTE : This project was generated using Ai So it may contains bugs, please fix it on your own***

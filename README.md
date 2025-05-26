# Multi-Tenant Task Management Backend

## Overview

This is the backend service for the Multi-Tenant Task Management application, built with Node.js, Express, and MongoDB. It provides REST APIs for authentication, task management, multi-tenant support, role-based access control, and task expiry handling via background jobs.

---

## Features

- **Multi-Tenant Architecture:** Isolates data per tenant using MongoDB.
- **Role-Based Access Control (RBAC):** Supports different user roles (e.g., admin, user) with scoped permissions.
- **Authentication:** JWT-based secure login and signup.
- **Task Management:** CRUD operations on tasks with expiry functionality.
- **Background Jobs:** Periodic job to expire tasks automatically.
- **API Documentation:** RESTful APIs following best practices.
- **Testing:** Unit and integration tests using Jest and Supertest.

---

## Prerequisites

- Node.js v18 or above
- MongoDB (local instance or cloud service like MongoDB Atlas)
- npm (comes with Node.js)
- Optional: Docker for containerization

---

## Getting Started

### Installation

Clone the repo and install dependencies:

```bash
cd backend
npm install

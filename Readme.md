# Bookstore Management App

## Description

This Bookstore Management App is a full-stack application designed to manage books and authors. It provides a user-friendly interface for adding, editing, deleting, and viewing detailed information about books and authors. The backend is built with Node.js and utilizes Prisma ORM for database interactions.

Features
List, add, edit, and delete books.
List, add, edit, and delete authors.
View detailed information about books including associated authors.
View detailed information about authors including a list of books written.
Technology Stack
Frontend: Angular
Backend: Node.js, Express
Database: MySQL (via Prisma ORM)
Additional Tools: Prisma, Nodemon for local development
Getting Started
Prerequisites
Node.js
MySQL database
Angular CLI

## Installation

### 1. Clone the repository

### 2. Install dependencies:

`npm install`

### 3. Set up the environment variables:

Copy the .env.example file to a new file called .env, and fill in the necessary database credentials and other configurations.

Run database migrations:

`npm run migrate`

Seed the database

`npm run seed`

Running the Application

Development mode:

`npm run dev`

Accessing the Application:

By default, the frontend can be accessed at http://localhost:4200

### Scripts

npm run dev: Runs the application in development mode using Nodemon.
npm run migrate: Performs database migrations using Prisma.
npm run seed: Seeds the database with initial data.
npm run eslint:fix: Runs ESLint to fix linting errors in the codebase.
npm test: Placeholder for running tests, needs to be configured.

### API Documentation

Check `/postman` directory on the backend

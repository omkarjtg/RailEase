# Simplified IRCTC Clone

## Project Overview

This project aims to build a simplified clone of the Indian Railways Catering and Tourism Corporation (IRCTC) system. It includes a backend system to manage train reservations, user authentication, train search, booking, and cancellation. The goal is to deliver a robust, thread-safe reservation system that is scalable and functional.

## Features

- **User Authentication**: Registration, login, and password management using JWT.
- **Train Search**: Search trains based on source, destination, and date.
- **Booking**: Reserve seats on available trains and receive booking confirmation.
- **Cancellation**: Cancel bookings and process refunds if applicable.

## Technology Stack

- **Backend**:
  - **Framework**: Spring Boot
  - **ORM**: Hibernate
  - **Database**: MySQL

- **Frontend**:
  - **Library**: React
  - **State Management**: Redux/Context API (optional)

- **Deployment**:
  - **Backend**: AWS/Heroku
  - **Frontend**: Vercel/Netlify

## Getting Started

### Prerequisites

- **Java 11 or higher**
- **Node.js and npm (for frontend)**
- **MySQL**

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/irctc-clone.git
   cd irctc-clone/backend

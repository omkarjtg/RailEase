# 🚆 RailEase

**RailEase** is a modern microservices-based railway reservation system built with Spring Boot, Spring Cloud, and React. It supports user authentication, train search, bookings, feedback management, and real-time notifications.

---

## 📦 Tech Stack

### Backend (Microservices)
- **Spring Boot 3+**
- **Spring Cloud (Eureka, Gateway, Config)**
- **Spring Security + JWT**
- **Spring Data JPA + Hibernate**
- **MySQL / H2**
- **FeignClient / RestTemplate**
- **Lombok**

### Frontend
- **React**
- **Axios**
- **Tailwind CSS / Bootstrap**

### Infrastructure
- **Eureka Service Registry**
- **API Gateway**
- **Spring Cloud Config**
- **Docker (Planned)**
- **RabbitMQ / Kafka (Future Integration)**

---

## 🧩 Microservices

| Service        | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| **UserService**     | Manages user registration, login, and role-based authentication (JWT). |
| **TrainService**    | Handles CRUD operations for trains and their schedule.                 |
| **BookingService**  | Manages ticket bookings, cancellations, and user-booking history.      |
| **LocationServicr** | Allows admins to add and manage train stations|
| **FeedbackService** | Allows users to leave and manage feedback on bookings. |
| **PaymentGateway** | Utilizes Razorpay SDK for booking payments |
| **NotificationService** | Sends booking confirmations and alerts (email/SMS).               |
| **API Gateway**     | Routes requests to respective microservices using Spring Cloud.                           |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven
- Node.js 18+
- MySQL / Docker (if using containers)

### Clone the Repository

```bash
git clone https://github.com/omkarjtg/RailEase.git
cd RailEase
```

### Backend Setup

Start Eureka, and Gateway services first, then the others:

```bash
cd backend
# Start Eureka Server
cd /EurerekaServer && mvn spring-boot:run

# Start API Gateway
cd ApiGateway && mvn spring-boot:run

cd
# Start all other services (user, train, booking, feedback, notification, payment, location) in similar manner
```

Each service typically runs on its own port and registers with Eureka.

### Frontend Setup

```bash
cd frontend
npm i
npm run dev
```

Visit: `http://localhost:5173`

---

## ✅ Features

- 🔐 JWT-based authentication and role-based access
- 🔍 Train search and real-time availability
- 🏧 Payments using razorpay SDK 
- 🎟️ Booking with seat management
- 📝 Feedback system per booking
- 📩 Notifications (planned integration with email/SMS)
- 🧭 Microservices architecture via Eureka + API Gateway


---

## 📸 UI Preview

![Screenshot_20250501_135300](https://github.com/user-attachments/assets/0756f829-a38e-40fd-ae33-4517084e1d21)

![Screenshot_20250501_135449](https://github.com/user-attachments/assets/948d41d7-ebb0-473c-8596-4bd10cde90e3)

![Screenshot_20250501_135529](https://github.com/user-attachments/assets/a599f994-10eb-4177-b7f4-e0a337a1ecb0)

![Screenshot_20250501_135529](https://github.com/user-attachments/assets/c67ff47a-cc3c-4e26-8fe6-a0e6f0c21ba3)

---

## 📚 Future Enhancements

- Containerization with Docker + Docker Compose
- Async notifications using RabbitMQ/Kafka
- Seat availability per Seat tier 
- Admin dashboard for analytics
- CI/CD via GitHub Actions

---

## 🤝 Contributing

PRs are welcome! For major changes, please open an issue first to discuss what you’d like to change.

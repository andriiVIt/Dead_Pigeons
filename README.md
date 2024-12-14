# Dead Pigeons Project

## Project Description

The Dead Pigeons Project is a web-based solution for managing a lottery-style game for the sports club Jerne IF. This system includes an admin dashboard for managing players, games, transactions, and boards, as well as a player dashboard for viewing games, transactions, and boards.

---
https://pigeonsdead.web.app/
## Features

### Admin Dashboard
- View statistics (players, boards, transactions, total balance).
- Add new games and players via buttons or modals.
- View recent winners, recent players, and recent transactions.

### Player Dashboard
- View available games.
- Manage personal boards and view transactions.

---

## Core Functionalities

### Players
- Create, view, update, and delete players.

### Games
- Create, view, and manage games.

### Transactions
- Log and view all financial transactions.

### Boards
- Manage player boards and assign them to games.

---

## Authentication and Authorization
- Role-based access control (Admin and Player).

---

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: .NET Web API
- **Database**: PostgreSQL
- **State Management**: Jotai
- **Authentication**: JWT
- **API Documentation**: Swagger
- **Containerization**: Docker, Docker Compose

---

## Installation and Setup

### Prerequisites
- **Node.js**
- **Docker and Docker Compose**
- **PostgreSQL**

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/andriiVIt/Dead_Pigeons.git
   cd DeadPigeons
2.Install Frontend Dependencies:
cd client
npm install
3.Build and Start Backend Services:
Ensure Docker is running.
Execute
docker-compose up --build
4.Start Frontend:
cd client
npm run dev
5.Access the Application:
cd client
npm run dev
5.Access the Application:

Admin Dashboard: http://localhost:5000/admin
Player Dashboard: http://localhost:5001/player


API Documentation
Swagger API documentation is available at: http://localhost:5000/swagger

Key Endpoints
Authentication: /api/auth
Players: /api/player
Games: /api/game
Boards: /api/board
Transactions: /api/transaction
## API Documentation

Swagger API documentation is available at: [http://localhost:5000/swagger](http://localhost:5000/swagger)

### Key Endpoints

| Endpoint          | Description                  |
|-------------------|------------------------------|
| `/api/auth`       | Authentication               |
| `/api/player`     | Players                      |
| `/api/game`       | Games                        |
| `/api/board`      | Boards                       |
| `/api/transaction`| Transactions                 |
| `/api/winner`     | Winners                      |

## Project Commands

### Frontend

| Command         | Description                      |
|-----------------|----------------------------------|
| `npm run dev`   | Start the development server.    |
| `npm run build` | Build the production bundle.     |
| `npm run lint`  | Run lint checks.                |

### Backend

| Command                        | Description                              |
|--------------------------------|------------------------------------------|
| `docker-compose up`            | Start backend services using Docker.     |
| `docker-compose down`          | Stop all running services.               |
| `docker-compose down --volumes`| Remove all volumes.                      |

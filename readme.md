# Full-Stack Template

---

## Overview

This is my go-to full-stack template for my projects. It's perfect for those seeking a mono-repo style full-stack application, 
using Docker to separate the front-end, back-end, and database. Additionally, it leverages the Docker Compose Watch tool
alongside prebuilt npm commands to accelerate development, reducing the need for manual environment tweaks.

## Technical stack
- **Frontend**: React with TypeScript
- **Backend**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Docker & Docker Compose

### How to Launch
1. Clone the repository:
   ```sh
   git clone https://github.com/balanced436/fullstack-template.git
   ```

2. Store your PostgreSQL connection information inside a *secrets* folder:
   ```
   secrets/
   ├── postgres_db.txt
   ├── postgres_password.txt
   └── postgres_user.txt
   ```

3. Run the application with Docker:
   ```sh
   cd fullstack-template && docker compose watch
   ```

## Available npm commands
These commands are available once you SSH into a running container.
```
docker exec -it <containerid> bash
```
### Backend
- `npm run test`- Runs the test suite.
- `npm run test -- --watchAll` - Triggers tests whenever your code changes using *watchAll* flag.

---
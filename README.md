# 🍊 Squish!

Squish solves the classic problem of heavy image processing on the web. Instead of forcing the user to wait on a single, long-running HTTP request (which can time out or degrade server performance), Squish utilizes a distributed queue architecture. The frontend orchestrates the flow using synthetic promises and polling, resulting in a buttery-smooth UX from drop to download.

## 💻 Tech Stack

### Frontend

- **Core:** React, TypeScript, Vite
- **Routing & State:** TanStack Router, TanStack Query (React Query)
- **UI & Styling:** Mantine, Tailwind CSS, Phosphor Icons, Gooey Toast
- **HTTP Client:** Axios
- **Tooling:** Bun

### Backend

- **API Framework:** Hono
- **Queue System:** BullMQ (backed by Redis)
- **Image Processing:** Sharp
- **Tooling:** Bun

## 🛠️ Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- Bun (v1.0+)
- Redis (Only required for Local Run)
- Docker Desktop (Only required for Docker Compose Run)

### 1. Clone & Install

Clone the repository and install the dependencies at the monorepo root:

```bash
git clone https://github.com/LeonardTarigan/squish.git
cd squish
bun install
```

### 2. Environment Variables

This project strictly isolates configuration using environment variables. You will need to set up .env files for the root and each individual workspace.

Copy the provided `.env.example` files to `.env` in the following locations:

```bash
# 1. Root level (for Docker Compose)
cp .env.example .env

# 2. Frontend application
cp apps/web/.env.example apps/web/.env

# 3. Main API
cp apps/api/.env.example apps/api/.env

# 4. Background Worker
cp apps/worker/.env.example apps/worker/.env
```

_(Make sure to open these new .env files and adjust any variables, like ports or API URLs, if necessary.)_

### 3. Running the Application

You have two options for running Squish: native local development (best for writing code) or Docker Compose (best for testing the full infrastructure).

#### Option A: Local Run (Native)

This method uses Turborepo to spin up all workspaces natively on your machine.

1. Ensure your local Redis server is running:
   ```bash
   redis-server
   ```
2. Start the development server from the root of the project:
   ```bash
   bun run dev
   ```

#### Option B: Docker Compose Run

This method spins up the entire stack in networked Docker containers using a single command.

1. Start the Docker Compose stack in detached mode:
   ```bash
   bun run infra:up
   ```
2. Open your browser and navigate to the frontend URL.
3. When you are done, gracefully spin down the infrastructure:
   ```bash
   bun run infra:down
   ```

## 🏗️ Architecture

Squish is built on an asynchronous queue-based architecture.

### Why this architecture?

1. **The Node.js Single Thread Problem:** Image compression (via Sharp) is highly CPU-intensive. If we processed images synchronously within the API route, a few concurrent uploads would completely block the Node.js event loop, paralyzing the entire backend.
2. **The HTTP Timeout Problem:** Large files take time to compress. Standard HTTP requests might time out before the server finishes the job.
3. **The Solution (BullMQ + Polling):** By offloading the heavy lifting to a BullMQ worker, the main Hono API remains blazing fast and instantly available. The frontend simply asks for a `jobId` and polls for updates, completely eliminating timeouts and providing real-time UI feedback.

### The Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Frontend (TanStack Query)
    participant A as Hono API
    participant Q as BullMQ (Redis)
    participant W as Sharp Worker

    C->>A: POST /media/upload (FormData)
    A->>Q: Add job to queue { jobId, path }
    A-->>C: Return { jobId }

    Note over C, A: Client enters polling state
    loop Polling with Exponential Backoff (up to 10s)
        C->>A: GET /jobs/{jobId}
        A-->>C: Return { state: 'waiting' | 'active' }
    end

    Q->>W: Process image to WebP
    W->>Q: Mark job as 'completed'

    C->>A: GET /jobs/{jobId}
    A-->>C: Return { state: 'completed' }
    Note over C: Polling stops, Download unlocks

    C->>A: GET /media/download/{jobId}
    A-->>C: Stream WebP (Blob)
```

### Frontend Architecture

To keep the React layer clean, the frontend is strictly separated into distinct layers:

- **Transport Layer**: Axios interceptors handle global error catching.
- **API Layer**: Isolated functions for network calls (`uploadImage`, `getJobStatus`, `downloadImage`).
- **Server State Layer**: TanStack Query hooks handle the polling lifecycle and mutations.
- **Business Logic Layer**: A custom useCompressor hook orchestrates synthetic promises (via `goey-toast`), local object URLs, and React state.
- **Presentation Layer**: The view component is purely declarative, rendering Mantine components based on the hook's state.

### Backend Architecture

To ensure the API remains non-blocking and highly maintainable, the backend is strictly divided into functional layers:

- **Controller Layer (Hono)**: Acts as the entry point. It receives HTTP requests, parses FormData, and handles the final HTTP responses.
- **Validation Layer (Zod)**: Enforces strict runtime checks before any logic is executed. It ensures uploaded files exist, match the correct MIME types, and do not exceed the 20MB limit.
- **Service Layer (Hono)**: Contains the core business logic. It handles saving temporary files to the disk, generating unique UUIDs, and acting as the bridge between the controllers and the queue system.
- **Queue Orchestration Layer (BullMQ / Redis)**: Manages the asynchronous job lifecycle. It holds pending jobs in memory, passes them to available workers, and updates job states.
- **Worker & Processing Layer (Sharp)**: The isolated execution environment. It picks up the jobId and file path from BullMQ, compresses the image into WebP format using Sharp, saves the output to the disk, and signals job completion.

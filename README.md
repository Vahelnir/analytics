# Analytics

[Github](https://github.com/Vahelnir/analytics)

A school project created to learn how to use MongoDB.

I tried tech I hadn't used before, like [TRPC](https://github.com/trpc/trpc), [React Query](https://github.com/TanStack/query) and [React](https://github.com/facebook/react/) which I never really used for a project yet.

## Getting started

### Development environment

1. You have to install Node, [PNPM](https://pnpm.io/installation) and Docker (with docker compose)
2. Go to the project root directory
3. Install dependecies

   ```shell
   pnpm install
   ```

4. Start the mongo & mongo-express services:

   ```shell
   docker compose up -d
   ```

5. To start a project in dev mode:

- Backend:

  ```shell
  cd backend/
  pnpm dev
  ```

- frontend:

  ```shell
  cd frontend/
  pnpm dev
  ```

- engine:

  ```shell
  cd engine/
  pnpm dev
  ```

6. You can build the whole project by using (can be run anywhere in the project)

   ```shell
   pnpm -r build
   ```

### Docker

1. Build the images:

   ```shell
   docker compose -f prod.docker-compose.yml build
   ```

2. Start every services:

   ```shell
   docker compose -f prod.docker-compose.yml up -d
   ```

3. URLs:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:8080
4. You can import the `users-dump.json` into your database as the `users` collection.
5. The user is
   - email: `utilisateur@site.fr`
   - password: `utilisateur`

### Data generation

The data generation script will generate fake data for the two applications of the dumped user: 'Application 1' and
'Application 2'.

1. You have to start your mongo database &
2. `pnpm install` if not already done
3. `cd fake-data-generator`
4. `node index.mjs`
5. Stop the script whenever you want
6. See the data

## Explainations

### Backend

The backend is build with Fastify, TRPC and Mongoose.
The whole API (except one endpoint) is made using TRPC.

POST `/emitEvent`:

- formData:
  ```ts
  {
    data: Record<string, any>;
    event: string;
    clientTime: string;
    isCustom: boolean; // should be true for any custom sent events
    applicationId: string;
  }
  ```

### Frontend

The frontend is build with Vite & React, using the TRPC Client with React Query.

It is also using Tailwing with BulmaCSS (and the front is
still ugly but well...)

### Engine

The engine exposes a namespace in window:

```ts
type AnalyticsConfig = { applicationId: string };

interface Window {
  analytics: {
    /**
     * Emit a custom event
     */
    emit(event: string, data: Record<string, unknown>): void;
    /**
     * Initialize the Analytics engine
     */
    init(config: AnalyticsConfig): void;
  };
}
```

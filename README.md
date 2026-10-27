# Inventory and Warehouse Management (NestJS MVP)
nice 

Hybrid architecture:
- `api-gateway` exposes REST API
- domain services (`product`, `warehouse`, `inventory`, `order`, `notification`) communicate via RabbitMQ
- Postgres is used for persistence (TypeORM)
- Redis is used for cache and idempotency

## Local setup

1) Install dependencies:
```bash
pnpm install
```

2) Create env file:
```bash
cp .env.example .env
```

3) Start infrastructure:
```bash
docker compose up -d
```

## Run services

Run each service in separate terminals:

```bash
pnpm nest start api-gateway --watch
pnpm nest start product-service --watch
pnpm nest start warehouse-service --watch
pnpm nest start inventory-service --watch
pnpm nest start order-service --watch
pnpm nest start notification-service --watch
```

## Core APIs (Gateway)

Base URL: `http://localhost:3000/api/v1`

- `GET /health`
- `POST /products`
- `GET /products`
- `GET /products/:id`
- `POST /warehouses`
- `GET /warehouses`
- `POST /inventory/adjust`
- `POST /inventory/reserve`
- `GET /inventory/available?productId=<uuid>&warehouseId=<uuid>`
- `POST /orders`
- `GET /orders/:id`

Swagger: `http://localhost:3000/api/docs`

## Service health checks

- Inventory dependencies: `GET http://localhost:3001/inventory/health`

## Event flow (MVP)

- Order creation reserves stock in inventory service
- Inventory service emits stock events:
  - `inventory.stock.adjusted`
  - `inventory.stock.low`
  - `inventory.stock.out`
- Notification service consumes low/out-of-stock events

## Type check

```bash
pnpm exec tsc -p tsconfig.json --noEmit
```

# 🌤️ Weather API

> Project proposed by [roadmap.sh](https://roadmap.sh/projects/weather-api)

A REST API built with **Node.js + Express** that fetches weather data from [Visual Crossing](https://www.visualcrossing.com/), caches responses in **Redis Cloud** for 12 hours, and serves a static frontend for quick lookups.

## Features

- 🌍 Weather data by city name via Visual Crossing API
- ⚡ In-memory caching with Redis (12h TTL) — avoids redundant external calls
- 🛡️ Rate limiting (100 requests / 15 min per IP)
- 🖥️ Static frontend served from `/public`
- 🔐 Environment variables for all secrets

## Project Structure

```
weather-api/
├── public/
│   └── weather.html        # Frontend estático
├── src/
│   ├── config/
│   │   └── redisConnection.js
│   ├── routes/
│   │   └── weather.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Visual Crossing](https://www.visualcrossing.com/) free API key
- A [Redis Cloud](https://redis.io/cloud/) free instance (or any Redis server)

### Installation

```bash
git clone https://github.com/Lucas-Steffen/weather-api.git
cd weather-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3301

# Visual Crossing
WEATHER_API_URL=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
WEATHER_API_KEY=your_visual_crossing_key

# Redis Cloud
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_SOCKET_HOST=your-redis-host.redis.cloud
REDIS_SOCKET_PORT=6379
```

### Run

```bash
# Development (with nodemon)
npm run dev
```

The server will start at `http://localhost:3301`.

## API

### `GET /weather?city={city}`

Returns weather data for the given city. Cached for 12 hours.

**Query Parameters**

| Param | Type   | Required | Description      |
|-------|--------|----------|------------------|
| city  | string | ✅       | City name or code |

**Example**

```bash
curl "http://localhost:3301/weather?city=Sinop"
```

**Success Response** — `200 OK`

```json
{
  "resolvedAddress": "Sinop",
  "timezone": "America/Cuiaba",
  "currentConditions": { ... },
  "days": [ ... ]
}
```

**Error Responses**

| Status | Body                            | Reason                    |
|--------|---------------------------------|---------------------------|
| 400    | `{ "error": "City is required!" }` | Missing `city` param   |
| 429    | Too Many Requests               | Rate limit exceeded       |
| 5xx    | Upstream / Redis error          | External service failure  |

## Caching Strategy

Every successful response is stored in Redis with the key `weather:{city}` and an expiration of **12 hours**. Subsequent requests for the same city are served directly from the cache without hitting the Visual Crossing API.

```
Request → Redis hit?  ──Yes──▶ Return cached JSON
               │
              No
               │
               ▼
        Visual Crossing API
               │
               ▼
        Store in Redis (TTL 12h)
               │
               ▼
        Return JSON
```

## Rate Limiting

Configured via `express-rate-limit`:

- **Window:** 15 minutes
- **Max requests:** 100 per IP

## Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| Runtime      | Node.js (ESM)            |
| Framework    | Express 5                |
| HTTP Client  | Axios                    |
| Cache        | Redis (via `redis` v5)   |
| Rate Limit   | express-rate-limit       |
| Weather Data | Visual Crossing API      |
| Dev          | nodemon + dotenv         |

## License

ISC
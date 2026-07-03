# AI Chat

Full-stack chat app with a React frontend and Spring Boot backend. The backend calls Google's Gemini API.

## Requirements

- Java 21 or newer
- Node.js 20 or newer
- Gemini API key

## Backend Setup

Create a local env file:

```powershell
cd ai_chat
Copy-Item .env.example .env
notepad .env
```

Set your real key in `ai_chat/.env`:

```properties
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Run the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

## Frontend Setup

In a second terminal:

```powershell
cd Frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Build Checks

```powershell
cd ai_chat
.\mvnw.cmd test

cd ..\Frontend
npm run build
```

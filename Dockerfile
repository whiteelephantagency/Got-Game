# ---------- Backend ----------
FROM node:18-alpine AS backend

WORKDIR /app/backend
COPY backend/server/package*.json ./
RUN npm install
COPY backend/server .
RUN npm run build || true


# ---------- Frontend ----------
FROM node:18-alpine AS frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build


# ---------- Production ----------
FROM node:18-alpine

WORKDIR /app
COPY --from=backend /app/backend ./backend
COPY --from=frontend /app/frontend/dist ./public

RUN npm install -g serve

ENV PORT=8080
EXPOSE 8080

CMD ["serve", "-s", "public", "-l", "8080"]

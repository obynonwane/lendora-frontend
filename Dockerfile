# Use official Node.js image as base
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy all files and build the Next.js app
COPY . .
RUN npm run build

# ---------------------
# Production stage
# ---------------------
FROM node:18-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port 4000
EXPOSE 4000

# Start the Next.js app on port 4000
CMD ["npm", "run", "start", "--", "-p", "4000"]

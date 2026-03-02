# 1. Use an official Node.js image as the base
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first to leverage Docker's cache
COPY package.json yarn.lock* package-lock.json* ./

# 4. Install dependencies
RUN yarn install --frozen-lockfile || npm ci

# 5. Copy the rest of your application code
COPY . .

# 6. Build the app (if it's a framework like React, Vue, or Next.js)
RUN yarn build || npm run build

# 7. Expose the port your app runs on
EXPOSE 3000

# 8. Start the application
CMD ["yarn", "start"]

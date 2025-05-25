FROM node:18

# Set working directory
WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server using nodemon for live-reloading
CMD ["nodemon", "server.js"]

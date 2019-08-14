FROM node:10.16.2-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Compile typescript to javascript
RUN npm run build

# Export port and start application
EXPOSE 80
CMD ["npm", "run", "prod"]
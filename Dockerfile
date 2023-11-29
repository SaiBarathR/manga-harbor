# Use an official Node.js runtime as the base image
FROM node:20-alpine

ENV NODE_ENV development

# Set the working directory in the container
WORKDIR /manga-harbor-docker

# Copy the current directory contents into the container at /app
COPY ./package*.json /manga-harbor-docker

# Install any needed packages specified in requirements.txt
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NAME manga-harbor-docker

# Run app.py when the container launches
CMD ["npm", "start"]


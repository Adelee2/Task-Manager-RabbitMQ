# Task Management System

This repository contains a Task Management System implemented using Node.js, Express.js, RabbitMQ, MongoDB, and Docker. The system provides RESTful API endpoints for managing tasks and utilizes RabbitMQ for efficient message queuing. MongoDB is used as the database for storing task information, and Docker is employed for containerization.

## Build RabbitMQ image
docker build -t rabbitmq-image -f Dockerfile.rabbitmq .

## Build MongoDB image
docker build -t mongodb-image -f Dockerfile.mongodb .


## Running app
docker-compose up -d

## API ROUTES
- Login:
    URL: http://localhost:3001/api/login
    Method: POST
    Description: Endpoint for user authentication.

- Create Task:
    URL: http://localhost:3001/api/tasks
    Method: POST
    Description: Create a new task by publishing task to RabiitMQ.

- Get Tasks:

    URL: http://localhost:3001/api/tasks
    Method: GET
    Description: Retrieve all tasks.

- Get Single Task:
    URL: http://localhost:3001/api/tasks/:taskId
    Method: GET
    Description: Retrieve a single task by ID.

- Update Single Task:
    URL: http://localhost:3001/api/tasks/:taskId
    Method: PUT
    Description: Update a single task by ID.

- Delete Single Task:
    URL: http://localhost:3001/api/tasks/:taskId
    Method: DELETE
    Description: Delete a single task by ID.

- Webhooks:
    URL: http://localhost:3001/webhooks
    Method: GET
    Description: Receive a published event.

### Note: 
  - ensure the container name for the rabbitmq and mongodb is the same as the one in app.js
  - Ensure you have docker installed on your local machine

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib');
const winston = require('winston');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('./controllers/taskController');
const {login} = require('./controllers/loginController')
const { subscribeWebhook } = require('./controllers/webhookController');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// RabbitMQ setup
const RABBITMQ_URL = 'amqp://oneport365-rabbitmq-1';
let channel;

async function setupRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const ch = await connection.createChannel();

    const exchange = 'tasks';
    const queue = 'task_queue';

    await ch.assertExchange(exchange, 'fanout', { durable: false });
    await ch.assertQueue(queue, { durable: true });
    await ch.bindQueue(queue, exchange, '');

    console.log('RabbitMQ setup successful');
    return ch;
  } catch (err) {
    console.error('Error setting up RabbitMQ:', err);
    throw err;
  }
}
mongoose.connect('mongodb://oneport365-mongodb-1/task_management', { useNewUrlParser: true, useUnifiedTopology: true });

// Express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup RabbitMQ and start server
setupRabbitMQ()
  .then((ch) => {
    channel = ch;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Exiting application due to RabbitMQ setup error:', err);
    process.exit(1);
  })
//Auth routes
app.post('/api/login',login);
// Task routes
app.post('/api/tasks', authMiddleware, createTask);
app.get('/api/tasks', authMiddleware, getTasks);
app.get('/api/tasks/:taskId', authMiddleware, getTaskById);
app.put('/api/tasks/:taskId', authMiddleware, updateTask);
app.delete('/api/tasks/:taskId', authMiddleware, deleteTask);

// Webhook routes
app.post('/webhooks', subscribeWebhook);

// Error handling middleware
app.use((err, req, res, next) => {
  winston.error(err.message, err);
  res.status(500).json({ error: 'Internal Server Error' });
});

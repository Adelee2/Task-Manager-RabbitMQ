const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const winston = require('winston');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('./controllers/taskController');
const {login} = require('./controllers/loginController')
const { subscribeWebhook } = require('./controllers/webhookController');
const authMiddleware = require('./middlewares/authMiddleware');
const rabbitmqMiddleware = require('./middlewares/rabbitmqMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://oneport365-mongodb-1/task_management', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(rabbitmqMiddleware);
// Express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

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

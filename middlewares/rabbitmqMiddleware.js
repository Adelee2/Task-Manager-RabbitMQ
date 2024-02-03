const amqp = require('amqplib')
const winston = require('winston')

const RABBITMQ_URL = 'amqp://oneport365-rabbitmq-1'

const setupRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL)
  const channel = await connection.createChannel()

  const exchangeName = 'tasks'
  await channel.assertExchange(exchangeName, 'fanout', { durable: false })

  const queueName = 'task_queue'
  await channel.assertQueue(queueName, { durable: true })

  await channel.bindQueue(queueName, exchangeName, '')

  return channel
}

const rabbitmqMiddleware = async (req, res, next) => {
  try {
    const channel = await setupRabbitMQ()
    req.channel = channel
    next()
  } catch (error) {
    winston.error('Error setting up RabbitMQ:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = rabbitmqMiddleware

const amqp = require('amqplib');

async function startConsumer() {
  const RABBITMQ_URL = 'amqp://oneport365-rabbitmq-1';
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const exchange = 'tasks';
  const queue = 'task_queue';

  await channel.assertExchange(exchange, 'fanout', { durable: false });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, '');

  console.log('Consumer waiting for messages. To exit, press CTRL+C');

  channel.consume(queue, (message) => {
    if (message) {
      const content = message.content.toString();
      console.log(`Received message: ${content}`);
      channel.ack(message);
    }
  });
}

startConsumer().catch((error) => console.error('Error starting consumer:', error));

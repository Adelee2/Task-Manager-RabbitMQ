const axios = require('axios');

const subscribers = [];

exports.subscribeWebhook = (req, res) => {
  const { url } = req.body;

  subscribers.push(url);

  res.json({ message: 'Webhook subscribed successfully' });
};

exports.publishEvent = (channel, eventType, eventData) => {
  const message = JSON.stringify({ type: eventType, data: eventData });

  subscribers.forEach((url) => {
    // Send HTTP POST request to subscriber's URL
    axios.post(url, { event: eventType, data: eventData })
      .then(() => console.log(`Event sent to ${url}`))
      .catch((error) => console.error(`Error sending event to ${url}:`, error));
  });

  // Publish event to RabbitMQ
  channel.publish('tasks', '', Buffer.from(message));
};

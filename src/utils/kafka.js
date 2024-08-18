const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka producer connected");
};

const disconnectProducer = async () => {
  await producer.disconnect();
};

const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message sent successfully to topic ${topic}`);
  } catch (error) {
    console.error(`Failed to send message to topic ${topic}:`, error);
  }
};

module.exports = {
  connectProducer,
  disconnectProducer,
  sendMessage,
};

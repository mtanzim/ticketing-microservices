import nats from "node-nats-streaming";

console.clear();

const TOPIC = "ticket:created";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("connected");
  const data = {
    id: "123",
    title: "concert",
    price: 20,
  };
  stan.publish(TOPIC, JSON.stringify(data), () => {
    console.log("event published");
  });
});

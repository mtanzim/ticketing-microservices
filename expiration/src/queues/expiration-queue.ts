import Queue from "bull";

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process?.env?.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("will publish expiration for: ", job.data.orderId);
});

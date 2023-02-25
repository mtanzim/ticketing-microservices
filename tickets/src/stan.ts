import nats from "node-nats-streaming";

let stan: nats.Stan;

export function getStan(): nats.Stan | never {
  if (!stan) {
    throw new Error("NATS was not initialized!");
  }
  return stan;
}

export function startNATS() {
  const clusterId = process.env.CLUSTER_ID;
  const clientId = process.env.CLIENT_ID;
  const natsURL = process.env.NATS_URL;
  if (!clusterId || !clientId || !natsURL) {
    throw new Error("CLIENT_ID and CLUSTER_ID must be defined for NATS");
  }

  stan = nats.connect(clusterId, clientId, {
    url: natsURL,
  });

  stan.on("connect", async () => {
    console.log("nats connected");
  });
}

import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;
  async connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("nats connected");
        resolve();
      });
      this._client!.on("error", (err) => {
        reject(err);
      });
    });
  }
  client(): Stan | never {
    if (!this._client) {
      throw new Error("nats client was not initialized");
    }
    return this._client;
  }
}
export const natsWrapper = new NatsWrapper();

// let stan: nats.Stan;

// export function getStan(): nats.Stan | never {
//   if (!stan) {
//     throw new Error("NATS was not initialized!");
//   }
//   return stan;
// }

// export function startNATS() {

//   stan = nats.connect(clusterId, clientId, {
//     url: natsURL,
//   });

//   stan.on("connect", async () => {
//     console.log("nats connected");
//   });
// }

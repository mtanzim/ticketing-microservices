# ticketing-microservices

[Course](https://www.udemy.com/course/microservices-with-node-js-and-react)

Creating a microservices based application for ticketing using the MERN tech stack. The infrastructure is managed with `k8s` and related technologies.

## Concepts to reference in the future

### Kubernetes

- Kubernetes config (ClusterIP services, ingress controllers, NodePort for debug, load balancer service) and `skaffold` for local dev
- Creating secrets with `kubectl` and mapping to env variables in pods
- `kubernetes` namespaces: how to reach back to the ingress-nginx-controller from a pod (`nextjs` server in this case)

![K8s namespaces](./assets/k8-namespace.png "namespaces")

- A few helpful commands:

```bash
kubectl get services
kubectl get namespace
kubectl get services -n ingress-nginx
kubectl port-forward <pod-name> 4222:4222
```

### Node backend

- Mongoose ORM usage (statics, pre save hooks etc)
- Password hashing in NodeJS
- Making TS and Mongoose play nice
- `toJSON` method in `mongoose`
- Setting cookies in `express`
- Extending `express` types:

```ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
```

- Jest setup config in `package.json`, ie: setting up `env` vars
- User `supertest` and `mongo-memory-server` for integration tests

### Authentication

- JWT vs Cookies

![Why JWT](./assets/jwt.jpg "jwt")

### NextJS

- [Importing global css](./client/pages/_app.js)
- `getInitialProps` gets executed on the client side iff next app redirects from a page! Otherwise it is executed on the server, [see example](https://github.com/mtanzim/ticketing-microservices/blob/2920efa4fdcee790d6145bab36f76281fe37a58a/client/pages/index.js#L12)
  - See helper function [here](https://github.com/mtanzim/ticketing-microservices/blob/cda21452e55b43af384f28f834205f5e5177080e/client/api/buildClient.js#L3) to abstract out this complexity
  - See how we can access helper functions in pages through `getInitialProps` [here](https://github.com/mtanzim/ticketing-microservices/blob/cda21452e55b43af384f28f834205f5e5177080e/client/pages/_app.js#L24)
- See clever usage of hooks to abstract out api calls [here](https://github.com/mtanzim/ticketing-microservices/blob/cda21452e55b43af384f28f834205f5e5177080e/client/hooks/useRequest.js#L4)
- Note the convention for dynamic routes [here](https://github.com/mtanzim/ticketing-microservices/blob/cda21452e55b43af384f28f834205f5e5177080e/client/pages/tickets/[ticketId].js#L12) nad [here](https://github.com/mtanzim/ticketing-microservices/blob/cda21452e55b43af384f28f834205f5e5177080e/client/pages/tickets/index.js#L24)
- Be careful about what code runs on the server vs the browser
- TODO: research `useEffect` differences b/w SSR and SPAs

### NPM Modules

- Creating NPM orgs, publishing and patching modules
- Setting up JS transpilation for TS modules

### NATS Streaming Server

- [Documentation](https://github.com/nats-io/nats-streaming-server#nats-streaming-server)
- [Simple example](./nats-example/)

#### Topics and Storage

![NATS Streaming Topics](./assets/nats-topics.jpg "topics")

![NATS Storage](./assets/nats-storage.jpg "storage")

#### Queue Groups

- [Example code](https://github.com/mtanzim/ticketing-microservices/blob/f92a066ad6cc621fbf4741bf0b02e40a0f99f4f0/nats-example/src/listener.ts#L15)

![NATS Queue Groups](./assets/nats-queue-group.jpg "queue groups")

#### General event based architecture

![Event based architecture](./assets/event-arch.jpg "arch")

#### Handling failed publishes

- Use a DB tx to log events in addition to the data updates
- If a publish succeeds, update a flag to mark the event published
- Run a background process to periodically publish unpublished events
- See following diagram for an example

![Missed publishes](./assets/publish-fail.jpg "failed publish")

- Note that the project code does not implement this

### Jest

- [Suite wide mocks](https://github.com/mtanzim/ticketing-microservices/blob/ee2b110fddc9685afd2332dd8172e19cb9774b1b/tickets/src/test/setup.ts#L4)

### Shared code and interfaces b/w services

- See the associated [library](https://github.com/mtanzim/ticketing-microservices-common) published on `npm`
- Regarding shared types and event definitions, we used `Typescript`, ie:
  - [Ticket created event](https://github.com/mtanzim/ticketing-microservices/blob/07cb5822c1854b70db7b26e4d46f3479a40db155/src/events/ticket-created-event.ts#L3)
  - [Ticket updated event](https://github.com/mtanzim/ticketing-microservices/blob/07cb5822c1854b70db7b26e4d46f3479a40db155/src/events/ticket-updated-event.ts#L3)
  - [Subjects](https://github.com/mtanzim/ticketing-microservices/blob/07cb5822c1854b70db7b26e4d46f3479a40db155/src/events/subjects.ts#L1)
- Alternatives to the above include Apache Avro, JSONSchem, Protobuf

### Summary of events and data models

- See the `models`, and `events` folders in the code

![Events and models](./assets/events-summary.png "events and models")

### Workflows

- Monorepo vs multi-repo
- Most companies (even large ones) using microservices use monorepos? Confirm this statement
- [Github actions](./.github/workflows/) to manage testing and deploying changes to individual services (ie: auth, tickets etc.)
  - Note the usage of docker hub to manage images of services
  - Note the GH action helpers to access `doctl` and alike

### Further Reading and relevant tools

- [Hosting k8s cluster on digital ocean](https://try.digitalocean.com/kubernetes-in-minutes)
- [doctl](https://docs.digitalocean.com/reference/doctl/)
- [Accessing multiple clusters through kubectl](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters)
- [kubectl cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

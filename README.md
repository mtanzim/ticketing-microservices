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

### NPM Modules

- Creating NPM orgs, publishing and patching modules
- Setting up JS transpilation for TS modules

### NATS Streaming Server

- [Documentation](https://github.com/nats-io/nats-streaming-server#nats-streaming-server)

#### Topics and Storage

![NATS Streaming Topics](./assets/nats-topics.jpg "topics")

![NATS Storage](./assets/nats-storage.jpg "storage")

#### Queue Groups

- [Example code](https://github.com/mtanzim/ticketing-microservices/blob/f92a066ad6cc621fbf4741bf0b02e40a0f99f4f0/nats-example/src/listener.ts#L15)

![NATS Queue Groups](./assets/nats-queue-group.jpg "queue groups")


#### General event based architecture 

![Event based architecture](./assets/event-arch.jpg "arch")
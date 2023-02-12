# ticketing-microservices

[Course](https://www.udemy.com/course/microservices-with-node-js-and-react)

Creating a microservices based application for ticketing using the MERN tech stack. The infrastructure is managed with `k8s` and related technologies.

## Concepts to reference in the future

### Kubernetes

- Kubernetes config (ClusterIP services, ingress controllers, NodePort for debug, load balancer service) and `skaffold` for local dev
- Creating secrets with `kubectl` and mapping to env variables in pods

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

### Authentication

- JWT vs Cookies

![Why JWT](./assets/jwt.jpg "jwt")

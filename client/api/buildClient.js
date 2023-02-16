import axios from "axios";

export default function buildClient({ req }) {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made to ingress-controller in a separate namespace
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req?.headers,
    });
  } else {
    // we are on the browser
    // requests can be made to the base url
    return axios.create({
      baseURL: "/",
    });
  }
}
